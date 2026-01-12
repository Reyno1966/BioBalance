import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import medicalRoutes from './routes/medical.js';
import weightRoutes from './routes/weight.js';
import nutritionRoutes from './routes/nutrition.js';
import emotionalRoutes from './routes/emotional.js';
import { initDB } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/medical', medicalRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/emotional', emotionalRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'BioBalance API' });
});

app.listen(PORT, async () => {
    await initDB();
    console.log(`🚀 BioBalance Server running on port ${PORT}`);
});
