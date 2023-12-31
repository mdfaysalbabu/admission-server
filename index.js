const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bx18cif.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    // collection
    const usersCollection = client.db("collegeDB").collection("users");
    const collegeCollection = client.db("collegeDB").collection("college");

    //   user Post
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existUser = await usersCollection.findOne(query);
      if (existUser) {
        return res.send({ message: "User already Create" });
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // user Get
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // Colleges
    app.get("/colleges",async(req,res)=>{
        const query={};
        const result=await collegeCollection.find(query).toArray();
        res.send(result)
    })

    app.get("/college/:id",async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await collegeCollection.findOne(query)
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("college admission running");
});
app.listen(port, () => {
  console.log(`college admission running${port}`);
});
