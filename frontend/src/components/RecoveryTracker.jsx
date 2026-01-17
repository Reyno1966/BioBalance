import React, { useState, useEffect } from 'react';
import {
    Moon, Star, Sun, Wind, Battery, Heart, Loader2,
    Trophy, TrendingUp, Sparkles, Brain, Zap, Shield, Cpu
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';
import confetti from '../utils/confetti';

const RecoveryTracker = ({ user }) => {
    const [hours, setHours] = useState(7.5);
    const [quality, setQuality] = useState(4);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [readiness, setReadiness] = useState(null);
    const [showReward, setShowReward] = useState(false);
    const [rewardData, setRewardData] = useState(null);

    const demoHistory = [
        { hours: 8, quality: 5, recorded_at: new Date(Date.now() - 86400000).toISOString() },
        { hours: 6.5, quality: 3, recorded_at: new Date(Date.now() - 172800000).toISOString() },
        { hours: 7.5, quality: 4, recorded_at: new Date(Date.now() - 259200000).toISOString() },
    ];

    const demoReadiness = {
        status: 'Optimizado',
        score: 88,
        color: 'text-emerald-400',
        advice: 'Tus niveles de sueño profundo han optimizado tu recuperación del tejido muscular. Es un excelente día para un entrenamiento de alta intensidad.',
        details: { ns: 92, hrv: 74, rr: 14 }
    };

    const fetchHistory = async () => {
        try {
            if (user?.uid === 'guest-123') {
                setHistory(demoHistory);
                setReadiness(demoReadiness);
            } else {
                const [historyRes, readinessRes] = await Promise.all([
                    axios.get(`${API_URL}/api/health/sleep/${user.uid}`),
                    axios.get(`${API_URL}/api/health/fatigue/${user.uid}`)
                ]);
                setHistory(historyRes.data.length ? historyRes.data : demoHistory);
                setReadiness(readinessRes.data || demoReadiness);
            }
        } catch (err) {
            console.error("Error fetching recovery data:", err);
            setHistory(demoHistory);
            setReadiness(demoReadiness);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (user?.uid !== 'guest-123') {
                const response = await axios.post(`${API_URL}/api/health/sleep`, {
                    userId: user.uid,
                    hours,
                    quality
                });
                setRewardData(response.data.reward);
            } else {
                setRewardData({ pointsEarned: 75 });
            }

            setShowReward(true);
            if (confetti) confetti();
            fetchHistory();
            setTimeout(() => setShowReward(false), 4000);
        } catch (err) {
            console.error("Error saving sleep:", err);
        } finally {
            setSaving(false);
        }
    };

    const lastSleep = history[0];
    const recoveryScore = lastSleep ? Math.min(100, (lastSleep.hours / 8) * 50 + (lastSleep.quality / 5) * 50) : 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-cyan-500 w-16 h-16" />
            <p className="text-cyan-500/60 font-black uppercase tracking-widest text-[10px]">Analizando Ondas Delta...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score and Readiness Centerpiece */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-glass p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <Moon className="w-48 h-48 text-indigo-400" />
                        </div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            {/* Pro-Centering Circle */}
                            <div className="relative w-64 h-64 flex items-center justify-center mx-auto md:mx-0 group/circle">
                                {/* Glowing Background Aura */}
                                <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full animate-pulse" />

                                <svg className="w-56 h-56 -rotate-90 relative z-10">
                                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
                                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent"
                                        strokeDasharray={2 * Math.PI * 100}
                                        strokeDashoffset={2 * Math.PI * 100 * (1 - recoveryScore / 100)}
                                        strokeLinecap="round"
                                        className="text-cyan-400 transition-all duration-1000 ai-glow drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]" />

                                    {/* Small orbital dots for premium feel */}
                                    <circle cx="112" cy="12" r="4" className="fill-cyan-400 animate-ping" />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                    <div className="relative flex flex-col items-center">
                                        <span className="text-7xl font-black text-white italic tracking-tighter leading-none mb-1">
                                            {Math.round(recoveryScore)}
                                        </span>
                                        <span className="text-[10px] text-cyan-500/60 font-black uppercase tracking-[0.4em] ml-2">RECOVERY_LEVEL</span>
                                    </div>

                                    {/* Scanline effect inside circle */}
                                    <div className="absolute inset-16 border border-cyan-500/20 rounded-full animate-reverse-spin border-dashed opacity-30" />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg mb-4">
                                        <Cpu className="w-3 h-3 text-cyan-400" />
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Neural Sync Active</span>
                                    </div>
                                    <h2 className="text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">
                                        Estado <span className="text-cyan-400">Bio-Activo</span>
                                    </h2>
                                    <p className="text-slate-400 mt-4 text-lg font-medium leading-relaxed">
                                        Tu arquitectura celular se encuentra al <span className="text-white font-bold">{Math.round(recoveryScore)}%</span> de su potencial regenerativo tras el último ciclo Delta.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl flex items-center space-x-4 group hover:border-emerald-500/30 transition-all">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-500/20">
                                            <Shield className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase">SNC Status</p>
                                            <p className="text-xs font-bold text-white uppercase">Restaurado</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl flex items-center space-x-4 group hover:border-cyan-500/30 transition-all">
                                        <div className="p-3 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500/20">
                                            <Zap className="w-5 h-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase">Glicógeno</p>
                                            <p className="text-xs font-bold text-white uppercase">84% Capacidad</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-glass p-8 rounded-[2.5rem] border border-white/5 holographic-card">
                            <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                                <Battery className="text-cyan-400 w-6 h-6" /> Análisis de Fatiga AI
                            </h3>
                            {readiness && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-2xl font-black ${readiness.color} uppercase tracking-tighter`}>
                                            {readiness.status}
                                        </span>
                                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-slate-500">
                                            IA ANALYTICS
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {readiness.advice}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Métricas Detalladas</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">HRV (Promedio)</span>
                                    <span className="text-white font-black">74 ms</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1 rounded-full">
                                    <div className="bg-cyan-500 h-full rounded-full w-[74%]" />
                                </div>
                                <div className="flex justify-between items-center text-sm pt-2">
                                    <span className="text-slate-500">Gasto Calórico Basal</span>
                                    <span className="text-white font-black">1,840 kcal</span>
                                </div>
                                <div className="w-full bg-slate-900 h-1 rounded-full">
                                    <div className="bg-indigo-500 h-full rounded-full w-[84%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log Sleep Panel */}
                <div className="bg-glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden h-max">
                    <div className="flex items-center space-x-4 mb-10">
                        <div className="p-4 bg-indigo-500/20 rounded-[1.5rem] ai-glow">
                            <Moon className="text-indigo-400 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white">Sincronizar</h3>
                            <p className="text-slate-500 text-xs">Registra tu descanso Delta.</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Horas de Sueño</label>
                                <span className="text-4xl font-black text-white">{hours}</span>
                            </div>
                            <input
                                type="range" min="4" max="12" step="0.5"
                                value={hours} onChange={(e) => setHours(parseFloat(e.target.value))}
                                className="w-full h-3 bg-slate-900 rounded-full appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center block">Calidad Percibida</label>
                            <div className="flex justify-between gap-3">
                                {[1, 2, 3, 4, 5].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setQuality(q)}
                                        className={`flex-1 py-5 rounded-2xl border transition-all flex flex-col items-center space-y-2 ${quality === q ? 'bg-indigo-500 border-indigo-400/50 scale-105 shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-slate-950/40 border-white/5 opacity-40 hover:opacity-100'
                                            }`}
                                    >
                                        <Star className={`w-6 h-6 ${quality >= q ? 'text-white fill-current' : 'text-slate-600'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl font-black text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-3"
                        >
                            {saving ? <Loader2 className="animate-spin" /> : <span>Actualizar Biometría</span>}
                        </button>
                    </div>

                    {showReward && (
                        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8 z-20 animate-in zoom-in duration-500">
                            <div className="p-8 bg-yellow-400/10 rounded-full mb-6">
                                <Trophy className="text-yellow-400 w-24 h-24 animate-bounce" />
                            </div>
                            <h3 className="text-4xl font-black text-white">¡Racha de Sueño!</h3>
                            <p className="text-slate-400 mt-2 mb-8 uppercase text-xs font-bold tracking-[0.3em]">Nivel de Usuario Aumentado</p>
                            <div className="flex items-center space-x-2 text-yellow-400 font-black bg-slate-900 px-8 py-4 rounded-full border border-yellow-500/30 shadow-2xl">
                                <Sparkles className="w-6 h-6 fill-current" />
                                <span>+{rewardData?.pointsEarned || 50} BIO-PUNTOS</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* History Section */}
            <div className="bg-glass p-10 rounded-[3rem] border border-white/5 mt-8">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black flex items-center gap-3">
                        <TrendingUp className="text-indigo-400" /> Bio-Historial Semanal
                    </h3>
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                        Últimos 7 Días
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {history.map((log, i) => (
                        <div key={i} className="bg-slate-950/60 p-6 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all group perspective-2000">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-indigo-400 bg-indigo-500/10 p-2 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                    <Moon className="w-5 h-5" />
                                </div>
                                <div className="flex space-x-0.5">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className={`w-1.5 h-1.5 rounded-full ${j < log.quality ? 'bg-yellow-500' : 'bg-slate-800'}`} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-white font-black text-xl">{log.hours}<span className="text-xs text-slate-500 ml-1">hrs</span></p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                                    {new Date(log.recorded_at).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecoveryTracker;

