const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Read SQL file
const sqlFile = fs.readFileSync('../database/db.sql', 'utf8');
const sqlStatements = sqlFile.split(';').filter(statement => statement.trim() !== '');

async function executeSql() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'social_network'}`);
    console.log(`Database ${process.env.DB_NAME || 'social_network'} created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'social_network'}`);
    console.log(`Using database ${process.env.DB_NAME || 'social_network'}`);

    // Execute each SQL statement
    console.log('Executing SQL statements...');
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('SQL file executed successfully');
    connection.end();
  } catch (error) {
    console.error('Error executing SQL:', error);
    process.exit(1);
  }
}

executeSql();