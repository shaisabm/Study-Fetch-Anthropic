import { connectToDatabase } from './db.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}