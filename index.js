const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lqoy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://droneBazarDb:yzUOnkMOJjfoB1oG@cluster0.lqoy5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("DroneBazar");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const newOrdersCollection = database.collection("newOrders");

    // GET API
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/myOrders", async (req, res) => {
      const cursor = newOrdersCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    app.post("/orders", async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
    app.post("/newOrders", async (req, res) => {
      const order = req.body;
      const result = await newOrdersCollection.insertOne(order);
      res.json(result);
    });
    app.post("/newProduct", async (req, res) => {
      const order = req.body;
      const result = await productsCollection.insertOne(order);
      res.json(result);
    });
    app.delete("/products/:id", async (req, res) => {
      const orderID = req.params.id;
      const query = { _id: ObjectId(orderID) };
      const result = await productsCollection.deleteOne(query);
      res.json(result);
    });
    app.delete("/orders/:id", async (req, res) => {
      const orderID = req.params.id;
      const query = { _id: ObjectId(orderID) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
    app.delete("/newOrders/:id", async (req, res) => {
      const orderID = req.params.id;
      const query = { _id: ObjectId(orderID) };
      const result = await newOrdersCollection.deleteOne(query);
      res.json(result);
    });
    app.delete("/deleteMyOrders", async (req, res) => {
      const result = await ordersCollection.deleteMany({});
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
