import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test MongoDB connection
    const db = await getDatabase();
    await db.command({ ping: 1 });

    return res.status(200).json({ 
      status: 'ok',
      database: 'mongodb',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({ 
      status: 'error',
      database: 'mongodb',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
