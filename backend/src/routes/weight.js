import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Add weight log
router.post('/', async (req, res) => {
    const { userId, weight } = req.body;
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
    try {
        const { data, error } = await supabase
            .from('weight_logs')
            .select('*')
            .eq('user_id', req.params.userId)
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
        const { data, error } = await supabase
            .from('weight_logs')
            .select('weight, recorded_at')
            .eq('user_id', req.params.userId)
            .order('recorded_at', { ascending: true });

        if (error) throw error;

        // Format dates for chart
        const formatted = data.map(row => ({
            weight: row.weight,
            date: new Date(row.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
