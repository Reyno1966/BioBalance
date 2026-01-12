import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Add emotional log
router.post('/', async (req, res) => {
    const { userId, mood, note } = req.body;
    try {
        const text = 'INSERT INTO emotional_logs (user_id, mood, note) VALUES ($1, $2, $3) RETURNING *';
        const values = [userId, mood, note];
        const result = await query(text, values);

        // Simulate reward logic
        const reward = {
            points: 50,
            badge: 'Equilibrio Interior',
            earned: true
        };

        res.json({ log: result.rows[0], reward });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get emotional logs
router.get('/:userId', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM emotional_logs WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 10',
            [req.params.userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
