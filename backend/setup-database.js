const fs = require('fs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Đường dẫn đến file SQL (điều chỉnh nếu cần)
const SQL_FILE_PATH = './database/db.sql';

async function executeSql() {
  try {
    // Tạo kết nối với MySQL (không chỉ định database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server');

    // Xóa database hiện tại nếu tồn tại
    const dbName = process.env.DB_NAME || 'social_network';
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
    console.log(`Database ${dbName} dropped if existed`);

    // Tạo database mới
    await connection.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created`);

    // Sử dụng database vừa tạo
    await connection.query(`USE ${dbName}`);
    console.log(`Using database ${dbName}`);

    // Đọc file SQL
    let sqlFile;
    try {
      sqlFile = fs.readFileSync(SQL_FILE_PATH, 'utf8');
    } catch (err) {
      // Thử đọc từ đường dẫn khác nếu không tìm thấy
      sqlFile = fs.readFileSync('../database/db.sql', 'utf8');
    }
    
    // Thực thi từng câu lệnh SQL
    const sqlStatements = sqlFile.split(';').filter(statement => statement.trim() !== '');
    
    console.log('Executing SQL statements...');
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          console.error(`Error executing statement: ${err.message}`);
          console.error(`SQL: ${statement.substring(0, 100)}...`);
        }
      }
    }

    console.log('Database schema created');
    
    // Đóng kết nối
    await connection.end();
    
    // Khởi tạo và đồng bộ hóa models Sequelize
    console.log('Syncing Sequelize models with database...');
    const { sequelize, syncDatabase } = require('./config/database');
    
    // Force sync để tái tạo tất cả các bảng
    await syncDatabase(true);
    
    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

executeSql();