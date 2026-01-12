import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get nutritional summary
router.get('/summary/:userId', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: logs, error: logsError } = await supabase
            .from('nutrition_logs')
            .select('calories, protein, carbs, fat')
            .eq('user_id', req.params.userId)
            .gte('recorded_at', today.toISOString());

        if (logsError) throw logsError;

        const summary = logs.reduce((acc, log) => ({
            total_calories: acc.total_calories + log.calories,
            protein_sum: acc.protein_sum + (log.protein || 0),
            carbs_sum: acc.carbs_sum + (log.carbs || 0),
            fat_sum: acc.fat_sum + (log.fat || 0),
            count: acc.count + 1
        }), { total_calories: 0, protein_sum: 0, carbs_sum: 0, fat_sum: 0, count: 0 });

        const avg_protein = summary.count > 0 ? summary.protein_sum / summary.count : 0;
        const avg_carbs = summary.count > 0 ? summary.carbs_sum / summary.count : 0;
        const avg_fat = summary.count > 0 ? summary.fat_sum / summary.count : 0;

        // Also get user goal
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('target_weight')
            .eq('id', req.params.userId)
            .single();

        const calorieGoal = 2200; // Default for demo

        res.json({
            total_calories: summary.total_calories,
            avg_protein,
            avg_carbs,
            avg_fat,
            calorieGoal
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get meal plan based on risk profile
router.get('/meal-plan/:userId', async (req, res) => {
    try {
        const { data: medical, error } = await supabase
            .from('medical_history')
            .select('risk_profile')
            .eq('user_id', req.params.userId)
            .single();

        const riskProfile = medical?.risk_profile || 'low';

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
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
