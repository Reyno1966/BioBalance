import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Add weight log
router.post('/', async (req, res) => {
    const { userId, weight } = req.body;

    if (userId === 'guest-123') {
        return res.json({ id: Date.now(), user_id: userId, weight, recorded_at: new Date() });
    }

    try {
        const { data, error } = await supabase
            .from('weight_logs')
            .insert({ user_id: userId, weight })
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get weight logs
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    if (userId === 'guest-123') {
        return res.json([
            { weight: 89.8, recorded_at: new Date().toISOString() }
        ]);
    }
    try {
        const { data, error } = await supabase
            .from('weight_logs')
            .select('*')
            .eq('user_id', userId)
            .order('recorded_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get weight history
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === 'guest-123') {
            return res.json([
                { date: '1 Ene', weight: 92.5 },
                { date: '4 Ene', weight: 91.8 },
                { date: '8 Ene', weight: 90.5 },
                { date: '12 Ene', weight: 89.8 }
            ]);
        }

        const { data, error } = await supabase
            .from('weight_logs')
            .select('weight, recorded_at')
            .eq('user_id', userId)
            .order('recorded_at', { ascending: true });

        if (error) throw error;

        // Format dates for chart
        const formatted = data.map(row => ({
            weight: row.weight,
            date: new Date(row.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        }));
        res.json(formatted);
    } catch (err) {
        console.error('Error fetching weight history:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
