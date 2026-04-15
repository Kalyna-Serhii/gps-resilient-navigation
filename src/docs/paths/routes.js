const routes = {
  '/api/routes': {
    get: {
      tags: ['Routes'],
      summary: 'Build a driving route between two points',
      parameters: [
        { name: 'originLat', in: 'query', required: true, schema: { type: 'number' }, description: 'Origin latitude' },
        { name: 'originLng', in: 'query', required: true, schema: { type: 'number' }, description: 'Origin longitude' },
        { name: 'destLat', in: 'query', required: true, schema: { type: 'number' }, description: 'Destination latitude' },
        { name: 'destLng', in: 'query', required: true, schema: { type: 'number' }, description: 'Destination longitude' },
        { name: 'alternatives', in: 'query', required: false, schema: { type: 'boolean', default: false }, description: 'Return alternative routes' },
      ],
      responses: {
        200: {
          description: 'Route(s) built successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  routes: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        distance: { type: 'number', description: 'Total distance in meters' },
                        duration: { type: 'number', description: 'Total duration in seconds' },
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
};

export default routes;
