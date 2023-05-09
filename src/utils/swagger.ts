import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import { version } from "../../package.json";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'FileServer API Docs',
            version,
        }
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerDocs = (app: Express, port: Number | String) => {
    // Swagger page
    app.use('/api_docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec))

    // Docs in JSON format
    app.get('api_docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}

export default swaggerDocs