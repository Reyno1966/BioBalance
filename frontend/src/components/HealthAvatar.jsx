import React from 'react';
import {
    User, Heart, Droplets, Zap, Moon, Crown,
    Sparkles, Shield, Activity, Activity as Pulse,
    Search, Radar, Trophy
} from 'lucide-react';
import bioAvatar from '../assets/bio-avatar.png';

const HealthAvatar = ({ stats = {}, streak = 0 }) => {
    // stats: { mood, hydration, energy, sleep } - all 1-100
    const { mood = 70, hydration = 60, energy = 80, sleep = 75 } = stats;
    const isGold = streak >= 3;

    return (
        <div className={`relative group perspective-2000 transition-all duration-1000 ${isGold ? 'scale-110' : 'hover:scale-105'}`}>
            {/* Hologram Base / Platform */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-10 bg-cyan-500/10 rounded-[100%] blur-xl opacity-50 border-t border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-cyan-600/20 rounded-[100%] blur-md animate-pulse" />

            {/* Main Container */}
            <div className={`w-64 h-80 relative flex items-center justify-center animate-in zoom-in duration-[1500ms]`}>
                {/* Background Aura */}
                <div className={`absolute inset-0 rounded-full blur-[70px] opacity-20 transition-all duration-1000 ${isGold ? 'bg-yellow-500' : 'bg-cyan-500'
                    }`} />

                {/* Scanning Line Animation */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.8)] z-20 animate-bio-scan opacity-0 group-hover:opacity-100 pointer-events-none" />

                {/* Status Badges */}
                {isGold && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 animate-bounce">
                        <div className="relative">
                            <Trophy className="w-16 h-16 text-yellow-500 fill-current drop-shadow-[0_0_25px_rgba(234,179,8,1)]" />
                            <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-white animate-pulse" />
                        </div>
                    </div>
                )}

                {/* The Athletic Duo Image */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-3xl">
                    <img
                        src={bioAvatar}
                        alt="Bio-Scanner Duo"
                        className={`w-full h-full object-contain mix-blend-screen transition-all duration-1000 ${isGold ? 'sepia-[0.5] hue-rotate-[40deg] brightness-125' : ''
                            }`}
                    />

                    {/* Pulsing Core Overlay */}
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-500/40 animate-ping" />
                    <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]" />
                </div>

                {/* Floating Data Nodes */}
                <div className="absolute top-12 -right-4 flex flex-col items-center">
                    <div className="bg-slate-950/90 border border-emerald-500/40 px-4 py-2 rounded-2xl backdrop-blur-xl flex items-center space-x-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-90">
                        <Pulse className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black text-white italic tracking-wider">72 BPM</span>
                    </div>
                </div>

                <div className="absolute bottom-24 -left-8 flex flex-col items-center">
                    <div className="bg-slate-950/90 border border-blue-500/40 px-4 py-2 rounded-2xl backdrop-blur-xl flex items-center space-x-2 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-90">
                        <Droplets className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-black text-white italic tracking-wider">{hydration}% H2O</span>
                    </div>
                </div>

                {/* Bottom Bio-Scanner ID */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-slate-900/40 px-6 py-1.5 rounded-full border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <Radar className="w-4 h-4 text-cyan-500 animate-pulse" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Bio-Sync: Athletic Duo</span>
                </div>
            </div>
        </div>
    );
};

export default HealthAvatar;
