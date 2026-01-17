import React, { useState, useEffect } from 'react';
import {
    Lightbulb, Sparkles, Brain, Loader2, Search,
    Zap, CheckCircle, Radar, Shield, Book,
    Cpu, Globe, ArrowRight, Terminal, Lock, Info,
    Eye, Database, Activity, FileText
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const BioAcademy = ({ user }) => {
    const [wisdom, setWisdom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(true);
    const [activeLesson, setActiveLesson] = useState(0);
    const [terminalLines, setTerminalLines] = useState([]);

    const lessons = [
        {
            id: 1,
            title: "Optimización de la Luz Azul",
            type: "Bio-Hack",
            content: "La exposición a la luz azul después de las 8:00 PM suprime la producción de melatonina en un 50%. Bloquear estas frecuencias mejora la calidad del sueño profundo y acelera la recuperación cognitiva durante la noche.",
            icon: Zap,
            color: "orange"
        },
        {
            id: 2,
            title: "Ayuno Dopaminérgico",
            type: "Neurología",
            content: "Reducir los estímulos de recompensa inmediata (redes sociales, azúcar, notificaciones) durante las primeras 2 horas del día permite recalibrar los receptores D2, aumentando el enfoque y la motivación intrínseca.",
            icon: Brain,
            color: "purple"
        },
        {
            id: 3,
            title: "Termogénesis en Frío",
            type: "Fisiocontrol",
            content: "La exposición al frío activa el tejido adiposo pardo (grasa marrón), aumentando la tasa metabólica basal y reduciendo la inflamación sistémica mediante la liberación de norepinefrina.",
            icon: Shield,
            color: "cyan"
        }
    ];

    useEffect(() => {
        const lines = [
            "ACCESSING_NEURAL_DATABASE...",
            "DECRYPTING_BIOMETRIC_ENCRYPTION...",
            "FILTERING_QUANTA_RESULTS...",
            "SYNC_COMPLETE: KNOWLEDGE_RESTORED"
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < lines.length) {
                setTerminalLines(prev => [...prev, lines[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 600);

        const fetchWisdom = async () => {
            try {
                // Simulate decoding time for effect
                setTimeout(async () => {
                    const response = await axios.get(`${API_URL}/api/ai/wisdom/${user?.uid || 'guest-123'}`);
                    setWisdom(response.data);
                    setScanning(false);
                    setLoading(false);
                }, 2000);
            } catch (err) {
                setScanning(false);
                setLoading(false);
            }
        };
        if (user) fetchWisdom();
        return () => clearInterval(interval);
    }, [user]);

    const handleConfirmRead = () => {
        // If it's a real user, we could award points here via API
        alert("¡Protocolo Confirmado! +15 Puntos de Bio-Conocimiento.");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 px-6 pb-32">
            {/* Forbidden Knowledge Terminal Header */}
            <div className="relative h-[450px] bg-slate-950 rounded-[4rem] border-2 border-cyan-500/20 overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.1)] group">
                {/* CRT Screen Effects */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 pointer-events-none bg-[length:100%_3px,3px_100%]" />
                <div className="absolute inset-0 bg-cyan-500/[0.02] z-10 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-scanline z-30" />

                {/* Background Tech Elements */}
                <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center">
                    <Database className="w-[500px] h-[500px] text-cyan-400 rotate-12" />
                </div>

                <div className="relative z-40 h-full flex flex-col items-center justify-center p-12 text-center">
                    {scanning ? (
                        <div className="space-y-8 font-mono">
                            <div className="flex justify-center space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-12 h-1 bg-cyan-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                            <div className="space-y-2">
                                {terminalLines.map((line, idx) => (
                                    <p key={idx} className="text-cyan-400/80 text-[10px] uppercase font-black tracking-[0.3em] animate-in fade-in slide-in-from-left-4">
                                        {line}
                                    </p>
                                ))}
                            </div>
                            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mt-6" />
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in zoom-in duration-1000">
                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 border border-cyan-500/30 rounded-full">
                                <Lock className="w-3 h-3 text-cyan-400" />
                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Neural Archive // Encrypted_Access_Granted</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">
                                Bio<span className="text-cyan-500">Academy</span>
                                <span className="block text-xl tracking-[0.4em] text-slate-500 mt-2 font-mono">Protocol_V4.0.2</span>
                            </h1>
                            <p className="max-w-xl mx-auto text-slate-400 font-medium">
                                Conocimiento algorítmico filtrado por tu perfil genético. Información crítica para la evolución humana.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {!scanning && wisdom && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Wisdom File */}
                    <div className="lg:col-span-8 group">
                        <div className="h-full bg-slate-950/60 rounded-[4rem] border border-white/5 p-12 lg:p-20 relative overflow-hidden transition-all duration-700 hover:border-cyan-500/30">
                            {/* Paper/Document Texture */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-[0.03] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                            <FileText className="text-cyan-400 w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em]">Tipo de Archivo</p>
                                            <p className="text-white font-black uppercase text-sm">{wisdom.type || 'Optimización'}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-1 h-6 bg-slate-800 rounded-full" />
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-4xl lg:text-5xl font-black text-white italic mb-10 leading-tight uppercase tracking-tighter decoration-cyan-500/30 underline decoration-4 underline-offset-8">
                                    {wisdom.title}
                                </h2>

                                <div className="space-y-8 text-xl text-slate-300 font-medium leading-[1.8] tracking-tight border-l-2 border-cyan-500/20 pl-10 py-4 italic bg-gradient-to-r from-cyan-500/[0.02] to-transparent rounded-r-3xl">
                                    {wisdom.content}
                                </div>

                                <div className="grid grid-cols-2 gap-6 mt-16">
                                    <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 group-hover:bg-slate-900 transition-colors">
                                        <Cpu className="w-8 h-8 text-indigo-500" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase">Sincronización</p>
                                            <p className="text-sm font-black text-white italic">Neural_Link_OK</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 group-hover:bg-slate-900 transition-colors">
                                        <Shield className="w-8 h-8 text-emerald-500" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase">Seguridad</p>
                                            <p className="text-sm font-black text-white italic">Protocol_Verified</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Actions Panel */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-glass p-12 rounded-[4rem] border border-white/5 text-center space-y-10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-green-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-32 h-32 mx-auto">
                                <div className="absolute inset-0 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
                                <div className="h-full w-full bg-slate-950 rounded-full border-2 border-green-500/30 flex items-center justify-center relative z-10 group-hover:border-green-500 transition-colors">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter italic">Bio-Protocolo</h3>
                                <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">Transferencia de Datos Lista</p>
                            </div>

                            <button
                                onClick={handleConfirmRead}
                                className="w-full py-6 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-slate-950 rounded-3xl border border-green-500/20 font-black text-xs uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                            >
                                Confirmar Lectura
                            </button>
                        </div>

                        <div className="bg-indigo-600/10 p-12 rounded-[4rem] border border-indigo-500/20 group cursor-pointer hover:bg-indigo-600/20 transition-all text-center space-y-6">
                            <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 inline-block group-hover:rotate-12 transition-transform">
                                <Globe className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase text-xs mb-2 tracking-widest">Social Archive</h4>
                                <p className="text-sm text-slate-500 font-bold px-4 leading-relaxed">
                                    Explora los nodos de conocimiento que la comunidad está desbloqueando hoy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Resources Grid - Decoded Files Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                {lessons.map((res, i) => (
                    <div
                        key={i}
                        onClick={() => setWisdom(res)}
                        className={`group cursor-pointer bg-slate-950 p-10 rounded-[3rem] border transition-all hover:-translate-y-4 relative overflow-hidden ${wisdom?.title === res.title ? 'border-cyan-500/50 bg-slate-900' : 'border-white/5 hover:border-white/20'
                            }`}
                    >
                        <div className={`absolute top-0 right-0 p-10 opacity-5 text-${res.color}-400 group-hover:opacity-20 transition-opacity`}>
                            <res.icon className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className={`p-4 bg-${res.color}-500/10 rounded-2xl w-fit group-hover:bg-${res.color}-500 transition-colors`}>
                                <res.icon className={`w-6 h-6 text-${res.color}-400 group-hover:text-slate-950 transition-colors`} />
                            </div>
                            <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">{res.title}</h4>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">{res.content}</p>
                            <div className="flex items-center gap-2 text-[8px] font-black text-slate-700 uppercase tracking-widest group-hover:text-cyan-500 transition-colors">
                                <ArrowRight className="w-3 h-3" /> Cargar en Terminal
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BioAcademy;
