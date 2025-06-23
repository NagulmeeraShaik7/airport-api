import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger configuration options
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Airport API',
      version: '1.0.0',
      description: 'API for retrieving airport information by IATA code',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local server',
      },
      {
        url: 'https://airport-api-erqf.onrender.com',
        description: 'Production server',
      }
    ],
    components: {
      schemas: {
        AirportResponse: {
          type: 'object',
          properties: {
            airport: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                icao_code: { type: 'string' },
                iata_code: { type: 'string' },
                name: { type: 'string' },
                type: { type: 'string' },
                latitude_deg: { type: 'number' },
                longitude_deg: { type: 'number' },
                elevation_ft: { type: 'number', nullable: true },
                address: {
                  type: 'object',
                  properties: {
                    city: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        country_id: { type: 'number' },
                        is_active: { type: 'boolean' },
                        lat: { type: 'number' },
                        long: { type: 'number' },
                      },
                      nullable: true,
                    },
                    country: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        country_code_two: { type: 'string' },
                        country_code_three: { type: 'string' },
                        mobile_code: { type: 'number' },
                        continent_id: { type: 'number' },
                      },
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/apps/routers/*.ts'],
};

/**
 * Generates Swagger specification
 */
const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;