import express from 'express';
import router from './routes/app.routes.js';
import dotenv from 'dotenv';
import sequelize from './configs/database.config.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
})();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});