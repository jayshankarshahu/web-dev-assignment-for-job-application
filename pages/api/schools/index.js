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
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Parse pagination parameters from query string
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    
    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0'
      });
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Database connection
    const connection = await mysql.createConnection(dbConfig);

    try {
      // Get total count of schools
      const [totalCountResult] = await connection.execute(
        'SELECT COUNT(*) AS total FROM schools'
      );
      const total = totalCountResult[0].total;

      // Query to fetch schools with pagination (includes all fields needed by frontend)
      const query = `
        SELECT id, name, address, city, state, contact, image, email_id 
        FROM schools 
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `;
      
      const [schools] = await connection.execute(query, [limit, offset]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      res.status(200).json({
        success: true,
        message: total > 0 ? 'Schools fetched successfully' : 'No schools found',
        data: {
          schools: schools,
          total: total,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            limit: limit,
            hasNextPage: hasNextPage,
            hasPreviousPage: hasPreviousPage
          }
        }
      });

    } finally {
      // Always close the database connection
      await connection.end();
    }

  } catch (error) {
    console.error('Error fetching schools:', error);
    
    // Return appropriate error message based on error type
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
