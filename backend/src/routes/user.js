import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Get user profile (including points and badges)
router.get('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Mock data for guest account
        if (userId === 'guest-123') {
            return res.json({
                full_name: 'Usuario Invitado',
                email: 'invitado@biobalance.ai',
                points: 1250,
                is_premium: false,
                badges: [
                    { id: 1, name: 'Mente Clara', icon: 'Star', color: 'text-blue-400' },
                    { id: 3, name: 'Cazador de Macros', icon: 'Zap', color: 'text-cyan-400' }
                ],
                level: 3,
                rank: 'Iniciado',
                progress: 45,
                nextLevelPoints: 1600
            });
        }

        // Get user points
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('points, full_name, email') // Removed is_premium until migration is confirmed
            .eq('id', userId)
            .single();

        if (userError) {
            // Handle case where user exists in Auth but not in our 'users' table yet
            if (userError.code === 'PGRST116') { // No rows found
                return res.json({
                    full_name: 'Nuevo Usuario',
                    email: '',
                    points: 0,
                    is_premium: false,
                    badges: [],
                    level: 1,
                    rank: 'Novato',
                    progress: 0,
                    nextLevelPoints: 100
                });
            }
            throw userError;
        }

        // Get user badges
        const { data: badges, error: badgesError } = await supabase
            .from('user_badges')
            .select('earned_at, badges(id, name, icon, color, description)')
            .eq('user_id', userId);

        if (badgesError) throw badgesError;

        // Format badges
        const formattedBadges = badges.map(b => ({
            ...b.badges,
            earned_at: b.earned_at
        }));

        // Calculate Level and Progress
        const points = user.points || 0;
        const level = Math.floor(Math.sqrt(points / 100)) + 1;
        const currentLevelBase = Math.pow(level - 1, 2) * 100;
        const nextLevelBase = Math.pow(level, 2) * 100;
        const progress = ((points - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100;

        const ranks = ['Novato', 'Iniciado', 'Guerrero de Salud', 'Maestro BioBalance', 'Leyenda de Vida'];
        const rank = ranks[Math.min(level - 1, ranks.length - 1)];

        res.json({
            ...user,
            is_premium: user.is_premium || false,
            badges: formattedBadges,
            level,
            rank,
            progress: Math.min(100, progress),
            nextLevelPoints: nextLevelBase
        });

    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get community ranking
router.get('/ranking', async (req, res) => {
    try {
        const { data: topUsers, error } = await supabase
            .from('users')
            .select('full_name, points')
            .order('points', { ascending: false })
            .limit(10);

        if (error) throw error;

        // Add some simulated users if DB is empty/low
        const simulated = [
            { full_name: 'Elena Guerrero', points: 1450, isBot: true },
            { full_name: 'Marcos Vital', points: 1200, isBot: true },
            { full_name: 'Dra. Salud', points: 3000, isBot: true }
        ];

        const combined = [...topUsers, ...simulated].sort((a, b) => b.points - a.points);

        res.json(combined);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get global community points
router.get('/ranking/global', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('points');

        if (error) throw error;

        const totalPoints = data.reduce((sum, u) => sum + (u.points || 0), 0);
        res.json({
            totalPoints,
            goal: 50000,
            label: 'Meta de Salud Global: 50k Puntos',
            description: '¡Estamos a punto de desbloquear un nuevo tema exclusivo para todos!'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get recent community moments
router.get('/community/moments', async (req, res) => {
    try {
        const moments = [
            { id: 1, user: 'Carlos M.', action: 'completó su meta de proteínas', time: 'hace 5m', type: 'nutrition', icon: 'Utensils' },
            { id: 2, user: 'Elena R.', action: 'alcanzó el Nivel 15', time: 'hace 12m', type: 'level', icon: 'Trophy' },
            { id: 3, user: 'BioBalance Bot', action: '¡Meta Global alcanzada en un 70%!', time: 'hace 20m', type: 'global', icon: 'Globe' },
            { id: 4, user: 'Santi G.', action: 'registró una racha de 7 días de sueño', time: 'hace 45m', type: 'sleep', icon: 'Moon' }
        ];
        res.json(moments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get team rankings
router.get('/ranking/teams', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('team_name, points')
            .not('team_name', 'is', null);

        if (error) throw error;

        const teamPoints = data.reduce((acc, current) => {
            const team = current.team_name;
            if (!acc[team]) acc[team] = 0;
            acc[team] += current.points || 0;
            return acc;
        }, {});

        const sortedTeams = Object.keys(teamPoints).map(name => ({
            name,
            points: teamPoints[name]
        })).sort((a, b) => b.points - a.points);

        res.json(sortedTeams);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Process item purchase
router.post('/purchase', async (req, res) => {
    const { userId, itemId, price, itemName } = req.body;
    try {
        // 1. Get current points
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('points')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        if (user.points < price) {
            return res.status(400).json({ error: 'Points insufficient for this Bio-Implante' });
        }

        // 2. Deduct points
        const newTotal = user.points - price;
        const { error: updateError } = await supabase
            .from('users')
            .update({ points: newTotal })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 3. Log purchase (optional but good practice)
        // Here we could add to a 'user_inventory' table if it existed

        res.json({ success: true, newPoints: newTotal, message: `Adquirido: ${itemName}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;




