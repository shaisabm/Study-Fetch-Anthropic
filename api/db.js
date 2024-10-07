import { MongoClient, ServerApiVersion} from 'mongodb';

const mongoUri =process.env.VITE_MONGODB_URI;
console.log(process.env.VITE_MONGODB_URI)

export async function connectToDatabase() {
  if (client && client.isConnected()) return client;
  client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client;
}