import React, { useState, useEffect } from 'react';
import {
    Trophy, Medal, Users, Crown, ArrowUp, Loader2, Globe,
    TrendingUp, Zap, Star, ShieldAlert, Sparkles, Activity,
    Target, Flame, ChevronRight, ShieldCheck, Award
} from 'lucide-react';
import CommunityMoments from './CommunityMoments';
import axios from 'axios';
import API_URL from '../config';

const CommunityRanking = ({ currentUser }) => {
    const [ranking, setRanking] = useState([]);
    const [teamRanking, setTeamRanking] = useState([]);
    const [view, setView] = useState('individual');
    const [globalGoal, setGlobalGoal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rankingRes, globalRes, teamsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/user/ranking`),
                    axios.get(`${API_URL}/api/user/ranking/global`),
                    axios.get(`${API_URL}/api/user/ranking/teams`)
                ]);
                setRanking(rankingRes.data);
                setGlobalGoal(globalRes.data);
                setTeamRanking(teamsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-cyan-500/10 rounded-full" />
                    <div className="absolute inset-0 w-24 h-24 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" />
                    <Activity className="absolute inset-0 m-auto w-10 h-10 text-cyan-500 animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-cyan-500 font-black uppercase tracking-[0.5em] text-[10px]">Sincronizando Jerarquía Global</p>
                    <p className="text-slate-600 text-[8px] uppercase mt-2 font-bold tracking-widest">Protocolo de competición activo</p>
                </div>
            </div>
        );
    }

    const getPodiumStyle = (index) => {
        if (index === 0) return {
            bg: 'bg-gradient-to-br from-yellow-400/20 via-amber-600/10 to-transparent',
            border: 'border-yellow-500/40',
            glow: 'shadow-[0_0_50px_rgba(234,179,8,0.15)]',
            iconColor: 'text-yellow-400',
            label: 'BIO-LORD'
        };
        if (index === 1) return {
            bg: 'bg-gradient-to-br from-slate-300/20 via-slate-500/10 to-transparent',
            border: 'border-slate-400/40',
            glow: 'shadow-[0_0_50px_rgba(148,163,184,0.15)]',
            iconColor: 'text-slate-300',
            label: 'BIO-MASTER'
        };
        if (index === 2) return {
            bg: 'bg-gradient-to-br from-orange-400/20 via-orange-700/10 to-transparent',
            border: 'border-orange-500/40',
            glow: 'shadow-[0_0_50px_rgba(249,115,22,0.15)]',
            iconColor: 'text-orange-400',
            label: 'BIO-ELITE'
        };
        return {
            bg: 'bg-slate-950/60',
            border: 'border-white/5',
            glow: '',
            iconColor: 'text-slate-500',
            label: 'BIO-WARRIOR'
        };
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-1000 px-6 pb-32">
            {/* Cinematic Global Mission Status */}
            {globalGoal && (
                <div className="relative bg-slate-950 rounded-[5rem] border-2 border-cyan-500/20 overflow-hidden group p-12 lg:p-20 shadow-[0_0_80px_rgba(6,182,212,0.1)]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
                    <div className="absolute top-0 right-0 p-20 opacity-5 -translate-x-1/4 translate-y-[-10%] group-hover:rotate-6 transition-transform duration-[4000ms]">
                        <Globe className="w-[500px] h-[500px] text-cyan-400" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10">
                            <div className="flex items-center gap-6">
                                <div className="p-6 bg-cyan-500 rounded-[2.5rem] shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                    <Globe className="w-12 h-12 text-slate-950" />
                                </div>
                                <div>
                                    <p className="text-cyan-500 text-xs font-black uppercase tracking-[0.5em] mb-2">Misión Planetaria</p>
                                    <h3 className="text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">{globalGoal.label}</h3>
                                </div>
                            </div>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                                {globalGoal.description}
                                <span className="block mt-4 text-cyan-500/60 font-mono text-xs italic tracking-widest">Protocolo de sincronía colectiva activo // Nivel Global_Restablecido</span>
                            </p>
                        </div>

                        <div className="space-y-10">
                            <div className="bg-slate-900/60 backdrop-blur-2xl p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group/box">
                                <div className="absolute inset-0 bg-cyan-500/[0.02] opacity-0 group-hover/box:opacity-100 transition-opacity" />
                                <div className="flex justify-between items-end mb-8 relative z-10">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estado de Avance</p>
                                        <span className="text-6xl font-black text-white italic tracking-tighter">
                                            {Math.round((globalGoal.totalPoints / globalGoal.goal) * 100)}%
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Bio-Puntos Colectivos</p>
                                        <div className="flex items-center gap-3">
                                            <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                                            <span className="text-3xl font-black text-cyan-400 italic leading-none">{globalGoal.totalPoints.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-8 bg-slate-950 rounded-full border border-white/10 p-2 overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 rounded-full transition-all duration-[2000ms] shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                                        style={{ width: `${Math.min(100, (globalGoal.totalPoints / globalGoal.goal) * 100)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:50px_50px] animate-shimmer" />
                                    </div>
                                </div>
                                <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest mt-4 px-2">
                                    <span>Sincro Inicial</span>
                                    <span>Meta: {globalGoal.goal.toLocaleString()} Bio-Units</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Rankings Main Board / Elite League */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="bg-glass p-12 rounded-[5rem] border border-white/5 relative overflow-hidden min-h-[800px]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-10">
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-yellow-500/10 rounded-[2.5rem] border border-yellow-500/30 ai-glow">
                                    <Trophy className="text-yellow-400 w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-yellow-500/60 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Elite League</p>
                                    <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Global <span className="text-cyan-500">Hierarchy</span></h2>
                                </div>
                            </div>

                            <div className="bg-slate-950/80 p-2 rounded-3xl border border-white/10 flex items-center shadow-2xl">
                                {[
                                    { id: 'individual', label: 'CAMPEONES', icon: Users },
                                    { id: 'teams', label: 'DOJOS', icon: Zap }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setView(tab.id)}
                                        className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${view === tab.id
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-105'
                                            : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {(view === 'individual' ? ranking : teamRanking).map((item, index) => {
                                const style = getPodiumStyle(index);
                                const itemName = view === 'individual' ? item.full_name : item.name;
                                const isCurrentUser = view === 'individual' && (
                                    item.full_name === currentUser.displayName ||
                                    item.full_name === currentUser.email ||
                                    (currentUser.uid === 'guest-123' && index === 4)
                                );

                                return (
                                    <div
                                        key={index}
                                        className={`group relative flex items-center justify-between p-8 rounded-[3.5rem] transition-all duration-700 border-2 overflow-hidden ${isCurrentUser
                                            ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]'
                                            : `${style.bg} ${style.border} ${style.glow} hover:scale-[1.02] transform transition-transform`
                                            }`}
                                    >
                                        {/* Row Decoration */}
                                        <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex items-center space-x-8 relative z-10">
                                            {/* Rank Hexagon-style Display */}
                                            <div className="relative">
                                                <div className={`w-16 h-16 flex items-center justify-center font-black text-2xl italic tracking-tighter ${style.iconColor}`}>
                                                    {index === 0 ? <Crown className="w-10 h-10 animate-bounce" /> : index + 1}
                                                </div>
                                                <svg className="absolute inset-0 w-16 h-16 opacity-20 group-hover:rotate-90 transition-transform duration-1000">
                                                    <circle cx="32" cy="32" r="30" stroke="currentColor" fill="transparent" strokeWidth="2" strokeDasharray="10 5" className={style.iconColor} />
                                                </svg>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <div className={`w-16 h-16 rounded-[2rem] border-2 flex items-center justify-center text-2xl font-black shadow-xl group-hover:rotate-6 transition-transform ${isCurrentUser ? 'border-cyan-500 bg-cyan-600 text-slate-950' : 'border-white/10 bg-slate-900 text-slate-500'
                                                    }`}>
                                                    {itemName.charAt(0)}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <p className={`font-black text-2xl italic uppercase tracking-tighter leading-none ${isCurrentUser ? 'text-white' : 'text-slate-100'}`}>
                                                            {isCurrentUser && currentUser.uid === 'guest-123' ? 'TÚ (ELITE)' : itemName}
                                                        </p>
                                                        {index < 3 && (
                                                            <div className={`px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest ${style.iconColor}`}>
                                                                {style.label}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex gap-1 h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                                                            <div className={`h-full bg-gradient-to-r from-blue-500 to-cyan-400`} style={{ width: `${Math.random() * 60 + 40}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Sincro: 94%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex items-center gap-8 relative z-10">
                                            <div className="hidden md:block">
                                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Impacto Global</p>
                                                <div className="flex justify-end gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div key={i} className={`w-1.5 h-1.5 rounded-sm ${index < 3 ? 'bg-yellow-500' : 'bg-slate-700'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className={`text-4xl font-black leading-none italic ${index < 3 ? 'text-white' : 'text-slate-400'}`}>
                                                    {item.points.toLocaleString()}
                                                </p>
                                                <p className="text-[10px] text-cyan-500/60 font-black uppercase tracking-widest mt-1">Bio-Pulse</p>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-slate-800 group-hover:text-cyan-500 transition-colors" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="lg:col-span-4 flex flex-col gap-12">
                    <CommunityMoments />

                    {/* Elite Status Card */}
                    <div className="bg-slate-950 p-12 rounded-[4.5rem] border-2 border-indigo-500/20 relative overflow-hidden group shadow-[0_0_50px_rgba(99,102,241,0.1)]">
                        <div className="absolute inset-0 bg-indigo-600/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/3 -translate-y-1/3 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                            <Star className="w-56 h-56 text-indigo-400" />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30">
                                    <Award className="w-8 h-8 text-indigo-400" />
                                </div>
                                <span className="bg-indigo-500 text-slate-950 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl">Elite Challenge</span>
                            </div>

                            <h3 className="text-4xl font-black text-white italic leading-none uppercase tracking-tighter">
                                Hyper-Sync <br /> Weekend
                            </h3>

                            <div className="p-6 bg-slate-900/60 border border-white/5 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
                                    <span>RECOMPENSA X2</span>
                                    <span>TIEMPO: 48H</span>
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                                    "Logra una coherencia cardiaca del 95% durante 3 sesiones para desbloquear la insignia 'Master Chronicler'."
                                </p>
                            </div>

                            <button className="w-full py-6 bg-white hover:bg-cyan-400 text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all transform hover:scale-105 active:scale-95 shadow-2xl">
                                INICIAR MISIÓN
                            </button>
                        </div>
                    </div>

                    {/* Activity Feed Mini Decorative Element */}
                    <div className="bg-glass p-10 rounded-[4rem] border border-white/5 flex flex-col items-center gap-6">
                        <div className="flex gap-2 h-8 items-end">
                            {[20, 45, 30, 80, 55, 90, 40].map((h, i) => (
                                <div key={i} className="w-1.5 bg-cyan-500/20 rounded-t-full relative" style={{ height: `${h}%` }}>
                                    <div className="absolute inset-0 bg-cyan-500 rounded-t-full animate-pulse" style={{ height: '30%', bottom: 0, animationDelay: `${i * 0.1}s` }} />
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Live_Global_Metric</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityRanking;
