import express from 'express';
import dotenv from 'dotenv';
import explainHandler from './explain.js';
import explanationsHandler from './explanations.js';

dotenv.config();
const app = express();
app.use(express.json());
console.log(process.env.VITE_MONGODB_URI)


app.post('/api/explain', async (req, res) => {
  try {
    await explainHandler(req, res);
  } catch (error) {
    console.error('Explain handler error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

app.get('/api/explanations', async (req, res) => {
  try {
    await explanationsHandler(req, res);
  } catch (error) {
    console.error('Explanations handler error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;