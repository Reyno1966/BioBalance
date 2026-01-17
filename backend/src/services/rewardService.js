import { supabase } from '../config/supabase.js';

/**
 * Adds points to a user and checks if they earned any new badges.
 * @param {string} userId - The user's ID
 * @param {number} pointsToAdd - Amount of points to add
 * @param {string} activityType - Type of activity (e.g., 'emotional_log', 'nutrition_log')
 */
export const updateRewards = async (userId, pointsToAdd, activityType) => {
    try {
        if (userId === 'guest-123') {
            return { pointsEarned: pointsToAdd, totalPoints: 1350, newBadge: null };
        }
        // 1. Update user points
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('points')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        const newTotal = (userData.points || 0) + pointsToAdd;

        const { error: updateError } = await supabase
            .from('users')
            .update({ points: newTotal })
            .eq('id', userId);

        if (updateError) throw updateError;

        // 2. Logic to check for badges
        let newBadge = null;

        if (activityType === 'emotional_log') {
            // Check how many logs they have
            const { count, error: countError } = await supabase
                .from('emotional_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (!countError) {
                if (count === 1) {
                    newBadge = await assignBadge(userId, 'Mente Clara');
                } else if (count === 3) {
                    newBadge = await assignBadge(userId, 'Equilibrio Interior');
                }
            }
        } else if (activityType === 'nutrition_log') {
            newBadge = await assignBadge(userId, 'Cazador de Macros');
        } else if (activityType === 'sleep') {

            const { count, error: countError } = await supabase
                .from('sleep_logs')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (!countError && count === 1) {
                newBadge = await assignBadge(userId, 'Sueño Reparador');
            }
        }


        return {
            pointsEarned: pointsToAdd,
            totalPoints: newTotal,
            newBadge
        };
    } catch (error) {
        console.error('Error in rewardService:', error);
        return { error: error.message };
    }
};

const assignBadge = async (userId, badgeName) => {
    try {
        // Get badge ID
        const { data: badge, error: badgeError } = await supabase
            .from('badges')
            .select('id, name, icon, color')
            .eq('name', badgeName)
            .single();

        if (badgeError) return null;

        // Try to insert (will fail if already earned due to PK)
        const { error: insertError } = await supabase
            .from('user_badges')
            .insert({ user_id: userId, badge_id: badge.id });

        if (insertError) return null; // Already had it or error

        return badge;
    } catch (err) {
        return null;
    }
};
