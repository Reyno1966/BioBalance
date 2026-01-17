import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Save or update medical history
router.post('/', async (req, res) => {
    const { userId, hypertension, diabetes, jointInjuries, allergies, allergiesDetail, otherConditions, riskProfile } = req.body;

    try {
        // Handle guest user
        if (userId === 'guest-123') {
            return res.json({
                user_id: userId,
                has_hypertension: hypertension,
                has_diabetes: diabetes,
                has_joint_injuries: jointInjuries,
                has_allergies: allergies,
                risk_profile: riskProfile,
                message: 'Guest profile simulated'
            });
        }

        // 1. Ensure user exists in 'users' table first (to prevent FK error)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id')
            .eq('id', userId)
            .single();

        if (userError && userError.code === 'PGRST116') {
            // User doesn't exist in our custom table yet, create them
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    id: userId,
                    email: req.body.email || 'pending@biobalance.ai', // Fallback if email not provided
                    full_name: req.body.fullName || 'Nuevo Usuario',
                    password_hash: 'firebase-auth' // Placeholder
                });
            if (insertError) throw insertError;
        }

        // 2. Upsert medical history
        const { data, error } = await supabase
            .from('medical_history')
            .upsert({
                user_id: userId,
                has_hypertension: hypertension,
                has_diabetes: diabetes,
                has_joint_injuries: jointInjuries,
                has_allergies: allergies,
                allergies_detail: allergiesDetail,
                other_conditions: otherConditions,
                risk_profile: riskProfile,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (err) {
        console.error('Medical route error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get medical history
router.get('/:userId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('medical_history')
            .select('*')
            .eq('user_id', req.params.userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is code for "no rows found"
        if (!data) return res.status(404).json({ error: 'Not found' });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
