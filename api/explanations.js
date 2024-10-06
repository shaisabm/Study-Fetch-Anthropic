import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const db = client.db('ai-explainer');
      const collection = db.collection('explanations');

      const explanations = await collection.find().toArray();
      res.status(200).json(explanations);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}