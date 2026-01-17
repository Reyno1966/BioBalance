import express from 'express';
import { supabase } from '../config/supabase.js';
import { analyzeFoodImage } from '../services/aiService.js';
import { updateRewards } from '../services/rewardService.js';

const router = express.Router();

// Analyze food image and log nutrition
router.post('/analyze', async (req, res) => {
    const { userId, image } = req.body;
    try {
        if (!userId || !image) {
            return res.status(400).json({ error: 'User ID and image are required' });
        }

        const nutritionData = await analyzeFoodImage(image);

        if (userId === 'guest-123') {
            return res.json({
                message: 'Comida analizada (Modo Demo)',
                analysis: nutritionData,
                log: { user_id: userId, ...nutritionData },
                reward: { points: 100, totalPoints: 1350, badge: null, earned: false }
            });
        }

        // Log to Supabase
        const { data, error } = await supabase
            .from('nutrition_logs')
            .insert({
                user_id: userId,
                food_item: nutritionData.foodName,
                calories: nutritionData.calories,
                protein: nutritionData.protein,
                carbs: nutritionData.carbs,
                fat: nutritionData.fat,
                note: nutritionData.description
            })
            .select();

        if (error) throw error;

        // Add real rewards
        const rewardData = await updateRewards(userId, 100, 'nutrition_log');

        res.json({
            message: 'Comida analizada y registrada exitosamente',
            analysis: nutritionData,
            log: data[0],
            reward: {
                points: rewardData.pointsEarned,
                totalPoints: rewardData.totalPoints,
                badge: rewardData.newBadge ? rewardData.newBadge.name : null,
                earned: !!rewardData.newBadge
            }
        });
    } catch (err) {
        console.error('Error in /analyze:', err);
        res.status(500).json({ error: 'Error al analizar la imagen. Asegúrate de que la API Key sea válida.' });
    }
});

// Get nutritional summary
router.get('/summary/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === 'guest-123') {
            return res.json({
                total_calories: 1450,
                total_protein: 85,
                total_carbs: 120,
                total_fat: 45,
                calorieGoal: 2200
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: logs, error: logsError } = await supabase
            .from('nutrition_logs')
            .select('calories, protein, carbs, fat')
            .eq('user_id', userId)
            .gte('recorded_at', today.toISOString());

        if (logsError) throw logsError;

        const summary = logs.reduce((acc, log) => ({
            total_calories: acc.total_calories + (log.calories || 0),
            protein_sum: acc.protein_sum + (log.protein || 0),
            carbs_sum: acc.carbs_sum + (log.carbs || 0),
            fat_sum: acc.fat_sum + (log.fat || 0),
            count: acc.count + 1
        }), { total_calories: 0, protein_sum: 0, carbs_sum: 0, fat_sum: 0, count: 0 });

        res.json({
            total_calories: summary.total_calories,
            total_protein: summary.protein_sum,
            total_carbs: summary.carbs_sum,
            total_fat: summary.fat_sum,
            calorieGoal: 2200
        });
    } catch (err) {
        console.error('Error fetching summary:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get meal plan based on risk profile
router.get('/meal-plan/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === 'guest-123') {
            return res.json([
                { type: 'breakfast', description: 'Bowl de Avena con frutos rojos', kcal: 350 },
                { type: 'lunch', description: 'Pechuga de pollo con quinoa y palta', kcal: 550 },
                { type: 'dinner', description: 'Sopa de vegetales con tofu', kcal: 300 }
            ]);
        }

        const { data: medical, error } = await supabase
            .from('medical_history')
            .select('risk_profile')
            .eq('user_id', userId)
            .single();

        const riskProfile = medical?.risk_profile || 'low';
        // ... rest of the logic

        const plans = {
            high: [
                { type: 'breakfast', description: 'Omelette de clara de huevos con espinaca (Bajo en Sodio)', kcal: 250 },
                { type: 'lunch', description: 'Pollo al Vapor con brócoli y arroz integral', kcal: 450 },
                { type: 'dinner', description: 'Ensalada de Atún al natural con palta', kcal: 350 },
            ],
            low: [
                { type: 'breakfast', description: 'Pan integral con palta y huevo pochado', kcal: 350 },
                { type: 'lunch', description: 'Pasta integral con pesto de albahaca y pollo', kcal: 600 },
                { type: 'dinner', description: 'Tacos de pescado con tortilla de maíz', kcal: 500 },
            ]
        };

        res.json(plans[riskProfile]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get weekly insights (Current vs Previous Week)
router.get('/insights/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (userId === 'guest-123') {
            return res.json([
                { name: 'Lun', actual: 2100, shadow: 1900 },
                { name: 'Mar', actual: 1850, shadow: 2100 },
                { name: 'Mie', actual: 2300, shadow: 2000 },
                { name: 'Jue', actual: 1950, shadow: 1800 },
                { name: 'Vie', actual: 2400, shadow: 2200 },
                { name: 'Sab', actual: 2100, shadow: 2500 },
                { name: 'Dom', actual: 1800, shadow: 1900 }
            ]);
        }

        const now = new Date();
        const fourteenDaysAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));
        // ... rest of logic

        const { data: logs, error } = await supabase
            .from('nutrition_logs')
            .select('calories, recorded_at')
            .eq('user_id', userId)
            .gte('recorded_at', fourteenDaysAgo.toISOString());

        if (error) throw error;

        const processWeek = (daysOffset) => {
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now.getTime() - ((i + daysOffset) * 24 * 60 * 60 * 1000));
                const dateStr = date.toISOString().split('T')[0];
                const dayLogs = logs.filter(l => l.recorded_at.startsWith(dateStr));
                const totalCals = dayLogs.reduce((sum, l) => sum + (l.calories || 0), 0);
                days.push({
                    day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
                    calories: totalCals,
                    date: dateStr
                });
            }
            return days;
        };

        const currentWeek = processWeek(0);
        const previousWeek = processWeek(7);

        const comparison = currentWeek.map((day, i) => ({
            name: day.day,
            actual: day.calories,
            shadow: previousWeek[i].calories
        }));

        res.json({ currentWeek, previousWeek, comparison });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
