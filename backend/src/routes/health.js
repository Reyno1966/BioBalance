import express from 'express';
import { supabase } from '../config/supabase.js';
import { updateRewards } from '../services/rewardService.js';

const router = express.Router();

// Log sleep
router.post('/sleep', async (req, res) => {
    const { userId, hours, quality } = req.body;

    if (userId === 'guest-123') {
        const reward = await updateRewards(userId, 40, 'sleep');
        return res.json({
            data: { user_id: userId, hours, quality, recorded_at: new Date().toISOString().split('T')[0] },
            reward
        });
    }

    try {
        const { data, error } = await supabase
            .from('sleep_logs')
            .upsert({ user_id: userId, hours, quality, recorded_at: new Date().toISOString().split('T')[0] })
            .select();

        if (error) throw error;

        // Award points for registering sleep
        const reward = await updateRewards(userId, 40, 'sleep');

        res.json({ data: data[0], reward });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get sleep history
router.get('/sleep/:userId', async (req, res) => {
    const { userId } = req.params;
    if (userId === 'guest-123') {
        return res.json([
            { hours: 7.5, quality: 4, recorded_at: new Date().toISOString().split('T')[0] }
        ]);
    }
    try {
        const { data, error } = await supabase
            .from('sleep_logs')
            .select('*')
            .eq('user_id', userId)
            .order('recorded_at', { ascending: false })
            .limit(7);

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get fatigue / readiness analysis
router.get('/fatigue/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Get latest sleep log
        const { data: sleep, error: sleepError } = await supabase
            .from('sleep_logs')
            .select('*')
            .eq('user_id', userId)
            .order('recorded_at', { ascending: false })
            .limit(1)
            .single();

        // 2. Get recent exercise logs (simulated for now or query exercise_logs if exists)
        // For this demo, we'll assume a "high load" day if they have points recently
        const readiness = {
            score: 75, // Default
            status: 'Óptimo',
            advice: 'Estás listo para un entrenamiento intenso.',
            color: 'text-green-400'
        };

        if (!sleepError && sleep) {
            const sleepScore = (sleep.hours / 8) * 50 + (sleep.quality / 5) * 50;
            readiness.score = Math.round(sleepScore);

            if (readiness.score < 40) {
                readiness.status = 'Fatiga Alta';
                readiness.advice = 'Tu cuerpo necesita descanso hoy. Prioriza estiramientos suaves.';
                readiness.color = 'text-red-400';
            } else if (readiness.score < 70) {
                readiness.status = 'Moderado';
                readiness.advice = 'Entrenamiento moderado recomendado. No te exijas al máximo.';
                readiness.color = 'text-yellow-400';
            } else {
                readiness.status = 'Listo para Acción';
                readiness.advice = 'Batería cargada. ¡A por ese nuevo récord!';
                readiness.color = 'text-cyan-400';
            }
        }

        res.json(readiness);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

