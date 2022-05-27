const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.TOOLS_USER}:${process.env.TOOLS_PASSWORD}@cluster0.wdai4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();



    const toolsCollection = client.db("construction_tools").collection("tools");
    const orderCollection = client.db("construction_tools").collection("orders");
    const reviewCollection = client.db("construction_tools").collection("reviews");

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
      res.send({ success: true  })
    })

    app.get('/reviews', async (req, res) => {
      const query = {}
      const reviews = await reviewCollection.find(query).toArray()
      res.send(reviews)
    })

    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      res.send({ success: true  })
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






  }



  finally {
    // await client.close();
  }
}
run()



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log('its ok', port)
})