import React from 'react';
import { Check, Zap, Star, ShieldCheck } from 'lucide-react';

const Pricing = ({ onPurchase }) => {
    const tiers = [
        {
            name: 'Gratis',
            price: '0',
            description: 'Ideal para comenzar tu camino.',
            features: [
                'Onboarding Médico Básico',
                'Contador de Calorías',
                'Registro de Peso',
                'Diario Emocional (Limitado)',
            ],
            buttonText: 'Continuar Gratis',
            premium: false
        },
        {
            name: 'Premium',
            price: '9.99',
            description: 'El plan integral para resultados reales.',
            features: [
                'Todo lo del plan Gratis',
                'Planificador de Comidas Inteligente',
                'Comparativas "Antes y Después"',
                'Insignias Exclusivas de Bienestar',
                'Soporte por Chat 24/7',
            ],
            buttonText: 'Mejorar a Premium',
            premium: true,
            popular: true
        }
    ];

    return (
        <div className="py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-4">Elige tu Plan de Transformación</h2>
                <p className="text-slate-400 max-w-xl mx-auto">Invierte en tu salud integral. Desbloquea herramientas avanzadas de nutrición y salud mental.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative p-8 rounded-[2rem] border transition-all flex flex-col ${tier.popular
                                ? 'bg-gradient-to-b from-indigo-500/20 to-purple-500/20 border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.1)]'
                                : 'bg-glass border-slate-800'
                            }`}
                    >
                        {tier.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                <Star className="w-3 h-3 fill-current" /> Recomendado
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">${tier.price}</span>
                                <span className="text-slate-500 text-sm">/mes</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-4">{tier.description}</p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                                    <div className={`mt-0.5 rounded-full p-0.5 ${tier.premium ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => onPurchase(tier.premium)}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${tier.premium
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            {tier.buttonText}
                        </button>

                        {tier.premium && (
                            <p className="text-[10px] text-slate-500 text-center mt-4 flex items-center justify-center gap-1 uppercase tracking-tighter font-bold">
                                <ShieldCheck className="w-3 h-3" /> Pago Seguro - Cancela cuando quieras
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
