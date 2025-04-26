/**
 * Setup Database Universal Script
 * Dùng để thiết lập cơ sở dữ liệu cho dự án Social Network trên bất kỳ máy nào
 * Hỗ trợ tạo file .env nếu chưa có và hướng dẫn cài đặt các gói cần thiết
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Kiểm tra và cài đặt các gói cần thiết
const requiredPackages = ['mysql2', 'dotenv', 'sequelize'];
let missingPackages = [];

try {
  const packageJson = require('./package.json');
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  missingPackages = requiredPackages.filter(pkg => !dependencies[pkg]);
  
  if (missingPackages.length > 0) {
    console.log(`\n✅ Đang cài đặt các gói cần thiết: ${missingPackages.join(', ')}...`);
    execSync(`npm install ${missingPackages.join(' ')} --save`, { stdio: 'inherit' });
    console.log('✅ Đã cài đặt các gói cần thiết\n');
  }
} catch (error) {
  console.warn('⚠️ Không thể đọc package.json hoặc cài đặt các gói cần thiết.');
  console.warn('⚠️ Vui lòng cài đặt thủ công: npm install mysql2 dotenv sequelize');
}

// Sau khi cài đặt các gói cần thiết, import chúng
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Đường dẫn đến file SQL (điều chỉnh nếu cần)
const SQL_FILE_PATH = path.join(__dirname, '../database/db.sql');
const ENV_FILE_PATH = path.join(__dirname, '.env');

// Tạo interface đọc input từ console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hàm prompt người dùng nhập thông tin
const prompt = (question) => {
  return new Promise(resolve => {
    rl.question(question, answer => {
      resolve(answer);
    });
  });
};

// Kiểm tra và tạo file .env nếu cần
async function checkAndCreateEnvFile() {
  console.log('🔍 Kiểm tra file .env...');
  
  if (!fs.existsSync(ENV_FILE_PATH)) {
    console.log('📝 File .env không tồn tại. Đang tạo file .env mới...');
    
    const dbHost = await prompt('Nhập host của MySQL (mặc định: localhost): ') || 'localhost';
    const dbPort = await prompt('Nhập port của MySQL (mặc định: 3306): ') || '3306';
    const dbUser = await prompt('Nhập tên người dùng MySQL (mặc định: root): ') || 'root';
    const dbPassword = await prompt('Nhập mật khẩu MySQL (để trống nếu không có): ') || '';
    const dbName = await prompt('Nhập tên database (mặc định: social_network): ') || 'social_network';
    
    const envContent = `# Database Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=8080
NODE_ENV=development
`;
    
    fs.writeFileSync(ENV_FILE_PATH, envContent);
    console.log('✅ Đã tạo file .env thành công');
  } else {
    console.log('✅ File .env đã tồn tại');
  }
  
  // Load environment variables
  dotenv.config({ path: ENV_FILE_PATH });
}

// Hàm thực thi các câu lệnh SQL
async function executeSql() {
  try {
    console.log('🚀 Bắt đầu thiết lập cơ sở dữ liệu...');
    
    // Kiểm tra file .env và tạo nếu cần
    await checkAndCreateEnvFile();
    
    // Tạo kết nối với MySQL (không chỉ định database)
    console.log('🔄 Đang kết nối đến MySQL...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('🟢 Đã kết nối đến MySQL thành công');

    // Xóa database hiện tại nếu tồn tại
    const dbName = process.env.DB_NAME || 'social_network';
    
    const shouldRecreate = await prompt(`❓ Bạn có muốn xóa database ${dbName} nếu đã tồn tại không? (y/n, mặc định: y): `);
    
    if (shouldRecreate.toLowerCase() !== 'n') {
      await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
      console.log(`✅ Database ${dbName} đã được xóa (nếu tồn tại)`);

      // Tạo database mới
      await connection.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database ${dbName} đã được tạo mới`);
    }

    // Sử dụng database vừa tạo
    await connection.query(`USE ${dbName}`);
    console.log(`🔄 Đang sử dụng database ${dbName}`);

    // Đọc file SQL
    console.log('🔄 Đang đọc file SQL...');
    let sqlFile;
    try {
      sqlFile = fs.readFileSync(SQL_FILE_PATH, 'utf8');
      console.log('✅ Đã đọc file SQL thành công');
    } catch (err) {
      // Thử đọc từ đường dẫn khác hoặc tìm file SQL
      console.log('⚠️ Không tìm thấy file SQL tại đường dẫn mặc định, đang tìm kiếm file SQL...');
      
      const alternativePath = path.join(__dirname, '../database/db.sql');
      try {
        sqlFile = fs.readFileSync(alternativePath, 'utf8');
        console.log(`✅ Đã tìm thấy và đọc file SQL từ ${alternativePath}`);
      } catch (e) {
        throw new Error('❌ Không tìm thấy file SQL. Vui lòng kiểm tra lại vị trí file db.sql');
      }
    }
    
    // Thực thi từng câu lệnh SQL
    const sqlStatements = sqlFile.split(';').filter(statement => statement.trim() !== '');
    
    console.log(`🔄 Đang thực thi ${sqlStatements.length} câu lệnh SQL...`);
    
    let executedCount = 0;
    let errorCount = 0;
    
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
          executedCount++;
        } catch (err) {
          errorCount++;
          console.error(`❌ Lỗi khi thực thi câu lệnh: ${err.message}`);
          console.error(`SQL: ${statement.substring(0, 100)}...`);
        }
      }
    }

    console.log(`✅ Đã hoàn thành việc thực thi SQL: ${executedCount} thành công, ${errorCount} lỗi`);
    
    // Đóng kết nối
    await connection.end();
    console.log('✅ Đã đóng kết nối MySQL');
    
    // Khởi tạo và đồng bộ hóa models Sequelize
    console.log('🔄 Đang đồng bộ hóa models Sequelize với database...');
    
    const { sequelize, syncDatabase } = require('./config/database');
    
    // Force sync để tái tạo tất cả các bảng
    await syncDatabase(true);
    
    console.log('🎉 Thiết lập cơ sở dữ liệu hoàn tất thành công!');
    console.log('\n📝 Thông tin kết nối:');
    console.log(`- Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`- Port: ${process.env.DB_PORT || '3306'}`);
    console.log(`- User: ${process.env.DB_USER || 'root'}`);
    console.log(`- Database: ${process.env.DB_NAME || 'social_network'}`);
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi thiết lập cơ sở dữ liệu:', error.message);
    
    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('\n⚠️ Không thể kết nối đến MySQL. Vui lòng kiểm tra:');
      console.error('1. MySQL đã được cài đặt và đang chạy trên máy của bạn');
      console.error('2. Thông tin kết nối (host, port, username, password) là chính xác');
      console.error('3. Tường lửa không chặn kết nối đến MySQL');
    }
    
    rl.close();
    process.exit(1);
  }
}

// Thực thi chương trình
console.log('===== THIẾT LẬP CƠ SỞ DỮ LIỆU SOCIAL NETWORK =====');
executeSql();