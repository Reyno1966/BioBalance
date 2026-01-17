import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import {
    ShoppingBag, Star, Zap, Palette, Layout, Sparkles,
    Loader2, CheckCircle2, Shield, Cpu, Layers, Flame,
    ArrowRight, Lock, Eye
} from 'lucide-react';
import confetti from '../utils/confetti';

const Marketplace = ({ user }) => {
    const [points, setPoints] = useState(0);
    const [purchased, setPurchased] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const items = [
        {
            id: 1, name: 'Neural-Cian Theme', type: 'Estética', price: 450,
            icon: Palette, color: 'text-cyan-400', glow: 'shadow-cyan-500/40',
            desc: 'Aplica una capa de luminiscencia cian reactiva a todos los componentes.'
        },
        {
            id: 2, name: 'Avatar Holo-Upgrade', type: 'Mejora AI', price: 1200,
            icon: Cpu, color: 'text-purple-400', glow: 'shadow-purple-500/40',
            desc: 'Renderiza tu HealthAvatar con partículas dinámicas en tiempo real.'
        },
        {
            id: 3, name: 'Escudo Metabólico', type: 'Protección', price: 800,
            icon: Shield, color: 'text-emerald-400', glow: 'shadow-emerald-500/40',
            desc: 'Mantiene tus rachas de entrenamiento activas incluso si fallas un día.'
        },
        {
            id: 4, name: 'Inyector de Dopamina', type: 'Estética', price: 300,
            icon: Zap, color: 'text-yellow-400', glow: 'shadow-yellow-500/40',
            desc: 'Efectos visuales dorados cada vez que completas un registro.'
        },
        {
            id: 5, name: 'Bio-Frecuencia Alfa', type: 'Auditivo', price: 600,
            icon: Flame, color: 'text-rose-400', glow: 'shadow-rose-500/40',
            desc: 'Desbloquea frecuencias sonoras para meditación profunda en Academy.'
        },
        {
            id: 6, name: 'Scanner de Nutrientes Pro', type: 'Upgrade', price: 1500,
            icon: Eye, color: 'text-blue-400', glow: 'shadow-blue-500/40',
            desc: 'Detecta micro-nutrientes específicos en el FoodAnalyzer.'
        }
    ];

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                if (user?.uid === 'guest-123') {
                    // Demo points for guest
                    setPoints(2400);
                    setLoading(false);
                } else {
                    const response = await axios.get(`${API_URL}/api/user/profile/${user.uid}`);
                    setPoints(response.data.points || 0);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Error fetching points:", err);
                setPoints(0);
                setLoading(false);
            }
        };
        if (user) fetchPoints();
    }, [user]);

    const handleBuy = async (item) => {
        if (points < item.price) return;

        setLoadingId(item.id);
        try {
            if (user?.uid !== 'guest-123') {
                await axios.post(`${API_URL}/api/user/purchase`, {
                    userId: user.uid,
                    itemId: item.id,
                    price: item.price,
                    itemName: item.name
                });
            }

            // Success animation and state update
            setTimeout(() => {
                setPoints(prev => prev - item.price);
                setPurchased(prev => [...prev, item.id]);
                setLoadingId(null);
                if (confetti) confetti();
            }, 800);

        } catch (err) {
            console.error("Error in purchase:", err);
            setLoadingId(null);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <ShoppingBag className="w-16 h-16 text-cyan-500 mb-4" />
            <p className="text-cyan-500 font-black uppercase tracking-widest text-[10px]">Cargando Inventario Bio-Teck...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4 pb-20">
            {/* Store Header */}
            <div className="bg-glass p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]">
                    <ShoppingBag className="w-64 h-64 text-cyan-400" />
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="space-y-4 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                            <div className="p-4 bg-cyan-500/20 rounded-[1.5rem] ai-glow">
                                <ShoppingBag className="text-cyan-400 w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-black text-white italic tracking-tight">Market <span className="text-cyan-400">Bio-Teck</span></h2>
                        </div>
                        <p className="text-slate-400 max-w-md font-medium text-lg">Evoluciona tu ADN digital con bio-mejoras exclusivas diseñadas para optimizar tu experiencia.</p>
                    </div>

                    <div className="bg-slate-950/80 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center space-x-6 backdrop-blur-xl relative overflow-hidden group/pts">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent opacity-0 group-hover/pts:opacity-100 transition-opacity" />
                        <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 group-hover/pts:scale-110 transition-transform">
                            <Star className="w-8 h-8 text-yellow-500 fill-current" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Capacidad de Cambio</p>
                            <p className="text-4xl font-black text-white text-glow">{points.toLocaleString()} <span className="text-xs text-yellow-500 -ml-1 uppercase">pts</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => {
                    const isPurchased = purchased.includes(item.id);
                    const canAfford = points >= item.price;
                    const isLoading = loadingId === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`bg-glass p-1 rounded-[3rem] transition-all duration-500 group relative ${isPurchased ? 'grayscale-[0.5] opacity-80' : 'hover:-translate-y-2'
                                }`}
                        >
                            <div className="bg-slate-950/60 p-10 rounded-[2.8rem] border border-white/5 h-full flex flex-col relative overflow-hidden">
                                {/* Item Header */}
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className={`p-5 rounded-2xl bg-slate-900/50 border border-white/5 group-hover:scale-110 transition-transform ${item.glow}`}>
                                        <item.icon className={`w-8 h-8 ${item.color}`} />
                                    </div>
                                    <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.type}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-grow">
                                    <h3 className="text-2xl font-black text-white mb-4 italic group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-10">{item.desc}</p>
                                </div>

                                {/* Footer / Actions */}
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span className="text-xl font-black text-white">{item.price}</span>
                                        </div>
                                        {isPurchased && (
                                            <div className="flex items-center space-x-2 text-emerald-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Activado</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleBuy(item)}
                                        disabled={!canAfford || isPurchased || isLoading}
                                        className={`w-full py-6 rounded-[1.8rem] font-black text-[12px] uppercase tracking-widest transition-all relative overflow-hidden flex items-center justify-center gap-3 ${isPurchased
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : canAfford
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-900/40 hover:scale-[1.03] active:scale-95'
                                                : 'bg-slate-900/80 text-slate-600 border border-white/5 cursor-not-allowed'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : isPurchased ? (
                                            'Objeto en Inventario'
                                        ) : canAfford ? (
                                            <>
                                                <span>Instalar Bio-Implante</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                <span>Bio-Puntos Insuficientes</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Decorative BG elements */}
                                <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity ${item.color.replace('text', 'bg')}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Tip */}
            <div className="bg-glass-hover bg-slate-900/20 p-10 rounded-[3rem] border border-white/5 text-center holographic-card overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-scanline" />
                <p className="text-slate-500 italic text-sm relative z-10">
                    "Los puntos de bienestar representan tu compromiso celular. Gástalos sabiamente para proyectar tu evolución ante la comunidad."
                </p>
            </div>
        </div>
    );
};

export default Marketplace;
