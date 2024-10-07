import { connectToDatabase } from './db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Connecting to MongoDB');
      const client = await connectToDatabase();
      console.log('MongoDB connected');
      const db = client.db('ai-explainer');
      const collection = db.collection('explanations');

      const explanations = await collection.find().toArray();
      console.log('Data retrieved from MongoDB');
      res.status(200).json(explanations);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ error: 'An error occurred', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}