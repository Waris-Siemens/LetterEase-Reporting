import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const DATA_KEY = 'letterease_dashboard_data';

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
    if (req.method === 'GET') {
      // Fetch data from KV
      const data = await kv.get(DATA_KEY);
      
      return res.status(200).json({ data: data || null });
    }

    if (req.method === 'POST') {
      const { data, password } = req.body;

      // Verify admin password
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LetterEase2024';
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Store data in Vercel KV
      await kv.set(DATA_KEY, data);

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { password } = req.body;

      // Verify admin password
      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LetterEase2024';
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete data from Vercel KV
      await kv.del(DATA_KEY);

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
