import { MongoClient, ServerApiVersion} from 'mongodb';
import dotenv from 'dotenv';
dotenv.config()

const mongoUri =process.env.VITE_MONGODB_URI;
const client = new MongoClient(mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  await client.connect();
  console.log(client.connect())
  return client;
}