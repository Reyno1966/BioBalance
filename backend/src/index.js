import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import medicalRoutes from './routes/medical.js';
import weightRoutes from './routes/weight.js';
import nutritionRoutes from './routes/nutrition.js';
import emotionalRoutes from './routes/emotional.js';
import userRoutes from './routes/user.js';
import exerciseRoutes from './routes/exercise.js';
import aiRoutes from './routes/ai.js';
import healthRoutes from './routes/health.js';
import challengeRoutes from './routes/challenge.js';
import paymentRoutes from './routes/payment.js';




dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Health check (at the top to facilitate diagnostics)
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'BioBalance API Terminal Active',
        version: '4.0.0'
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'BioBalance API',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// Middleware (CORS primero para evitar bloqueos)
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/medical', medicalRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/emotional', emotionalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/payment', paymentRoutes);






// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        // await initDB(); // Uncomment if you want auto-init locally
        console.log(`🚀 BioBalance Server running locally on port ${PORT}`);
    });
}

export default app;
