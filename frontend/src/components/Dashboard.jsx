import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area, ComposedChart, Bar
} from 'recharts';
import { Activity, Utensils, Zap, Scale, Loader2, Trophy, Star, Heart, Flame, ShieldAlert, TrendingUp, Calendar, Check, Droplets, Share2, X, Eye, EyeOff, Brain, Sparkles } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';
import HealthAvatar from './HealthAvatar';
import { useTranslation } from 'react-i18next';

const Dashboard = ({ user, userData, isPremium }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(true);
    const [nutritionData, setNutritionData] = React.useState(null);
    const [weightHistory, setWeightHistory] = React.useState([]);
    const [profile, setProfile] = React.useState(null);
    const [insights, setInsights] = React.useState([]);
    const [showReport, setShowReport] = React.useState(false);
    const [isHologram, setIsHologram] = React.useState(false);
    const [activeChallenge, setActiveChallenge] = React.useState(null);
    const [aiReport, setAiReport] = React.useState(null);
    const [loadingReport, setLoadingReport] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = user?.uid || '00000000-0000-0000-0000-000000000000';
                const [nutritionRes, weightRes, profileRes, insightsRes, challengeRes] = await Promise.all([
                    axios.get(`${API_URL}/api/nutrition/summary/${userId}`),
                    axios.get(`${API_URL}/api/weight/history/${userId}`),
                    axios.get(`${API_URL}/api/user/profile/${userId}`),
                    axios.get(`${API_URL}/api/nutrition/insights/${userId}`),
                    axios.get(`${API_URL}/api/challenge/active`)
                ]);
                setNutritionData(nutritionRes.data);
                setWeightHistory(weightRes.data.length > 0 ? weightRes.data : [{ date: 'Hoy', weight: 89.8 }]);
                setProfile(profileRes.data);
                setInsights(insightsRes.data);
                setActiveChallenge(challengeRes.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const BadgeIcon = ({ name, className }) => {
        switch (name) {
            case 'Star': return <Star className={className} />;
            case 'Heart': return <Heart className={className} />;
            case 'Zap': return <Zap className={className} />;
            case 'Trophy': return <Trophy className={className} />;
            case 'Moon': return <Heart className={className} />; // Fallback
            default: return <Trophy className={className} />;
        }
    };

    const macroData = [
        { name: 'Proteínas', value: parseInt(nutritionData?.total_protein || 0), color: '#22d3ee' },
        { name: 'Carbohidratos', value: parseInt(nutritionData?.total_carbs || 0), color: '#3b82f6' },
        { name: 'Grasas', value: parseInt(nutritionData?.total_fat || 0), color: '#818cf8' },
    ];

    const handleCompleteChallenge = async () => {
        if (!activeChallenge) return;
        try {
            const userId = user?.uid;
            await axios.post(`${API_URL}/api/challenge/complete`, { userId, challengeId: activeChallenge.id });
            const profileRes = await axios.get(`${API_URL}/api/user/profile/${userId}`);
            setProfile(profileRes.data);
            setActiveChallenge(null);
        } catch (err) {
            console.error("Error completing challenge:", err);
        }
    };

    const handleOpenReport = async () => {
        setShowReport(true);
        setLoadingReport(true);
        try {
            const userId = user?.uid;
            const res = await axios.post(`${API_URL}/api/ai/report`, { userId });
            setAiReport(res.data);
        } catch (err) {
            console.error("Error fetching report:", err);
        } finally {
            setLoadingReport(false);
        }
    };

    const displayMacroData = macroData.some(m => m.value > 0) ? macroData : [{ name: 'Sin datos', value: 1, color: '#1e293b' }];

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            <p className="text-slate-400 font-medium animate-pulse">Sincronizando tu BioBalance...</p>
        </div>
    );

    return (
        <div className={`space-y-8 max-w-6xl mx-auto transition-all duration-1000 relative ${isHologram ? 'perspective-2000' : ''}`}>
            {/* Hologram Overlay components */}
            {isHologram && (
                <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[200%] animate-scanline" />
                    <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                </div>
            )}

            <div className="flex justify-between items-center px-4">
                <button
                    onClick={() => setIsHologram(!isHologram)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all ${isHologram
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                        : 'bg-glass border-white/5 text-slate-500 hover:text-white'
                        }`}
                >
                    {isHologram ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{t('dashboard.hologram_view')}</span>
                </button>

                {/* Flash Challenge Notification */}
                {activeChallenge && (
                    <div
                        onClick={handleCompleteChallenge}
                        className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/30 px-6 py-3 rounded-2xl animate-pulse cursor-pointer hover:bg-amber-500/20 transition-all group"
                    >
                        <Zap className="w-5 h-5 text-amber-500 group-hover:scale-125 transition-transform" />
                        <div>
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{activeChallenge.title}</p>
                            <p className="text-xs text-amber-200 font-bold">{activeChallenge.description} <span className="text-amber-500">+{activeChallenge.points} PTS</span></p>
                        </div>
                    </div>
                )}
            </div>

            {/* Header / Profile Summary */}
            <div className={`bg-glass p-6 md:p-10 pt-12 md:pt-16 rounded-[2rem] md:rounded-[3rem] border border-white/5 relative transition-all duration-700 ${isHologram ? 'holographic-card hologram-float' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

                <div className="flex flex-col xl:flex-row justify-between items-center space-y-8 xl:space-y-0 relative z-10">
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10">
                        <HealthAvatar
                            stats={{
                                mood: profile?.recentMood === 'Increíble' ? 95 : 70,
                                hydration: 85, energy: 80, sleep: 75
                            }}
                            streak={profile?.streak || 5}
                        />
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">{t('common.welcome', { name: profile?.full_name?.split(' ')[0] || 'Usuario' })}</h2>
                            <p className="text-slate-400 mt-2 text-xs md:text-base italic">"{profile?.recentMood === 'Estresado' ? 'Toma un respiro, estás progresando.' : 'Cada hábito cuenta.'}"</p>
                            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                {profile?.badges?.slice(0, 3).map(b => (
                                    <div key={b.name} className="p-2 bg-slate-900 rounded-xl border border-white/5">
                                        <BadgeIcon name={b.icon} className={`w-4 h-4 ${b.color}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center xl:items-end w-full md:w-auto">
                        <span className="text-[9px] md:text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-1">{profile?.rank || 'Novato'}</span>
                        <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-2xl md:text-3xl font-black text-white text-glow truncate">{t('dashboard.level')} {profile?.level || 1}</h4>
                            {(isPremium || profile?.is_premium) && (
                                <span className="bg-gradient-to-r from-amber-400 to-orange-600 text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.3)] shrink-0">
                                    PREMIUM
                                </span>
                            )}
                        </div>
                        <div className="w-full md:w-48 h-1.5 md:h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 w-[60%]" />
                        </div>
                        <p className="text-[9px] md:text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">{profile?.points || 0} {t('dashboard.total_points')}</p>
                        <button type="button" onClick={handleOpenReport} className="mt-6 w-full md:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 md:py-2 rounded-xl md:rounded-full shadow-lg shadow-indigo-500/20 transition-all group">
                            <Share2 className="w-4 h-4 text-white" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">{t('dashboard.generate_report')}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Nutritional Intelligence Section */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ${isHologram ? 'holographic-card' : ''}`}>
                {/* Macro Breakdown Chart */}
                <div className="lg:col-span-1 bg-glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Utensils className="w-24 h-24 text-cyan-500" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                        <Scale className="text-cyan-400 w-5 h-5" /> {t('dashboard.bio_macros')}
                    </h3>

                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={displayMacroData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {displayMacroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('dashboard.balance')}</span>
                            <span className="text-2xl font-black text-white italic">{Math.round(((nutritionData?.total_protein || 0) + (nutritionData?.total_carbs || 0) + (nutritionData?.total_fat || 0)))}g</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-6">
                        {macroData.map(macro => (
                            <div key={macro.name} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: macro.color }} />
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">{macro.name}</span>
                                </div>
                                <span className="text-white font-black italic">{macro.value}g</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calorie Progress and Bio-Insights */}
                <div className="lg:col-span-2 bg-glass p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                                <Flame className="text-orange-500 w-5 h-5" /> {t('dashboard.energy_expenditure')}
                            </h3>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{t('dashboard.basal_metabolism')}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-white italic">
                                {nutritionData?.total_calories || 0}
                                <span className="text-xs text-slate-500 ml-2 uppercase not-italic">kcal</span>
                            </span>
                            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mt-1">{t('dashboard.goal')}: {nutritionData?.calorieGoal || 2200} kcal</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 transition-all duration-1000 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                style={{ width: `${Math.min(100, (nutritionData?.total_calories / (nutritionData?.calorieGoal || 2200)) * 100)}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Enfoque Bioquímico</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    {nutritionData?.total_protein > 60
                                        ? "Sustrato proteico optimizado para reconstrucción de fibras musculares."
                                        : "Niveles de aminoácidos sugieren una ventana de oportunidad proteica."}
                                </p>
                            </div>
                            <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-purple-400">
                                    <Brain className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Efecto Cognitivo</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    {nutritionData?.total_carbs < 100
                                        ? "Estado glucémico bajo: Optimización de claridad mental y autofagia."
                                        : "Sustrato de glucógeno disponible para funciones cognitivas de alta demanda."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                                    <Utensils className="w-3 h-3 text-slate-500" />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-cyan-500/20 flex items-center justify-center text-[8px] font-black text-cyan-400">
                                +{insights?.count || 0}
                            </div>
                        </div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('dashboard.logs_synced')}</p>
                    </div>
                </div>
            </div>


            {/* Biometric Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-glass p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.daily_steps')}</p>
                        <h4 className="text-2xl md:text-3xl font-black text-white">8,432</h4>
                    </div>
                    <div className="p-3 md:p-4 bg-cyan-500/10 rounded-xl md:rounded-2xl"><Activity className="w-6 h-6 md:w-8 md:h-8 text-cyan-500" /></div>
                </div>
                <div className="bg-glass p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-all">
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.heart_rate')}</p>
                        <h4 className="text-2xl md:text-3xl font-black text-white">72 <span className="text-[10px] md:text-xs text-slate-500 uppercase">{t('dashboard.bpm')}</span></h4>
                    </div>
                    <div className="p-3 md:p-4 bg-red-500/10 rounded-xl md:rounded-2xl"><Heart className="w-6 h-6 md:w-8 md:h-8 text-red-500 animate-pulse" /></div>
                </div>
                <div className="bg-glass p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all sm:col-span-2 md:col-span-1">
                    <div>
                        <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('dashboard.hydration')}</p>
                        <h4 className="text-2xl md:text-3xl font-black text-white">1.8 <span className="text-sm">L</span></h4>
                    </div>
                    <div className="p-3 md:p-4 bg-blue-500/10 rounded-xl md:rounded-2xl"><Droplets className="w-6 h-6 md:w-8 md:h-8 text-blue-500" /></div>
                </div>
            </div>

            {/* Health Report Modal */}
            {showReport && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="bg-slate-900/50 w-full max-w-2xl rounded-[2.5rem] md:rounded-[3rem] border border-white/10 p-8 md:p-12 relative overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)]">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600" />

                        {/* Interactive Background Elements */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

                        <button onClick={() => setShowReport(false)} className="absolute top-6 right-6 md:top-8 md:right-8 p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all z-20">
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="text-center mb-8 md:mb-10 relative z-10">
                            <div className="inline-block p-4 bg-cyan-500/10 rounded-3xl mb-4 border border-cyan-500/20">
                                <Trophy className="w-10 h-10 md:w-12 md:h-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight italic">
                                {aiReport?.title || "Sincronización de Éxito"}
                            </h2>
                            <p className="text-cyan-500 font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em]">Análisis Bio-Integrado IA</p>
                        </div>

                        {loadingReport ? (
                            <div className="flex flex-col items-center py-20 relative z-10">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-6 animate-pulse">Procesando Bio-Data...</p>
                            </div>
                        ) : aiReport ? (
                            <div className="space-y-6 md:space-y-8 relative z-10">
                                <div className="bg-slate-950/60 p-6 md:p-8 rounded-[2rem] border border-white/5 relative group">
                                    <div className="absolute top-4 right-4 text-cyan-500/20 group-hover:text-cyan-500/40 transition-colors">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-200 text-sm md:text-base italic leading-relaxed font-medium">"{aiReport.summary}"</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-4 bg-green-500 rounded-full" />
                                                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Fortalezas Bio</p>
                                            </div>
                                            {aiReport.strengths?.map((s, i) => (
                                                <div key={i} className="flex items-start gap-3 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="mt-1 w-1.5 h-1.5 bg-green-500/50 rounded-full shrink-0" />
                                                    {s}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-4 bg-amber-500 rounded-full" />
                                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Optimización</p>
                                            </div>
                                            {aiReport.improvements?.map((im, i) => (
                                                <div key={i} className="flex items-start gap-3 text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="mt-1 w-1.5 h-1.5 bg-amber-500/50 rounded-full shrink-0" />
                                                    {im}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-500/10 p-6 md:p-8 rounded-[2rem] border border-indigo-500/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Zap className="w-24 h-24 text-indigo-400" />
                                    </div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Próximos Pasos (Hoja de Ruta)</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {aiReport.nextSteps?.map((step, i) => (
                                            <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-white font-bold italic">
                                                <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                                                    <Check className="w-3 h-3 md:w-4 md:h-4 text-indigo-400" />
                                                </div>
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center pt-2">
                                    <div className="bg-slate-950/40 p-4 rounded-2xl border border-white/5 mb-6">
                                        <p className="text-slate-500 text-[10px] md:text-xs italic font-medium leading-relaxed">"{aiReport.quote}"</p>
                                    </div>
                                    <button
                                        className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-700 text-slate-950 rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-[0.3em] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                        onClick={() => {
                                            const text = `BioBalance Success: ${aiReport.title}\n${aiReport.quote}`;
                                            if (navigator.share) {
                                                navigator.share({ title: 'Mi Reporte BioBalance', text: text, url: window.location.href });
                                            } else {
                                                alert("Reporte copiado al portapapeles: " + text);
                                            }
                                        }}
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Sincronizar Logros
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-slate-500">Error en la red neuronal. Inténtalo de nuevo.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-glass p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><TrendingUp className="text-cyan-400" /> Correlación Semanal</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={insights}>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="actual" fill="#06b6d4" opacity={0.3} radius={[10, 10, 0, 0]} name="Esta Semana" />
                                <Line type="monotone" dataKey="shadow" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Semana Pasada" />
                                <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={4} dot={{ fill: '#06b6d4', r: 4 }} name="Tendencia Real" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-glass p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3"><Scale className="text-purple-400" /> Evolución de Peso</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightHistory}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                                <Area type="monotone" dataKey="weight" stroke="#a855f7" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
