import express from 'express';
import { supabase } from '../config/supabase.js';
import { updateRewards } from '../services/rewardService.js';

const router = express.Router();

// Add emotional log
router.post('/', async (req, res) => {
    const { userId, mood, note } = req.body;

    if (userId === 'guest-123') {
        const rewardData = await updateRewards(userId, 50, 'emotional_log');
        return res.json({
            log: { id: Date.now(), user_id: userId, mood, note, recorded_at: new Date() },
            reward: {
                points: rewardData.pointsEarned,
                totalPoints: rewardData.totalPoints,
                badge: null,
                earned: false
            }
        });
    }

    try {
        const { data, error } = await supabase
            .from('emotional_logs')
            .insert({ user_id: userId, mood, note })
            .select();

        if (error) throw error;

        // Add real rewards
        const rewardData = await updateRewards(userId, 50, 'emotional_log');

        res.json({
            log: data[0],
            reward: {
                points: rewardData.pointsEarned,
                totalPoints: rewardData.totalPoints,
                badge: rewardData.newBadge ? rewardData.newBadge.name : null,
                earned: !!rewardData.newBadge
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// Get emotional logs
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    if (userId === 'guest-123') {
        return res.json([
            { mood: 'happy', recorded_at: new Date().toISOString() }
        ]);
    }
    try {
        const { data, error } = await supabase
            .from('emotional_logs')
            .select('*')
            .eq('user_id', userId)
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
