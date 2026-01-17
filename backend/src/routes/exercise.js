import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get exercise plan based on risk profile
router.get('/plan/:userId', async (req, res) => {
    try {
        const { data: medical, error } = await supabase
            .from('medical_history')
            .select('risk_profile')
            .eq('user_id', req.params.userId)
            .single();

        const riskProfile = medical?.risk_profile || 'low';

        const plans = {
            high: [
                { id: 1, title: 'Caminata Ligera', duration: '20 min', intensity: 'Baja', icon: 'Move' },
                { id: 2, title: 'Yoga Restaurativo', duration: '30 min', intensity: 'Baja', icon: 'Sun' },
                { id: 3, title: 'Estiramiento Dinámico', duration: '15 min', intensity: 'Baja', icon: 'Wind' },
            ],
            low: [
                { id: 1, title: 'HIIT Cardio', duration: '25 min', intensity: 'Alta', icon: 'Zap' },
                { id: 2, title: 'Entrenamiento de Fuerza', duration: '45 min', intensity: 'Media', icon: 'Dumbbell' },
                { id: 3, title: 'Running Moderado', duration: '30 min', intensity: 'Media', icon: 'Activity' },
            ]
        };

        res.json({
            riskProfile,
            plan: plans[riskProfile]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get weekly challenges with REAL progress calculation
router.get('/challenges/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Mind Master Progress (Mood logs in the last 7 days)
        let mindProgress = 0;
        if (userId === 'guest-123') {
            mindProgress = 3;
        } else {
            const { count, error: mindError } = await supabase
                .from('emotional_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);
            mindProgress = count || 0;
        }

        // 2. Macro Hunter Progress (Nutrition logs)
        let macroProgress = 0;
        if (userId === 'guest-123') {
            macroProgress = 1;
        } else {
            const { count, error: nutritionError } = await supabase
                .from('nutrition_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);
            macroProgress = count || 0;
        }

        // 3. Max Power Progress (Exercise logs)
        let powerProgress = 0;
        if (userId === 'guest-123') {
            powerProgress = 0;
        } else {
            const { count, error: exerciseError } = await supabase
                .from('exercise_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);
            powerProgress = count || 0;
        }

        const challenges = [
            { id: 1, title: 'Maestro de la Mente', desc: 'Registra tu estado de ánimo 5 veces.', goal: 5, current: Math.min(5, mindProgress), prize: 500, icon: 'Heart' },
            { id: 2, title: 'Cazador de Macros', desc: 'Analiza tus comidas para llevar un control biológico.', goal: 3, current: Math.min(3, macroProgress), prize: 800, icon: 'Utensils' },
            { id: 3, title: 'Máxima Potencia', desc: 'Completa sesiones de entrenamiento.', goal: 3, current: Math.min(3, powerProgress), prize: 1000, icon: 'Zap' }
        ];

        res.json(challenges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Log completed exercise
router.post('/log', async (req, res) => {
    try {
        const { userId, exerciseId, title, duration, calories } = req.body;

        let logData;
        if (userId !== 'guest-123') {
            const { data, error } = await supabase
                .from('exercise_logs')
                .insert([{
                    user_id: userId,
                    exercise_id: exerciseId,
                    title,
                    duration,
                    calories,
                    recorded_at: new Date()
                }])
                .select();

            if (error) throw error;
            logData = data[0];
        } else {
            logData = { id: Date.now(), title, duration, calories };
        }

        // Add rewards (Points for effort)
        const points = parseInt(calories) > 0 ? Math.floor(calories / 10) : 50;
        const rewardData = await updateRewards(userId, points, 'exercise_log');

        res.json({
            message: 'Ejercicio registrado con éxito',
            data: logData,
            reward: {
                points,
                totalPoints: rewardData.totalPoints
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get exercise history
router.get('/history/:userId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('exercise_logs')
            .select('*')
            .eq('user_id', req.params.userId)
            .order('recorded_at', { ascending: false })
            .limit(10);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

