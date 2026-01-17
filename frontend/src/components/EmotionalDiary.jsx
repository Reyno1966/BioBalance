import React, { useState, useEffect } from 'react';
import {
    Heart, Smile, Frown, Meh, Star, Trophy, MessageCircle,
    Calendar, TrendingUp, Sparkles, Brain, Zap, Shield, Target, Loader2
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';
import { useAuth } from '../context/AuthContext';
import confetti from '../utils/confetti';

const EmotionalDiary = ({ user }) => {
    // const { user } = useAuth();
    const [mood, setMood] = useState(null);
    const [note, setNote] = useState('');
    const [showReward, setShowReward] = useState(false);
    const [rewardData, setRewardData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const moods = [
        { label: 'Invencible', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10', glow: 'shadow-yellow-500/20', val: 5 },
        { label: 'Bien', icon: Smile, color: 'text-cyan-400', bg: 'bg-cyan-400/10', glow: 'shadow-cyan-500/20', val: 4 },
        { label: 'Neutral', icon: Meh, color: 'text-slate-400', bg: 'bg-slate-400/10', glow: 'shadow-slate-500/20', val: 3 },
        { label: 'Bajo', icon: Frown, color: 'text-indigo-400', bg: 'bg-indigo-400/10', glow: 'shadow-indigo-500/20', val: 2 },
        { label: 'Estresado', icon: Brain, color: 'text-rose-400', bg: 'bg-rose-400/10', glow: 'shadow-rose-500/20', val: 1 },
    ];

    const demoHistory = [
        { id: 1, mood: 'Bien', note: 'Buen entrenamiento matutino, me siento lleno de energía.', recorded_at: new Date(Date.now() - 86400000).toISOString() },
        { id: 2, mood: 'Invencible', note: 'Dormí 8 horas y el enfoque neuro-cognitivo está al máximo.', recorded_at: new Date(Date.now() - 172800000).toISOString() },
        { id: 3, mood: 'Estresado', note: 'Demasiadas reuniones, pero el yoga restaurativo ayudó.', recorded_at: new Date(Date.now() - 259200000).toISOString() },
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
            console.error("Error fetching emotional history:", err);
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
            console.error("Error saving mood:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-indigo-500 w-16 h-16" />
            <p className="text-indigo-500/60 font-black uppercase tracking-widest text-[10px]">Analizando Ondas Alfa...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Entry Form */}
                <div className="lg:col-span-2 bg-glass p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <Brain className="w-64 h-64 text-indigo-400" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-4 mb-12">
                            <div className="p-4 bg-indigo-500/20 rounded-[1.5rem] ai-glow">
                                <Heart className="text-indigo-400 w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white">Bio-Diario Emocional</h2>
                                <p className="text-slate-400">Sincroniza tu estado mental con tu biología.</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">Estado de Red Neuronal</p>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                    {moods.map((m) => (
                                        <button
                                            key={m.label}
                                            onClick={() => setMood(m.label)}
                                            className={`p-6 rounded-3xl border transition-all flex flex-col items-center space-y-3 group/mood relative overflow-hidden ${mood === m.label
                                                ? `${m.bg} border-${m.color.split('-')[1]}-500/50 scale-105 shadow-[0_0_30px_rgba(99,102,241,0.2)]`
                                                : 'bg-slate-950/40 border-white/5 opacity-50 hover:opacity-100'
                                                }`}
                                        >
                                            <m.icon className={`w-8 h-8 ${mood === m.label ? m.color : 'text-slate-500 group-hover/mood:text-slate-300'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${mood === m.label ? 'text-white' : 'text-slate-500'}`}>{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <textarea
                                        placeholder="Bitácora de pensamiento (Opcional)..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full h-40 bg-slate-950/40 border border-white/10 rounded-[2.5rem] p-8 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500/30 transition-all resize-none shadow-inner"
                                    />
                                    <MessageCircle className="absolute top-8 right-8 text-slate-800 w-6 h-6" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!mood || saving}
                                    className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[2.5rem] font-black text-lg hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-3"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <span>Sincronizar Mente</span>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {showReward && (
                        <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center text-center p-8 z-20 animate-in zoom-in duration-500">
                            <div className="p-8 bg-indigo-500/10 rounded-full mb-6 relative">
                                <Trophy className="text-indigo-400 w-24 h-24 animate-bounce" />
                                <Sparkles className="absolute top-0 right-0 text-cyan-400 w-8 h-8 animate-pulse" />
                            </div>
                            <h3 className="text-5xl font-black text-white mb-4 italic">¡Focus Logged!</h3>
                            <p className="text-slate-400 text-lg uppercase font-bold tracking-[0.2em] mb-12">Bio-Feedback Positivo Detectado</p>

                            <div className="flex flex-col items-center space-y-4">
                                <div className="bg-slate-900 px-10 py-5 rounded-full border border-indigo-500/30 flex items-center space-x-3 text-indigo-400 font-black text-2xl shadow-2xl">
                                    <Star className="w-8 h-8 fill-current" />
                                    <span>+{rewardData?.points || 50} BIO-PTS</span>
                                </div>
                                {rewardData?.earned && (
                                    <div className="px-6 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 text-purple-400 text-xs font-black uppercase tracking-widest animate-pulse">
                                        Logro: {rewardData.badge}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Brain Status / Stats Sidebar */}
                <div className="space-y-8">
                    <div className="bg-glass p-10 rounded-[3rem] border border-white/5 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse" />

                        <div className="p-6 bg-slate-900/50 rounded-full inline-block mb-6 border border-indigo-500/10 group-hover:bg-indigo-500/20 transition-all duration-700">
                            <Brain className="text-indigo-400 w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4">Estado Neuro</h3>
                        <div className="space-y-4 text-left">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Enfoque</span>
                                <span className="text-indigo-400 font-black">88%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full w-[88%] ai-glow" />
                            </div>

                            <div className="flex justify-between items-center text-xs pt-4">
                                <span className="text-slate-500 font-bold uppercase tracking-widest">Calma Basal</span>
                                <span className="text-cyan-400 font-black">74%</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full rounded-full w-[74%] ai-glow" />
                            </div>
                        </div>

                        <div className="mt-10 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                            <p className="text-[10px] text-indigo-300 font-bold italic leading-relaxed">
                                "Tus picos de cortisol disminuyen un 20% los días que registras gratitud."
                            </p>
                        </div>
                    </div>

                    <div className="bg-glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
                        <h3 className="text-lg font-black text-white mb-6 w-full flex items-center justify-between">
                            <span>Balance Semanal</span>
                            <TrendingUp className="text-emerald-400 w-5 h-5" />
                        </h3>
                        <div className="flex items-end justify-between w-full h-32 px-4 gap-4">
                            {[40, 60, 50, 85, 70, 90, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-900/60 rounded-t-xl relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl transition-all duration-1000 group-hover:brightness-125"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black text-white">
                                            {h}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between w-full mt-4 px-1">
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                                <span key={d} className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{d}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="bg-glass p-12 rounded-[3.5rem] border border-white/5">
                <div className="flex justify-between items-center mb-12">
                    <h3 className="text-2xl font-black flex items-center gap-3 text-white">
                        <Calendar className="text-indigo-400" /> Bio-Historial de Ánimo
                    </h3>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl">
                        Últimas Reflexiones
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((entry) => {
                        const mInfo = moods.find(m => m.label === entry.mood) || moods[1];
                        return (
                            <div key={entry.id} className="bg-slate-950/60 p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/20 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <mInfo.icon className="w-20 h-20" />
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl ${mInfo.bg}`}>
                                        <mInfo.icon className={`w-6 h-6 ${mInfo.color}`} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                        {new Date(entry.recorded_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <h4 className="text-white font-black text-xl mb-3">{entry.mood}</h4>
                                <p className="text-sm text-slate-400 italic leading-relaxed line-clamp-3">"{entry.note || 'Sin nota registrada para esta entrada.'}"</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EmotionalDiary;

