import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Get nutritional summary
router.get('/summary/:userId', async (req, res) => {
    try {
        const text = `
      SELECT 
        COALESCE(SUM(calories), 0) as total_calories,
        COALESCE(AVG(protein), 0) as avg_protein,
        COALESCE(AVG(carbs), 0) as avg_carbs,
        COALESCE(AVG(fat), 0) as avg_fat
      FROM nutrition_logs
      WHERE user_id = $1 AND recorded_at >= CURRENT_DATE
    `;
        const result = await query(text, [req.params.userId]);

        // Also get user goal
        const userResult = await query('SELECT target_weight FROM users WHERE id = $1', [req.params.userId]);
        const calorieGoal = 2200; // Default for demo, should be calculated

        res.json({
            ...result.rows[0],
            calorieGoal
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get meal plan based on risk profile
router.get('/meal-plan/:userId', async (req, res) => {
    try {
        // 1. Get user risk profile
        const userResult = await query('SELECT risk_profile FROM medical_history WHERE user_id = $1', [req.params.userId]);
        const riskProfile = userResult.rows[0]?.risk_profile || 'low';

        // 2. Mock recommendations based on risk
        const plans = {
            high: [
                { type: 'breakfast', description: 'Omelette de clara de huevos con espinaca (Bajo en Sodio)', kcal: 250 },
                { type: 'lunch', description: 'Pollo al Vapor con brócoli y arroz integral', kcal: 450 },
                { type: 'dinner', description: 'Ensalada de Atún al natural con palta', kcal: 350 },
            ],
            low: [
                { type: 'breakfast', description: 'Pan integral con palta y huevo pochado', kcal: 350 },
                { type: 'lunch', description: 'Pasta integral con pesto de albahaca y pollo', kcal: 600 },
                { type: 'dinner', description: 'Tacos de pescado con tortilla de maíz', kcal: 500 },
            ]
        };

        res.json(plans[riskProfile]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
