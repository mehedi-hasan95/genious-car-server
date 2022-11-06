require('dotenv').config();
const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
cors = require('cors');

// MidleWare 
app.use(cors())
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Database



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.PASSWORD}@cluster0.k4gmzpi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const userCollection = client.db("geniousCar").collection("services");
        const userOrders = client.db("geniousCar").collection("Orders");

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // Find a spesic Id
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // Inseart a order to database
        app.post('/orders', async(req, res) => {
            const orders = req.body;
            const result = await userOrders.insertOne(orders);
            res.send(result);
        })

        // Display a spesic users order in the client side
        app.get('/orders', async(req, res) => {
            let query = {};
            if(req.query.email) {
                query = {
                    email: req.query.email,
                }
            }
            const cursor = userOrders.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // Delete a order
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userOrders.deleteOne(query);
            res.send(result);
        })


        // Start Jwt form here
        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.CRIPTO_SECRET_KEY, {expiresIn: '1h'});
            res.send({token});
        })



    }
    finally {

    }
}
run().catch(err => console.error(err));


app.listen(port, () => {
    console.log(`Genious car server is running: ${port}`)
})