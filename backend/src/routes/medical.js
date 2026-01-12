import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Save or update medical history
router.post('/', async (req, res) => {
    const { userId, hypertension, diabetes, jointInjuries, allergies, allergiesDetail, otherConditions, riskProfile } = req.body;

    try {
        const text = `
      INSERT INTO medical_history (user_id, has_hypertension, has_diabetes, has_joint_injuries, has_allergies, allergies_detail, other_conditions, risk_profile)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        has_hypertension = EXCLUDED.has_hypertension,
        has_diabetes = EXCLUDED.has_diabetes,
        has_joint_injuries = EXCLUDED.has_joint_injuries,
        has_allergies = EXCLUDED.has_allergies,
        allergies_detail = EXCLUDED.allergies_detail,
        other_conditions = EXCLUDED.other_conditions,
        risk_profile = EXCLUDED.risk_profile,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
        const values = [userId, hypertension, diabetes, jointInjuries, allergies, allergiesDetail, otherConditions, riskProfile];
        const result = await query(text, values);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get medical history
router.get('/:userId', async (req, res) => {
    try {
        const result = await query('SELECT * FROM medical_history WHERE user_id = $1', [req.params.userId]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
