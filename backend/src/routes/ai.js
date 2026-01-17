import express from 'express';
import { getWellnessAdvice, getRecipeSuggestions, getDailyWisdom, generateWellnessReport } from '../services/aiService.js';



import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/recipes/:userId', async (req, res) => {
    const { userId } = req.params;
    if (userId === 'guest-123') {
        return res.json([
            {
                title: 'Quantum Bio-Bowl',
                time: '15 min',
                calories: 450,
                genomicMatch: 98,
                difficulty: 'Fácil',
                ingredients: ['Kale Orgánico', 'Semillas de Granada', 'Aguacate Madurado', 'Flores Comestibles', 'Nueces de la India'],
                steps: [
                    'Lavar profundamente los vegetales bajo agua fría.',
                    'Cortar el aguacate en láminas precisas de 0.5cm.',
                    'Mezclar las bases verdes con el aderezo de limón y jengibre.',
                    'Decorar con las semillas de granada y las flores holográficas.'
                ]
            },
            {
                title: 'Salmón Neural-Boost',
                time: '25 min',
                calories: 620,
                genomicMatch: 95,
                difficulty: 'Medio',
                ingredients: ['Filete de Salmón', 'Espárragos Trigueros', 'Quinoa Real', 'Salsa de Miso', 'Algas Nori'],
                steps: [
                    'Sellar el salmón a fuego alto por 3 min por cada lado.',
                    'Saltear los espárragos con un toque de ajo.',
                    'Servir sobre una cama de quinoa al dente.',
                    'Finalizar con la reducción de miso y tiras de nori.'
                ]
            },
            {
                title: 'Smoothie Sincronización Alfa',
                time: '5 min',
                calories: 280,
                genomicMatch: 92,
                difficulty: 'Fácil',
                ingredients: ['Arándanos Azules', 'Espirulina', 'Leche de Almendras', 'Proteína Vegana', 'Menta Fresca'],
                steps: [
                    'Introducir todos los ingredientes en la Bio-Licuadora.',
                    'Procesar a velocidad máxima por 45 segundos.',
                    'Servir en un vaso de cristal frío.',
                    'Disfrutar inmediatamente para absorción total.'
                ]
            }
        ]);
    }
    try {
        const { data: medical } = await supabase.from('medical_history').select('risk_profile').eq('user_id', userId).single();
        const recipes = await getRecipeSuggestions({ riskProfile: medical?.risk_profile });
        res.json(recipes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/wisdom/:userId', async (req, res) => {
    const { userId } = req.params;
    if (userId === 'guest-123') {
        return res.json({
            title: 'Sincronización Circadiana',
            content: 'Tus niveles de adenosina están en el punto óptimo. Para maximizar tu regeneración celular esta noche, intenta evitar la luz azul en los próximos 60 minutos. Tu cuerpo está listo para una fase REM profunda.',
            type: 'Sleep Logic'
        });
    }
    try {
        const { data: profile } = await supabase.from('users').select('points').eq('id', userId).single();
        const { data: mood } = await supabase.from('emotional_logs').select('mood').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1).single();

        const points = profile?.points || 0;
        const level = Math.floor(Math.sqrt(points / 100)) + 1;

        const wisdom = await getDailyWisdom({
            points: points,
            level: level,
            lastMood: mood?.mood || 'Neutral'
        });
        res.json(wisdom);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/chat', async (req, res) => {
    const { userId, message } = req.body;

    if (userId === 'guest-123') {
        try {
            const advice = await getWellnessAdvice(message, {
                riskProfile: 'Standard',
                calories: 0,
                recentMood: 'Neutral'
            });
            return res.json({ advice });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }

    try {
        // Fetch context (risk profile, latest nutrition, latest mood)
        const [medical, nutrition, emotional] = await Promise.all([
            supabase.from('medical_history').select('risk_profile').eq('user_id', userId).single(),
            supabase.from('nutrition_logs').select('calories').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1),
            supabase.from('emotional_logs').select('mood').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1)
        ]);

        const context = {
            riskProfile: medical?.data?.risk_profile,
            calories: nutrition?.data?.[0]?.calories,
            recentMood: emotional?.data?.[0]?.mood,
            expert: req.body.expert // Pass expert type if provided
        };

        const advice = await getWellnessAdvice(message, context);
        res.json({ advice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/report', async (req, res) => {
    const { userId } = req.body;

    if (userId === 'guest-123') {
        const report = await generateWellnessReport({
            points: 1250,
            level: 3,
            badges: 'Mente Clara, Cazador de Macros',
            lastMood: 'Excelente'
        });
        return res.json(report);
    }

    try {
        const { data: profile } = await supabase.from('users').select('points').eq('id', userId).single();
        const { data: mood } = await supabase.from('emotional_logs').select('mood').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(1).single();
        const { data: badges } = await supabase.from('user_badges').select('badges(name)').eq('user_id', userId);

        const points = profile?.points || 0;
        const level = Math.floor(Math.sqrt(points / 100)) + 1;

        const report = await generateWellnessReport({
            points: points,
            level: level,
            badges: badges?.map(b => b.badges.name).join(', ') || 'Ninguna',
            lastMood: mood?.mood || 'Neutral'
        });

        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;

