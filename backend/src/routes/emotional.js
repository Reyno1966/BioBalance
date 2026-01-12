import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Add emotional log
router.post('/', async (req, res) => {
    const { userId, mood, note } = req.body;
    try {
        const { data, error } = await supabase
            .from('emotional_logs')
            .insert({ user_id: userId, mood, note })
            .select();

        if (error) throw error;

        // Simulate reward logic
        const reward = {
            points: 50,
            badge: 'Equilibrio Interior',
            earned: true
        };

        res.json({ log: data[0], reward });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get emotional logs
router.get('/:userId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('emotional_logs')
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
