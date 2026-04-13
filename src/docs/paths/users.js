const users = {
  '/api/users/me': {
    get: {
      tags: ['Users'],
      summary: 'Retrieve current user information',
      responses: {
        200: {
          description: 'User information retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            },
          },
        },
        404: { description: 'User not found' },
        500: { description: 'Internal server error' },
      },
    },
  },
};

export default users;
