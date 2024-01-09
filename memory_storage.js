import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = "mongodb+srv://Marko:mg14012003@cluster0.ppm8yic.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
  }
}

module.exports = { connectToDatabase };

async function getDocumentById(id) {
  const database = client.db('PostsProba');
  const collection = database.collection('PostsProba');

  try {
    const document = await collection.findOne({ id: id });
    return document;
  } catch (err) {
    console.error('Error retrieving document from MongoDB:', err);
    return null;
  }
}

module.exports = { connectToDatabase, getDocumentById };

// PLAN B
let storage = {
    posts: [
        {
            id: 10001,
            createdBy: "marcogalavic.me",
            postedAt: "54667875",
            type: "image",
            source: "https://picsum.photos/id/669/500/500",
            title: "title1"
        },
        {
            id: 10002,
            createdBy: "ivaivankovic.me",
            postedAt: "54667875",
            type: "image",
            source: "https://picsum.photos/id/669/500/500",
            title: "title2"
        },
        {
            id: 10001,
            createdBy: "lukalukic.me",
            postedAt: "54667875",
            type: "video",
            source: "https://www.youtube.com/watch?v=pN2EkMjlFOU",
            title: "title3"
        }
    ]
}
export default storage
