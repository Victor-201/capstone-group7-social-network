const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function alterPostsTable() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'social_network',
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // First check if groups table exists, create it if it doesn't
    const [groupsTable] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'groups'
    `, [process.env.DB_NAME || 'social_network']);

    if (groupsTable.length === 0) {
      console.log('Creating groups table...');
      
      await connection.query(`
        CREATE TABLE groups (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          privacy ENUM('public', 'private') NOT NULL DEFAULT 'public',
          image VARCHAR(255),
          cover_image VARCHAR(255),
          creator_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      await connection.query(`
        CREATE TABLE group_members (
          group_id INT NOT NULL,
          user_id INT NOT NULL,
          role ENUM('member', 'admin') NOT NULL DEFAULT 'member',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (group_id, user_id),
          FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      
      console.log('Successfully created groups tables');
    } else {
      console.log('groups table already exists');
    }

    // Then check if group_id column exists in posts table
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'posts' 
      AND COLUMN_NAME = 'group_id'
    `, [process.env.DB_NAME || 'social_network']);

    if (columns.length === 0) {
      console.log('Adding group_id column to posts table...');
      
      // Add the group_id column
      await connection.query(`
        ALTER TABLE posts
        ADD COLUMN group_id INT NULL
      `);
      
      // Add the foreign key separately
      await connection.query(`
        ALTER TABLE posts
        ADD CONSTRAINT fk_posts_group
        FOREIGN KEY (group_id) REFERENCES \`groups\`(id)
        ON DELETE SET NULL
      `);
      
      console.log('Successfully added group_id column to posts table');
    } else {
      console.log('group_id column already exists in posts table');
    }

    console.log('Database update completed successfully');
    connection.end();
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

alterPostsTable();