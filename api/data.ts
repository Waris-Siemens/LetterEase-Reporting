import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './lib/mongodb';

const COLLECTION_NAME = 'dashboard_data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDatabase();
    const collection = db.collection(COLLECTION_NAME);

    if (req.method === 'GET') {
      // Fetch data from MongoDB
      const document = await collection.findOne({ _id: 'letterease_data' });
      
      return res.status(200).json({ data: document?.data || null });
    }

    if (req.method === 'POST') {
      const { data, password } = req.body;

      // Verify admin password
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LetterEase2024';
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Store/Update data in MongoDB using upsert
      await collection.updateOne(
        { _id: 'letterease_data' },
        { 
          $set: { 
            data,
            updatedAt: new Date()
          } 
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { password } = req.body;

      // Verify admin password
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LetterEase2024';
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete data from MongoDB
      await collection.deleteOne({ _id: 'letterease_data' });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
