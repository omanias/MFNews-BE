import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MFNews API Documentation',
            version: '1.0.0',
            description: 'API documentation for MFNews Backend',
            contact: {
                name: 'MFNews Team'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64'
                        },
                        email: {
                            type: 'string',
                            format: 'email'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                News: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            format: 'int64'
                        },
                        title: {
                            type: 'string'
                        },
                        subtitle: {
                            type: 'string'
                        },
                        body: {
                            type: 'string'
                        },
                        image_url: {
                            type: 'string'
                        },
                        author: {
                            type: 'string'
                        },
                        date: {
                            type: 'string',
                            format: 'date-time'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updated_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default specs; 