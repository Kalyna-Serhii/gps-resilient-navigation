const alerts = {
  '/api/alerts': {
    get: {
      tags: ['Alerts'],
      summary: 'Get all currently active air alert oblasts',
      responses: {
        200: {
          description: 'List of active alerts',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  activeOblasts: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['Київська область', 'Харківська область'],
                  },
                  activeCount: { type: 'integer', example: 2 },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
        500: { description: 'Internal error' },
      },
    },
  },
  '/api/alerts/by-location': {
    get: {
      tags: ['Alerts'],
      summary: 'Check alert status for the user\'s current location',
      parameters: [
        { name: 'lat', in: 'query', required: true, schema: { type: 'number' }, description: 'Latitude' },
        { name: 'lng', in: 'query', required: true, schema: { type: 'number' }, description: 'Longitude' },
      ],
      responses: {
        200: {
          description: 'Alert status for the detected oblast',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  detectedOblast: { type: 'string', example: 'Київська область' },
                  alertIsActive: { type: 'boolean', example: true },
                },
              },
            },
          },
        },
        400: { description: 'Missing or invalid coordinates' },
        401: { description: 'Unauthorized' },
        404: { description: 'Coordinates are outside Ukrainian territory' },
        500: { description: 'Internal error' },
      },
    },
  },
};

export default alerts;
