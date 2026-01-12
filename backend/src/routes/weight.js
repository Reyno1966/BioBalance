import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Add weight log
router.post('/', async (req, res) => {
    const { userId, weight } = req.body;
    try {
        const result = await query(
            'INSERT INTO weight_logs (user_id, weight) VALUES ($1, $2) RETURNING *',
            [userId, weight]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get weight logs
router.get('/:userId', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM weight_logs WHERE user_id = $1 ORDER BY recorded_at DESC',
            [req.params.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get weight history
router.get('/history/:userId', async (req, res) => {
    try {
        const text = 'SELECT weight, recorded_at as date FROM weight_logs WHERE user_id = $1 ORDER BY recorded_at ASC';
        const result = await query(text, [req.params.userId]);
        // Format dates for chart
        const formatted = result.rows.map(row => ({
            ...row,
            date: new Date(row.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
