import { MongoClient } from 'mongodb';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { topic, name } = req.body;

    try {
      const completion = await anthropic.completions.create({
        model: 'claude-2',
        prompt: `\n\nHuman: Explain ${topic} like I'm 5 years old.\n\nAssistant:`,
        max_tokens_to_sample: 300,
      });

      const explanation = completion.completion;

      await client.connect();
      const db = client.db('ai-explainer');
      const collection = db.collection('explanations');

      await collection.insertOne({ topic, name, explanation });

      res.status(200).json({ explanation });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}