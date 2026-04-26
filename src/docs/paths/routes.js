const coordinateSchema = {
  type: 'object',
  required: ['lat', 'lng'],
  properties: {
    lat: { type: 'number' },
    lng: { type: 'number' },
  },
};

const routes = {
  '/api/routes': {
    get: {
      tags: ['Routes'],
      summary: 'Get saved routes for the current user',
      responses: {
        200: {
          description: 'List of saved routes',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    origin: coordinateSchema,
                    destination: coordinateSchema,
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal error' },
      },
    },
    post: {
      tags: ['Routes'],
      summary: 'Build a driving route between two points and save it',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['origin', 'destination'],
              properties: {
                name: { type: 'string' },
                origin: coordinateSchema,
                destination: coordinateSchema,
                alternatives: { type: 'boolean' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Route built and saved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  origin: coordinateSchema,
                  destination: coordinateSchema,
                  routes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        distance: { type: 'number' },
                        duration: { type: 'number' },
                        geometry: {
                          type: 'object',
                          description: 'GeoJSON LineString geometry',
                          properties: {
                            type: { type: 'string', example: 'LineString' },
                            coordinates: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
                          },
                        },
                        steps: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              instruction: { type: 'string' },
                              name: { type: 'string' },
                              distance: { type: 'number' },
                              duration: { type: 'number' },
                              maneuver: {
                                type: 'object',
                                properties: {
                                  type: { type: 'string' },
                                  modifier: { type: 'string', nullable: true },
                                  location: { type: 'array', items: { type: 'number' } },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: 'Invalid or missing parameters' },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal error' },
      },
    },
  },
  '/api/routes/{id}': {
    get: {
      tags: ['Routes'],
      summary: 'Get route by id',
      responses: {
        200: {
          description: 'List of saved routes',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  origin: coordinateSchema,
                  destination: coordinateSchema,
                  routes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        distance: { type: 'number' },
                        duration: { type: 'number' },
                        geometry: {
                          type: 'object',
                          description: 'GeoJSON LineString geometry',
                          properties: {
                            type: { type: 'string', example: 'LineString' },
                            coordinates: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
                          },
                        },
                        steps: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              instruction: { type: 'string' },
                              name: { type: 'string' },
                              distance: { type: 'number' },
                              duration: { type: 'number' },
                              maneuver: {
                                type: 'object',
                                properties: {
                                  type: { type: 'string' },
                                  modifier: { type: 'string', nullable: true },
                                  location: { type: 'array', items: { type: 'number' } },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal error' },
      },
    },
    delete: {
      tags: ['Routes'],
      summary: 'Delete route by id',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Route deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  userId: { type: 'string' },
                  name: { type: 'string' },
                  origin: coordinateSchema,
                  destination: coordinateSchema,
                  routes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        distance: { type: 'number' },
                        duration: { type: 'number' },
                        geometry: {
                          type: 'object',
                          description: 'GeoJSON LineString geometry',
                          properties: {
                            type: { type: 'string', example: 'LineString' },
                            coordinates: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
                          },
                        },
                        steps: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              instruction: { type: 'string' },
                              name: { type: 'string' },
                              distance: { type: 'number' },
                              duration: { type: 'number' },
                              maneuver: {
                                type: 'object',
                                properties: {
                                  type: { type: 'string' },
                                  modifier: { type: 'string', nullable: true },
                                  location: { type: 'array', items: { type: 'number' } },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/routes/{id}/pois': {
    get: {
      tags: ['Routes'],
      summary: 'Get POIs along a saved route (cached after first fetch)',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Saved route ID' },
        { name: 'routeIndex', in: 'query', required: false, schema: { type: 'integer', default: 0 }, description: 'Index of the route variant (0 for main, 1+ for alternatives)' },
      ],
      responses: {
        200: {
          description: 'POIs grouped by route step',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  routeId: { type: 'string' },
                  routeIndex: { type: 'integer' },
                  pois: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        landmarkIndex: { type: 'integer', description: 'Step index in the route' },
                        instruction: { type: 'string', example: 'turn left' },
                        streetName: { type: 'string', nullable: true },
                        location: { type: 'array', items: { type: 'number' }, description: '[lng, lat]' },
                        nearbyPois: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer', description: 'OSM node ID' },
                              amenity: { type: 'string', example: 'pharmacy' },
                              name: { type: 'string', nullable: true },
                              lat: { type: 'number' },
                              lng: { type: 'number' },
                              distanceFromLandmark: { type: 'integer', description: 'Distance in meters' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: 'Invalid route index' },
        401: { description: 'Unauthorized' },
        404: { description: 'Route not found' },
        500: { description: 'Internal error' },
      },
    },
  },
};

export default routes;
