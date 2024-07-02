import { config } from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Ensure the collection exists
const phishingSitesCollection = db.collection('phishingSites');

phishingSitesCollection.exists().then(exists => {
  if (!exists) {
    return phishingSitesCollection.create();
  }
});

// Create Phishing Site Entry
app.post('/phishing-sites', async (req, res) => {
  try {
    const phishingSite = req.body;
    const result = await phishingSitesCollection.save(phishingSite);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read All Phishing Sites
app.get('/phishing-sites', async (req, res) => {
  try {
    const cursor = await db.query('FOR site IN phishingSites RETURN site');
    const sites = await cursor.all();
    res.status(200).json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read Phishing Site by ID
app.get('/phishing-sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const site = await phishingSitesCollection.document(id);
    res.status(200).json(site);
  } catch (err) {
    res.status(404).json({ error: 'Phishing site not found' });
  }
});

// Update Phishing Site
app.put('/phishing-sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const phishingSite = req.body;
    const result = await phishingSitesCollection.update(id, phishingSite);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Phishing Site
app.delete('/phishing-sites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await phishingSitesCollection.remove(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Link Similar Phishing Sites
app.get('/phishing-sites/similar/:url', async (req, res) => {
  try {
    const { url } = req.params;
    // Simple example: find sites with similar URLs
    const cursor = await db.query(`
      FOR site IN phishingSites
      FILTER LIKE(site.url, @urlPattern, true)
      RETURN site
    `, { urlPattern: `%${url}%` });
    const sites = await cursor.all();
    res.status(200).json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
