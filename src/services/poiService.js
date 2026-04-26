import https from 'https';

import RouteModel from '../models/routeModel.js';

import { errors } from '../utils/appErrors.js';
import {
  AMENITY_TYPES,
  LANDMARKS_PER_CHUNK,
  OVERPASS_REQUEST_DELAY_MS,
  OVERPASS_RETRY_ATTEMPTS,
  OVERPASS_RETRY_BASE_DELAY_MS,
  POIS_PER_LANDMARK,
  SEARCH_RADIUS_M,
} from '../utils/constants.js';
import { AppError, BadRequestError, InternalServerError, NotFoundError } from '../utils/httpErrors.js';

function chunkLandmarks(landmarks, size) {
  const chunks = [];
  for (let i = 0; i < landmarks.length; i += size) {
    chunks.push(landmarks.slice(i, i + size));
  }
  return chunks;
}

function buildBboxQuery(chunk) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const p of chunk) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }
  const latPad = SEARCH_RADIUS_M / 111320;
  const centerLat = (minLat + maxLat) / 2;
  const lngPad = SEARCH_RADIUS_M / (111320 * Math.cos((centerLat * Math.PI) / 180));
  const bbox = [minLat - latPad, minLng - lngPad, maxLat + latPad, maxLng + lngPad].join(',');
  const amenityFilter = `[amenity~"^(${AMENITY_TYPES.join('|')})$"]`;
  return `[out:json][timeout:25];\nnode${amenityFilter}(${bbox});\nout body;`;
}

function overpassPost(query) {
  return new Promise((resolve, reject) => {
    const body = `data=${encodeURIComponent(query)}`;
    const req = https.request(
      {
        hostname: 'overpass-api.de',
        path: '/api/interpreter',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      res => {
        let raw = '';
        res.on('data', chunk => (raw += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            resolve({ status: res.statusCode, data: null });
            return;
          }
          try {
            resolve({ status: 200, data: JSON.parse(raw) });
          } catch {
            reject(new Error(`Overpass parse error: ${raw.slice(0, 100)}`));
          }
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function overpassPostWithRetry(query) {
  let last;
  let delay = OVERPASS_RETRY_BASE_DELAY_MS;
  for (let attempt = 0; attempt < OVERPASS_RETRY_ATTEMPTS; attempt++) {
    last = await overpassPost(query);
    if (last.status === 200) return last;
    if (last.status !== 429 && last.status !== 504) return last;
    if (attempt < OVERPASS_RETRY_ATTEMPTS - 1) {
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
  return last;
}

function selectTopPois(pois, limit) {
  const sorted = [...pois].sort((a, b) => {
    if (a.distanceFromLandmark !== b.distanceFromLandmark) {
      return a.distanceFromLandmark - b.distanceFromLandmark;
    }
    const nameA = a.name ? 0 : 1;
    const nameB = b.name ? 0 : 1;
    return nameA - nameB;
  });

  const seen = new Set();
  const result = [];
  for (const poi of sorted) {
    if (seen.has(poi.amenity)) continue;
    seen.add(poi.amenity);
    result.push(poi);
    if (result.length >= limit) break;
  }
  return result;
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const PoiService = {
  async getPoisAlongRoute(req) {
    try {
      const { id } = req.params;
      const { userId } = req;
      const routeIndex = req.query.routeIndex ? parseInt(req.query.routeIndex, 10) : 0;

      const saved = await RouteModel.findOne({ _id: id, userId }).lean();
      if (!saved) throw new NotFoundError('Route not found');

      const route = saved.routes[routeIndex];
      if (!route) throw new BadRequestError(`No route at index ${routeIndex}`);

      if (saved.pois?.[routeIndex]) {
        return { routeId: id, routeIndex, pois: saved.pois[routeIndex] };
      }

      const landmarks = route.steps.map((step, index) => ({
        index,
        lng: step.maneuver.location[0],
        lat: step.maneuver.location[1],
        instruction: step.instruction,
        streetName: step.name || null,
      }));

      if (landmarks.length === 0) {
        return { routeId: id, routeIndex, pois: [] };
      }

      const chunks = chunkLandmarks(landmarks, LANDMARKS_PER_CHUNK);
      const seenIds = new Set();
      const elements = [];
      for (let i = 0; i < chunks.length; i++) {
        if (i > 0) await new Promise(r => setTimeout(r, OVERPASS_REQUEST_DELAY_MS));
        const { status, data: json } = await overpassPostWithRetry(buildBboxQuery(chunks[i]));
        if (status !== 200) throw new InternalServerError(`Overpass API error: ${status}`);
        if (!Array.isArray(json.elements)) continue;
        for (const el of json.elements) {
          if (seenIds.has(el.id)) continue;
          seenIds.add(el.id);
          elements.push(el);
        }
      }

      const poisByLandmark = {};
      for (const el of elements) {
        if (!el.tags?.amenity) continue;

        let nearestIndex = null;
        let nearestDist = Infinity;
        for (const dp of landmarks) {
          const dist = haversineDistance(dp.lat, dp.lng, el.lat, el.lon);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestIndex = dp.index;
          }
        }

        if (nearestIndex === null || nearestDist > SEARCH_RADIUS_M) continue;

        if (!poisByLandmark[nearestIndex]) poisByLandmark[nearestIndex] = [];
        poisByLandmark[nearestIndex].push({
          id: el.id,
          amenity: el.tags.amenity,
          name: el.tags.name || null,
          lat: el.lat,
          lng: el.lon,
          distanceFromLandmark: nearestDist,
        });
      }

      const pois = landmarks
        .filter(dp => poisByLandmark[dp.index]?.length > 0)
        .map(dp => ({
          landmarkIndex: dp.index,
          instruction: dp.instruction,
          streetName: dp.streetName,
          location: [dp.lng, dp.lat],
          nearbyPois: selectTopPois(poisByLandmark[dp.index], POIS_PER_LANDMARK),
        }));

      await RouteModel.updateOne({ _id: id, userId }, { $set: { [`pois.${routeIndex}`]: pois } });

      return { routeId: id, routeIndex, pois };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(`${errors.INTERNAL_ERROR}: ${error.message}`, error);
    }
  },
};

export default PoiService;
