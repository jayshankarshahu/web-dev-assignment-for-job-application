
// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_db',
  port: parseInt(process.env.DB_PORT),
  ssl: {
    ca: process.env.DB_SSL_CA,
    rejectUnauthorized: true
  }
};

export default dbConfig;
