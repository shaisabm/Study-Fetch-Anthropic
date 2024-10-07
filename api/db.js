import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
let client;

export async function connectToDatabase() {
  if (client && client.isConnected()) return client;
  client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client;
}