import React, { useState, useEffect } from 'react';
import {
    Heart, Smile, Frown, Meh, Star, Trophy, MessageCircle,
    Calendar, TrendingUp, Sparkles, Brain, Zap, Shield, Target, Loader2,
    Cpu, Radar, Waves, Activity, ZapOff
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';
import confetti from '../utils/confetti';

const MindCenter = ({ user }) => {
    const [mood, setMood] = useState(null);
    const [note, setNote] = useState('');
    const [showReward, setShowReward] = useState(false);
    const [rewardData, setRewardData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const moods = [
        { label: 'Invencible', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', val: 5, neural: 'Dopamina Peak' },
        { label: 'Bien', icon: Smile, color: 'text-cyan-400', bg: 'bg-cyan-400/10', val: 4, neural: 'Serotonina Estable' },
        { label: 'Neutral', icon: Meh, color: 'text-slate-400', bg: 'bg-slate-400/10', val: 3, neural: 'Homeostasis' },
        { label: 'Bajo', icon: Frown, color: 'text-indigo-400', bg: 'bg-indigo-400/10', val: 2, neural: 'Cortisol Elevado' },
        { label: 'Estresado', icon: Brain, color: 'text-rose-400', bg: 'bg-rose-400/10', val: 1, neural: 'Fight or Flight' },
    ];

    const demoHistory = [
        { id: 1, mood: 'Bien', note: 'Buen entrenamiento matutino, enfoque estable.', recorded_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, mood: 'Invencible', note: 'Estado de Flow alcanzado durante el trabajo profundo.', recorded_at: new Date(Date.now() - 172800000).toISOString() },
    ];

    const fetchHistory = async () => {
        try {
            if (user?.uid === 'guest-123') {
                setHistory(demoHistory);
            } else {
                const response = await axios.get(`${API_URL}/api/emotional/${user.uid}`);
                setHistory(response.data.length ? response.data : demoHistory);
            }
        } catch (err) {
            setHistory(demoHistory);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mood) return;
        setSaving(true);
        try {
            if (user?.uid !== 'guest-123') {
                const response = await axios.post(`${API_URL}/api/emotional`, {
                    userId: user.uid,
                    mood,
                    note
                });
                setRewardData(response.data.reward);
            } else {
                setRewardData({ points: 75, earned: true, badge: 'Eco-Enfoque' });
            }
            setShowReward(true);
            if (confetti) confetti();
            setMood(null);
            setNote('');
            fetchHistory();
            setTimeout(() => setShowReward(false), 4000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4 h-96">
            <Loader2 className="animate-spin text-indigo-500 w-16 h-16" />
            <p className="text-indigo-500/60 font-black uppercase tracking-[0.3em] text-[10px]">Cuantificando Neuro-Estados...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-1000 px-6 pb-24">
            {/* Header: Cognitive Hub Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-glass p-12 rounded-[4rem] border border-white/5 relative overflow-hidden group shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                        <Radar className="w-64 h-64 text-indigo-400" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-6 mb-12">
                            <div className="p-5 bg-indigo-500/20 rounded-[2rem] border border-indigo-500/30 ai-glow">
                                <Brain className="text-indigo-400 w-10 h-10" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Mind <span className="text-indigo-400">Center</span></h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Terminal de Optimización Cognitiva</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Decodificador de Ánimo</span>
                                    <div className="h-px flex-1 mx-8 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {moods.map((m) => (
                                        <button
                                            key={m.label}
                                            onClick={() => setMood(m.label)}
                                            className={`p-8 rounded-[2.5rem] border transition-all flex flex-col items-center space-y-4 group/mood relative overflow-hidden ${mood === m.label
                                                ? `${m.bg} border-indigo-500/50 scale-105 shadow-[0_0_40px_rgba(99,102,241,0.3)]`
                                                : 'bg-slate-950/40 border-white/5 opacity-40 hover:opacity-100 hover:border-white/10'
                                                }`}
                                        >
                                            <m.icon className={`w-10 h-10 ${mood === m.label ? m.color : 'text-slate-500 group-hover/mood:text-slate-300'}`} />
                                            <div className="text-center">
                                                <p className={`text-xs font-black uppercase tracking-widest ${mood === m.label ? 'text-white' : 'text-slate-500'}`}>{m.label}</p>
                                                <p className={`text-[8px] mt-1 font-bold ${mood === m.label ? 'text-indigo-400/60' : 'text-slate-700'}`}>{m.neural}</p>
                                            </div>
                                            {mood === m.label && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 animate-pulse" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="relative group">
                                    <textarea
                                        placeholder="Bitácora de pensamiento: registra tus patrones mentales hoy..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full h-48 bg-slate-950/80 border-2 border-white/5 rounded-[3rem] p-10 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/40 transition-all resize-none shadow-2xl font-medium leading-relaxed"
                                    />
                                    <div className="absolute top-10 right-10 flex gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                                        <Waves className="text-slate-800 w-6 h-6 hover:text-indigo-500 transition-colors" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!mood || saving}
                                    className="w-full py-8 bg-gradient-to-r from-indigo-600 to-slate-900 rounded-[3rem] font-black text-xl italic uppercase tracking-[0.2em] hover:shadow-[0_0_50px_rgba(99,102,241,0.4)] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-4 border border-white/5"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            <span>Sincronizar Bio-Red</span>
                                            <ChevronRight />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {showReward && (
                        <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8 z-20 animate-in zoom-in duration-500">
                            <div className="p-10 bg-indigo-500/10 rounded-full mb-8 relative">
                                <Trophy className="text-indigo-400 w-32 h-32 animate-bounce" />
                                <Sparkles className="absolute top-0 right-0 text-cyan-400 w-10 h-10 animate-pulse" />
                            </div>
                            <h3 className="text-6xl font-black text-white mb-4 italic tracking-tighter uppercase">Focus <span className="text-indigo-400">Locked</span></h3>
                            <p className="text-slate-500 text-sm uppercase font-black tracking-[0.4em] mb-12">Cuantización Neuronal Exitosa</p>

                            <div className="bg-slate-900 px-12 py-6 rounded-full border border-indigo-500/30 flex items-center space-x-4 text-indigo-400 font-black text-3xl shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                                <Cpu className="w-10 h-10" />
                                <span>+{rewardData?.points || 75} BIO-PULSE</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Neuro Metrics */}
                <div className="space-y-8">
                    <div className="bg-glass p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Neuro-Analytica</h3>
                            <Activity className="text-indigo-500 w-5 h-5 animate-pulse" />
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enfoque Cognitivo</span>
                                    <span className="text-indigo-400 font-black italic text-lg">88%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 w-[88%] ai-glow" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estabilidad Límbica</span>
                                    <span className="text-cyan-400 font-black italic text-lg">74%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 w-[74%] ai-glow" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-slate-950/60 border border-white/5 rounded-3xl">
                            <div className="flex items-start gap-4">
                                <Sparkles className="text-yellow-500 w-5 h-5 shrink-0" />
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                                    "Tu capacidad de enfoque profundo ha aumentado un 12% tras priorizar los baños de sol matutinos."
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-glass p-10 rounded-[3.5rem] border border-white/5">
                        <h3 className="text-lg font-black text-white mb-10 flex items-center justify-between uppercase tracking-tighter italic">
                            <span>Balance Semanal</span>
                            <TrendingUp className="text-emerald-500 w-5 h-5" />
                        </h3>
                        <div className="flex items-end justify-between w-full h-36 px-2 gap-3">
                            {[40, 65, 50, 85, 75, 95, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-900/40 rounded-t-2xl relative group h-full">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 via-indigo-500 to-cyan-400 rounded-t-2xl transition-all duration-1000 group-hover:brightness-125"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-black text-white italic">
                                            {h}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between w-full mt-6 px-2 text-[10px] font-black text-slate-600">
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <span key={d}>{d}</span>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* History Grid */}
            <div className="bg-glass p-16 rounded-[5rem] border border-white/5">
                <div className="flex justify-between items-center mb-16">
                    <div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter italic">Mentes Maestras</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Registros de Evolución Neural</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-[2rem] border border-white/10">
                        <Calendar className="text-indigo-400 w-8 h-8" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {history.map((entry) => {
                        const mInfo = moods.find(m => m.label === entry.mood) || moods[1];
                        return (
                            <div key={entry.id} className="bg-slate-950/60 p-10 rounded-[3.5rem] border border-white/10 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <mInfo.icon className="w-40 h-40" />
                                </div>
                                <div className="flex justify-between items-start mb-10 relative z-10">
                                    <div className={`p-5 rounded-2xl ${mInfo.bg} border border-white/5 shadow-2xl`}>
                                        <mInfo.icon className={`w-8 h-8 ${mInfo.color}`} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-full border border-white/5">
                                        {new Date(entry.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <h4 className="text-white font-black text-2xl mb-4 italic uppercase tracking-tight">{entry.mood}</h4>
                                <div className="p-6 bg-slate-900/40 rounded-3xl border border-white/5">
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic line-clamp-4">
                                        "{entry.note || 'No hay reflexiones adicionales para este ciclo.'}"
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const ChevronRight = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

export default MindCenter;
