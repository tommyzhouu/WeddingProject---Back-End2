import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());

// RSVP Endpoint
app.post('/api/rsvp', async (req, res) => {
  const { name, starter, main, dessert, dietary_requirements } = req.body;

  if (!name || !starter || !main || !dessert) {
    return res.status(400).json({ error: 'All fields except dietary requirements are required' });
  }

  try {
    const query = `
      INSERT INTO rsvps (name, starter, main, dessert, dietary_requirements)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, starter, main, dessert, dietary_requirements || 'None'];
    const result = await pool.query(query, values);

    res.status(201).json({ message: 'RSVP submitted', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default app;
