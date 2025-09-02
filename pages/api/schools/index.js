import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_db',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Database connection
    const connection = await mysql.createConnection(dbConfig);

    // Query to fetch schools (only required fields for display)
    const query = `
      SELECT id, name, address, city, image 
      FROM schools 
      ORDER BY id DESC
    `;
    
    const [schools] = await connection.execute(query);

    await connection.end();

    res.status(200).json({
      success: true,
      schools: schools
    });

  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
