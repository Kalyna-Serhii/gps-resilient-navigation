const geocode = {
  '/api/geocode/search': {
    get: {
      tags: ['Geocode'],
      summary: 'Search for places by name or address',
      parameters: [
        { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search query (address, place name, etc.)' },
        { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 5, minimum: 1, maximum: 50 }, description: 'Maximum number of results' },
      ],
      responses: {
        200: {
          description: 'Search results',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  results: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        lat: { type: 'number' },
                        lng: { type: 'number' },
                        displayName: { type: 'string' },
                        type: { type: 'string' },
                        address: { type: 'object' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: 'Missing or invalid query parameter' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal error' },
      },
    },
  },
  '/api/geocode/reverse': {
    get: {
      tags: ['Geocode'],
      summary: 'Get address from coordinates (reverse geocoding)',
      parameters: [
        { name: 'lat', in: 'query', required: true, schema: { type: 'number' }, description: 'Latitude' },
        { name: 'lng', in: 'query', required: true, schema: { type: 'number' }, description: 'Longitude' },
      ],
      responses: {
        200: {
          description: 'Address found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  lat: { type: 'number' },
                  lng: { type: 'number' },
                  displayName: { type: 'string' },
                  address: { type: 'object' },
                },
              },
            },
          },
        },
        400: { description: 'Missing or invalid coordinates' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal error' },
      },
    },
  },
};

export default geocode;
