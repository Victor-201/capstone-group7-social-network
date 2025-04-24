const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function updateSocialFeatures() {
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

    // Check if friendships table exists, create it if it doesn't
    const [friendshipsTable] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'friendships'
    `, [process.env.DB_NAME || 'social_network']);

    if (friendshipsTable.length === 0) {
      console.log('Creating friendships table...');
      
      await connection.query(`
        CREATE TABLE friendships (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id_1 INT NOT NULL,
          user_id_2 INT NOT NULL,
          status ENUM('pending', 'accepted', 'declined', 'blocked') NOT NULL DEFAULT 'pending',
          action_user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (action_user_id) REFERENCES users(id) ON DELETE CASCADE,
          CHECK (user_id_1 < user_id_2), -- Ensures uniqueness and prevents duplicates
          UNIQUE (user_id_1, user_id_2),
          INDEX idx_user_id_1 (user_id_1),
          INDEX idx_user_id_2 (user_id_2),
          INDEX idx_status (status)
        )
      `);
      
      console.log('Successfully created friendships table');
    } else {
      console.log('Friendships table already exists');
    }

    // Check if followers table exists, create it if it doesn't
    const [followersTable] = await connection.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'followers'
    `, [process.env.DB_NAME || 'social_network']);

    if (followersTable.length === 0) {
      console.log('Creating followers table...');
      
      await connection.query(`
        CREATE TABLE followers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          follower_id INT NOT NULL,
          followed_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE (follower_id, followed_id),
          INDEX idx_follower_id (follower_id),
          INDEX idx_followed_id (followed_id)
        )
      `);
      
      console.log('Successfully created followers table');
    } else {
      console.log('Followers table already exists');
    }

    console.log('Database update completed successfully');
    connection.end();
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

updateSocialFeatures();