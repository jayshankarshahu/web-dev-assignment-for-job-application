import mysql from 'mysql2/promise';
import dbConfig from '../_config';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  const { id } = req.query;

  // Validate ID parameter
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'School ID is required'
    });
  }

  const schoolId = parseInt(id, 10);
  if (isNaN(schoolId) || schoolId <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid school ID'
    });
  }

  try {
    // Database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Query to fetch specific school by ID
      const query = `
        SELECT id, name, address, city, state, contact, image, email_id 
        FROM schools 
        WHERE id = ?
      `;

      const [schools] = await connection.execute(query, [schoolId]);

      if (schools.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      const school = schools[0];

      res.status(200).json({
        success: true,
        message: 'School details fetched successfully',
        data: {
          school: school
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Error fetching school:', error);

    if (error.code === 'ECONNREFUSED') {
      res.status(500).json({
        success: false,
        message: 'Database connection failed'
      });
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      res.status(500).json({
        success: false,
        message: 'Schools table not found'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}