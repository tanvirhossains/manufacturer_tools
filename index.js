const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { accepts } = require('express/lib/request');

require('dotenv').config()

app.use(cors())
app.use(express.json())







const uri = `mongodb+srv://${process.env.TOOLS_USER}:${process.env.TOOLS_PASSWORD}@cluster0.wdai4.mongodb.net/?retryWrites=true&w=majority`;
console.log('its ok')
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)
async function run() {
  try {
    await client.connect();



    const toolsCollection = client.db("construction_tools").collection("tools");
    const orderCollection = client.db("construction_tools").collection("orders");
    const reviewCollection = client.db("construction_tools").collection("reviews");
    const userCollection = client.db("construction_tools").collection("user");

    console.log('all are gonna be ok')
    //-----------tools ------------
    app.get('/tools', async (req, res) => {
      const query = {};
      const tools = await toolsCollection.find(query).toArray();
      res.send(tools)
    })

    app.get('/tools/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const tool = await toolsCollection.findOne(query)
      res.send(tool)
    })
    app.post('/tools', async (req, res) => {
      const tools = req.body;
      const result = await toolsCollection.insertOne(tools)
      res.send({ success: true })
    })

    //----------reviews --------------
    app.get('/reviews', async (req, res) => {
      const query = {}
      const reviews = await reviewCollection.find(query).toArray()
      res.send(reviews)
    })

    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.send({ success: true })
    })


    //-------orders----------  
    app.get('/orders', async (req, res) => {
      const query = {}
      const allOrders = await orderCollection.find(query).toArray()
      res.send(allOrders)
    })
    app.get('/order', async (req, res) => {
      const userEmail = req.query.userEmail
      const query = { userEmail: userEmail }
      const result = await orderCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/order', async (req, res) => {
      const order = req.body;
      const query = { userEmail: order.userEmail, toolName: order.toolName }
      const remain = await orderCollection.findOne(query)
      if (remain) {
        return res.send({ success: false })
      }
      const result = await orderCollection.insertOne(order)
      res.send({ success: true })
    })


    // ------------user and create a admin ----------------
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })
    app.put('/user/admin/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email }
      const updateDoc = {
        $set: { role: 'admin' }
      };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.get('/user', async (req, res) => {
      const query = {}
      const result = await userCollection.find(query).toArray()
      res.send(result)
    })

    //-------------admin
    app.get('/admin/:email', async (req, res) => {
      const existUserEmail = req.params.email
      const existUser = await userCollection.findOne({ email: existUserEmail })
      const isAdmin = existUser.role === 'admin'
      res.send({ admin: isAdmin })
    })



  }



  finally {
    // await client.close();
  }
}
run()



app.get('/', (req, res) => {
  res.send('adding to the client')
})

app.listen(port, () => {
  console.log('its ok', port)
})