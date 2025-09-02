import mysql from 'mysql2/promise';
import dbConfig from '../_config';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data manually
    const busboy = require('busboy');
    const bb = busboy({ headers: req.headers });
    let fields = {};
    let imageUrl = null;
    let fileBuffer = null;
    let fileName = null;
    let fileMime = null;

    await new Promise((resolve, reject) => {
      bb.on('file', (name, file, info) => {
        fileName = info.filename;
        fileMime = info.mimeType;
        const chunks = [];
        file.on('data', (data) => chunks.push(data));
        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });
      bb.on('field', (name, val) => {
        fields[name] = val;
      });
      bb.on('finish', resolve);
      bb.on('error', reject);
      req.pipe(bb);
    });

    const { name, address, city, state, contact, email_id } = fields;

    // Validation
    if (!name || !address || !city || !state || !contact || !email_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_id)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!/^\d{10}$/.test(contact)) {
      return res.status(400).json({ error: 'Contact must be a 10-digit number' });
    }

    // Upload image to Vercel Blob Storage if present
    if (fileBuffer && fileName) {
      // Check file size (max 4.5 MB)
      if (fileBuffer.length > 4.5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Image must be less than 4.5 MB' });
      }
      const blob = await put(`schoolImages/${Date.now()}-${fileName}`, fileBuffer, {
        access: 'public',
        contentType: fileMime,
      });
      imageUrl = blob.url;
    }

    // Database connection
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      INSERT INTO schools (name, address, city, state, contact, image, email_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      name, address, city, state, contact, imageUrl, email_id
    ]);
    await connection.end();

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      schoolId: result.insertId,
      imageUrl,
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
