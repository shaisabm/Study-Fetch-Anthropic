import express from 'express';
import { MongoClient } from 'mongodb';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post('/api/explain', async (req, res) => {
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

    res.json({ explanation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await client.close();
  }
});

app.get('/api/explanations', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('ai-explainer');
    const collection = db.collection('explanations');

    const explanations = await collection.find().toArray();
    res.json(explanations);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await client.close();
  }
});

// Only start the server if we're running directly (not as a module)
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}