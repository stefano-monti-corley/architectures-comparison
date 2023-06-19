import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import createAPI, { API, Request, Response } from 'lambda-api';
import { Logger } from '@aws-lambda-powertools/logger';
import { Client } from 'pg';

// Create connection

// Connect to database server

const logger: Logger = new Logger();
const api: API = createAPI()


api.use("/*", (req: Request, res: Response, next) => {
    res.cors({
        origin: '*',
        methods: 'GET, POST, OPTIONS',
        headers: 'content-type, authorization',
        maxAge: 84000000,
    });
    next();
});


api.get('/', async (req: Request, res: Response) => {
    try {

        const client = new Client({
            host: 'aurora-fastlane2-poc.cluster-ro-ctdbk1mvwinz.eu-central-1.rds.amazonaws.com',
            port: 5432,
            database: 'fastlane',
            user: 'aurora_user',
            password: 'aurora_password!',
        })
        
        console.log("inside method")
        await client.connect()
        console.log("connected")

        const res = await client.query("select vin, date, fuelconsumption from graph");

        console.log("queryDone")


        const ciao = await client.end();
        console.log(ciao)
        return res.rows

    } catch (err) {
        console.log(err);
        return err;
    }

});

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {

    console.log(event)
    return await api.run(event, context)
};
