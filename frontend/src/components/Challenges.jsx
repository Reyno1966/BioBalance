import React, { useState, useEffect } from 'react';
import { Trophy, Target, Star, Flame, Zap, Heart, Utensils, Loader2, ChevronRight } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const Challenges = ({ user }) => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/exercise/challenges/${user.uid}`);
                setChallenges(response.data);
            } catch (err) {
                console.error("Error fetching challenges:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, [user]);

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Heart': return <Heart className="w-6 h-6 text-red-400" />;
            case 'Utensils': return <Utensils className="w-6 h-6 text-cyan-400" />;
            case 'Zap': return <Zap className="w-6 h-6 text-yellow-400" />;
            default: return <Target className="w-6 h-6 text-slate-400" />;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-glass p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Trophy className="w-32 h-32 text-yellow-500 rotate-12" />
                </div>

                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-black text-white mb-2">Desafíos Semanales</h2>
                    <p className="text-slate-400">Completa objetivos específicos para ganar grandes recompensas.</p>
                </div>

                <div className="space-y-6">
                    {challenges.map((challenge) => {
                        const progress = (challenge.current / challenge.goal) * 100;
                        return (
                            <div key={challenge.id} className="bg-slate-950/40 p-8 rounded-[2rem] border border-white/5 group hover:border-cyan-500/30 transition-all cursor-pointer">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-6">
                                        <div className="p-4 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">
                                            {getIcon(challenge.icon)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                                            <p className="text-sm text-slate-500">{challenge.desc}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end min-w-[150px]">
                                        <div className="flex items-center space-x-2 text-yellow-400 font-black mb-2">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>+{challenge.prize} PTS</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                                            Progreso: {challenge.current} / {challenge.goal}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-glass p-8 rounded-[2rem] border border-white/5 flex items-center space-x-6">
                    <div className="p-4 bg-orange-500/20 rounded-2xl">
                        <Flame className="w-8 h-8 text-orange-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">Temporada Actual</h4>
                        <p className="text-sm text-slate-500">Quedan 4 días para el cierre.</p>
                    </div>
                    <ChevronRight className="ml-auto text-slate-700" />
                </div>

                <div className="bg-glass p-8 rounded-[2rem] border border-white/5 flex items-center space-x-6">
                    <div className="p-4 bg-purple-500/20 rounded-2xl">
                        <Trophy className="w-8 h-8 text-purple-500" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white">Salón de la Fama</h4>
                        <p className="text-sm text-slate-500">Explora los líderes de BioBalance.</p>
                    </div>
                    <ChevronRight className="ml-auto text-slate-700" />
                </div>
            </div>
        </div>
    );
};

export default Challenges;
