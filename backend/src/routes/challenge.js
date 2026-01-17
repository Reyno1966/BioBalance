import express from 'express';
import { supabase } from '../config/supabase.js';
import { updateRewards } from '../services/rewardService.js';

const router = express.Router();

// Get active challenges
router.get('/active', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('flash_challenges')
            .select('*')
            .order('id', { ascending: true }) // Using ID as fallback for order
            .limit(1);

        if (error) {
            // Fallback for demo if DB is not ready
            return res.json({
                id: 1,
                title: 'Hidratación Express',
                description: 'Bebe 500ml de agua ahora mismo.',
                points: 50,
                duration_minutes: 60
            });
        }
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Complete a challenge
router.post('/complete', async (req, res) => {
    const { userId, challengeId } = req.body;

    if (userId === 'guest-123') {
        const rewards = await updateRewards(userId, 50, 'challenge');
        return res.json({ message: 'Reto completado (Modo Demo)', rewards });
    }

    try {
        const { error } = await supabase
            .from('user_challenges')
            .insert({ user_id: userId, challenge_id: challengeId });

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Reto ya completado' });
            }
            throw error;
        }

        // Get challenge points
        const { data: challenge } = await supabase
            .from('flash_challenges')
            .select('points')
            .eq('id', challengeId)
            .single();

        // Update rewards (points)
        const rewards = await updateRewards(userId, challenge?.points || 50, 'challenge');

        res.json({ message: 'Reto completado', rewards });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
