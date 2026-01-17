import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { supabase } from '../config/supabase.js';

dotenv.config();

const router = express.Router();
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.warn('⚠️ STRIPE_SECRET_KEY not found. Payment features will be disabled.');
}

router.post('/create-checkout-session', async (req, res) => {
    const { userId, priceId } = req.body;

    try {
        if (!stripe) {
            return res.status(500).json({ error: 'Sistema de pagos no configurado. Falta STRIPE_SECRET_KEY en el servidor.' });
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'BioBalance Premium Plan',
                            description: 'Acceso total a herramientas de optimización biológica.',
                        },
                        unit_amount: 999, // $9.99
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`,
            metadata: {
                userId: userId,
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.error('Stripe Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Webhook for Stripe to notify us about successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    if (!stripe) {
        return res.status(500).json({ error: 'Stripe not initialized' });
    }

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        // Update user status in Supabase
        await supabase.from('users').update({ is_premium: true }).eq('id', userId);
    }

    res.json({ received: true });
});

export default router;
