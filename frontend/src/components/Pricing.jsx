import React from 'react';
import { Check, Zap, Star, ShieldCheck, Loader2, Sparkles, Crown, Rocket, Shield } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';

const Pricing = ({ onPurchase }) => {
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(false);

    const handleStripePurchase = async (isPremium) => {
        if (!isPremium) {
            onPurchase(false);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/payment/create-checkout-session`, {
                userId: user?.uid || 'guest-123',
                priceId: 'premium_monthly'
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            console.error('Error initiating purchase:', err);
            onPurchase(true); // Fallback to allow access in demo
        } finally {
            setLoading(false);
        }
    };

    const tiers = [
        {
            name: 'Bio-Básico',
            price: '0',
            icon: <Rocket className="w-8 h-8 text-slate-400" />,
            description: 'Para quienes inician su sincronización biológica.',
            features: [
                { text: 'Registro de Nutrición', pro: false },
                { text: 'Evolución de Peso', pro: false },
                { text: 'Diario Emocional Básico', pro: false },
                { text: 'Vista de Panel General', pro: false },
                { text: 'Comunidad (Solo lectura)', pro: false }
            ],
            buttonText: 'Continuar Sincronización',
            premium: false,
            color: 'from-slate-700 to-slate-900'
        },
        {
            name: 'Bio-Elite',
            price: '9.99',
            icon: <Crown className="w-8 h-8 text-amber-400" />,
            description: 'Acceso total al ecosistema de bio-hacking avanzado.',
            features: [
                { text: 'Todo lo del plan Básico', pro: false },
                { text: 'IA de Nutrición Gemínida', pro: true },
                { text: 'Reportes de Éxito Bio-Hacking', pro: true },
                { text: 'Chat Asistente 24/7 (Soporte IA)', pro: true },
                { text: 'Bio-Academy & Recetas Elite', pro: true },
                { text: 'Gráficos de Correlación Avanzada', pro: true }
            ],
            buttonText: 'Actualizar a Elite',
            premium: true,
            popular: true,
            color: 'from-cyan-600 to-blue-700'
        }
    ];

    return (
        <div className="py-20 animate-in fade-in zoom-in-95 duration-1000">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-cyan-500" />
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Acceso de Próxima Generación</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
                        Invierte en tu <span className="text-gradient">Potencial Biológico</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
                        Desbloquea el poder de la red neuronal BioBalance y acelera tu transformación con herramientas de élite.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 group ${tier.popular
                                ? 'bg-slate-900/40 border-cyan-500/40 shadow-[0_0_80px_rgba(6,182,212,0.1)] scale-105 z-10'
                                : 'bg-slate-900/20 border-white/5 hover:border-white/10'
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-[0_10px_30px_rgba(245,158,11,0.3)] flex items-center gap-2">
                                    <Star className="w-3 h-3 fill-current" /> Sincronización Popular
                                </div>
                            )}

                            <div className="mb-10 text-center md:text-left">
                                <div className={`inline-block p-4 rounded-2xl bg-slate-950/50 border border-white/5 mb-6 group-hover:scale-110 transition-transform ${tier.premium ? 'shadow-[0_0_20px_rgba(34,211,238,0.2)]' : ''}`}>
                                    {tier.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white italic mb-2 tracking-tight">{tier.name}</h3>
                                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                                    <span className="text-5xl font-black text-white italic tracking-tighter">${tier.price}</span>
                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ por ciclo mensual</span>
                                </div>
                                <p className="text-slate-500 text-xs mt-4 font-medium italic">"{tier.description}"</p>
                            </div>

                            <div className="flex-1 mb-10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Protocolo de Acceso:</p>
                                <ul className="space-y-4">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-4 group/item">
                                            <div className={`p-1 rounded-lg transition-colors ${tier.premium ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className={`text-[11px] md:text-xs font-bold ${feature.pro ? 'text-white' : 'text-slate-400'} group-hover/item:translate-x-1 transition-transform`}>
                                                {feature.text}
                                            </span>
                                            {feature.pro && (
                                                <span className="text-[8px] font-black bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 uppercase tracking-widest">IA</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => handleStripePurchase(tier.premium)}
                                disabled={loading}
                                className={`group relative w-full py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.3em] transition-all overflow-hidden ${tier.premium
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-slate-950 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading && tier.premium ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {tier.buttonText}
                                            {tier.premium && <Zap className="w-4 h-4 fill-current animate-pulse" />}
                                        </>
                                    )}
                                </span>
                            </button>

                            {tier.premium && (
                                <div className="mt-6 flex items-center justify-center gap-4 opacity-50">
                                    <div className="flex items-center gap-1.5 grayscale">
                                        <Shield className="w-3 h-3 text-cyan-500" />
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Encriptación SSL</span>
                                    </div>
                                    <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stripe Certified</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-4">Metodología de Pago 100% Segura</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-20 grayscale hover:opacity-50 transition-opacity">
                        <div className="h-6 w-12 bg-slate-400 rounded-sm" /> {/* Placeholder for logos */}
                        <div className="h-6 w-12 bg-slate-400 rounded-sm" />
                        <div className="h-6 w-12 bg-slate-400 rounded-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
