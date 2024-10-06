import { MongoClient } from 'mongodb';
import Anthropic from '@anthropic-ai/sdk';

// Initialize MongoDB connection
let cachedClient = null;
async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  cachedClient = client;
  return client;
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/explain') {
    const { topic, name } = req.body;

    try {
      console.log('Starting Anthropic API request');
      const completion = await anthropic.completions.create({
        model: 'claude-2',
        prompt: `\n\nHuman: Explain ${topic} like I'm 5 years old.\n\nAssistant:`,
        max_tokens_to_sample: 300,
      });
      console.log('Anthropic API request completed');

      const explanation = completion.completion;

      console.log('Connecting to MongoDB');
      const client = await connectToDatabase();
      console.log('MongoDB connected');
      const db = client.db('ai-explainer');
      const collection = db.collection('explanations');

      await collection.insertOne({ topic, name, explanation });
      console.log('Data inserted into MongoDB');

      res.status(200).json({ explanation });
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({ error: 'An error occurred', details: error.message });
    }
  } else if (req.method === 'GET' && req.url === '/api/explanations') {
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
    res.status(405).json({ error: 'Method not allowed' });
  }
}
