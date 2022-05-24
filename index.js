const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');



app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.TOOLS_USER}:${process.env.TOOLS_PASSWORD}@cluster0.wdai4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();



    const toolsCollection = client.db("construction_tools").collection("tools");

    app.get('/tools', async (req, res) => {

      const query = {};
      const result = await toolsCollection.find(query).toArray();
      res.send(result)
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