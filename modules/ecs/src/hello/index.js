const express = require('express');
const { Client } = require('pg');


const app = express();

const serviceName = process.env.SERVICE_NAME

app.get('/', async (req, res) => {
    return res.send({ error: false, v: 5 });
});
// 
app.get(`/${serviceName}`, async (req, res) => {
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

        const response = await client.query("select vin, date, fuelconsumption from graph");

        console.log("queryDone")

        console.log(response.rows[0])
        await client.end();

        return res.send(response.rows)

    } catch (err) {
        console.log(err);
        return err;
    }
});


app.get('/stat', async (req, res) => {
    return res.send({ error: false });
});


const server = app.listen(process.env.PORT || 4567);