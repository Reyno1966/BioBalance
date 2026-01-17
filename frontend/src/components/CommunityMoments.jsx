import React, { useState, useEffect } from 'react';
import { Users, Utensils, Trophy, Globe, Moon, Sparkles, MessageCircle, Heart, Activity } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const CommunityMoments = () => {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getIcon = (type) => {
        switch (type) {
            case 'nutrition': return <Utensils className="w-4 h-4 text-cyan-400" />;
            case 'level': return <Trophy className="w-4 h-4 text-yellow-400" />;
            case 'global': return <Globe className="w-4 h-4 text-blue-400" />;
            case 'sleep': return <Moon className="w-4 h-4 text-indigo-400" />;
            default: return <Sparkles className="w-4 h-4 text-purple-400" />;
        }
    };

    useEffect(() => {
        const fetchMoments = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/user/community/moments`);
                setMoments(response.data);
            } catch (err) {
                console.error("Error fetching moments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMoments();
    }, []);

    return (
        <div className="bg-slate-950/60 p-10 rounded-[3.5rem] border border-white/5 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                        <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Feed</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global_Sync</span>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {moments.map((moment, i) => (
                    <div
                        key={moment.id}
                        className="flex items-start space-x-6 p-6 bg-slate-900/40 rounded-3xl border border-white/5 transition-all hover:bg-slate-900 hover:border-cyan-500/20 group/item"
                    >
                        <div className="p-4 bg-slate-950 rounded-[1.2rem] border border-white/10 group-hover/item:border-cyan-500/30 transition-all shadow-inner">
                            {getIcon(moment.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium text-slate-400 leading-tight">
                                <span className="text-white font-black italic uppercase tracking-tight">{moment.user}</span>
                                <span className="ml-2">{moment.action}</span>
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">{moment.time}</span>
                                <div className="h-px w-8 bg-slate-800" />
                                <span className="text-[8px] text-cyan-500/40 font-black uppercase">Verified_Node</span>
                            </div>
                        </div>
                        <button className="p-3 hover:bg-red-500/10 rounded-xl transition-all group/heart active:scale-95">
                            <Heart className="w-4 h-4 text-slate-700 group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-all" />
                        </button>
                    </div>
                ))}
            </div>

            <button className="w-full py-5 bg-slate-900/50 hover:bg-cyan-600 hover:text-slate-950 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] rounded-[1.8rem] border border-white/5 transition-all flex items-center justify-center gap-3 group/btn">
                <span>Ampliar Conexión</span>
                <Users className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
            </button>
        </div>
    );
};

export default CommunityMoments;
