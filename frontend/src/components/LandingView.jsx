import React, { useState } from 'react';
import {
    Zap, Brain, Activity, Shield, ChevronRight, Globe,
    Star, Users, Heart, Sparkles, Terminal, Cpu, Radar,
    MousePointer2, ArrowRight
} from 'lucide-react';
import landingHero from '../assets/landing-hero.png';
import AuthForms from './AuthForms';

const LandingView = ({ onGuestLogin }) => {
    const [showAuth, setShowAuth] = useState(false);

    const features = [
        {
            icon: <Cpu className="w-8 h-8 text-cyan-400" />,
            title: "Genomic AI Analysis",
            desc: "Nuestros algoritmos procesan tu perfil biológico para crear planes de optimización celular únicos en el mundo."
        },
        {
            icon: <Activity className="w-8 h-8 text-indigo-400" />,
            title: "Real-time Bio-Sync",
            desc: "Sincronización instantánea con tus biomarcadores para ajustar tu entrenamiento y nutrición al segundo."
        },
        {
            icon: <Brain className="w-8 h-8 text-purple-400" />,
            title: "Neural Recovery",
            desc: "Protocolos de descanso diseñados para maximizar la neuroplasticidad y la recuperación cognitiva profunda."
        }
    ];

    if (showAuth) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <button
                    onClick={() => setShowAuth(false)}
                    className="absolute top-10 left-10 text-slate-500 hover:text-white flex items-center gap-2 font-black uppercase tracking-widest text-[10px]"
                >
                    <ArrowRight className="rotate-180 w-4 h-4" /> Volver al Inicio
                </button>
                <div className="animate-in fade-in zoom-in duration-700 w-full max-w-md">
                    <AuthForms onGuestLogin={onGuestLogin} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center backdrop-blur-md bg-slate-950/20 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        <Zap className="text-slate-950 w-6 h-6 fill-slate-950" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter italic uppercase">BioBalance</span>
                </div>
                <button
                    onClick={() => setShowAuth(true)}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                    Acceso Terminal
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center px-6">
                <div className="absolute inset-0 z-0">
                    <img
                        src={landingHero}
                        alt="Hero"
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full animate-bounce">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest italic">Nueva Era en Biohacking</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-[ -0.05em] leading-[0.85] uppercase italic">
                        <span className="block opacity-80">Optimización</span>
                        <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(6,182,212,0.3)]">Biocinética</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                        BioBalance es el laboratorio personal que sincroniza tu genética, nutrición y entrenamiento mediante inteligencia neuronal avanzada.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                        <button
                            onClick={() => setShowAuth(true)}
                            className="group relative px-12 py-6 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.4)]"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Iniciar Sincronización <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button
                            onClick={onGuestLogin}
                            className="group px-12 py-6 bg-slate-900 hover:bg-slate-800 text-cyan-400 rounded-[2rem] border border-cyan-500/20 font-black text-xs uppercase tracking-[0.3em] transition-all"
                        >
                            Acceso Invitado (Demo)
                        </button>
                    </div>
                </div>

                {/* Floating Metrics Decoration */}
                <div className="absolute bottom-20 left-20 hidden xl:block animate-pulse">
                    <div className="p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl space-y-2">
                        <div className="flex gap-1 h-3">
                            <div className="w-1 bg-cyan-500 rounded-full h-8" />
                            <div className="w-1 bg-cyan-500/50 rounded-full h-5 mt-3" />
                            <div className="w-1 bg-cyan-500 rounded-full h-10 mt-[-4px]" />
                        </div>
                        <p className="text-[10px] font-black text-slate-500">BIO_SIGNAL_SCAN</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <div key={i} className="group p-12 bg-glass border border-white/5 rounded-[3.5rem] hover:border-cyan-500/30 transition-all hover:-translate-y-4">
                            <div className="p-5 bg-slate-900/50 rounded-3xl border border-white/5 w-fit mb-8 group-hover:bg-cyan-500 transition-all">
                                <span className="group-hover:text-slate-950 transition-colors uppercase">
                                    {f.icon}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-4 italic tracking-tight">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-40 px-6 text-center">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 p-20 rounded-[4rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full" />

                    <h2 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8">
                        ¿Listo para el <span className="text-cyan-400 italic">Siguiente Nivel</span>?
                    </h2>
                    <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
                        Únete a miles de biohackers que ya están optimizando su potencial humano con BioBalance.
                    </p>
                    <button
                        onClick={() => setShowAuth(true)}
                        className="px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                    >
                        Comenzar Ahora
                    </button>

                    <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-3xl font-black text-white italic">1.2M+</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Bio-Sincronías</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white italic">99.9%</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Precisión de IA</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white italic">24/7</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Soporte Neuronal</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="p-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <span className="font-black uppercase tracking-tighter">BioBalance Systems</span>
                </div>
                <div className="flex gap-10">
                    <span className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-cyan-400 transition-colors">Garantía Genómica</span>
                    <span className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-cyan-400 transition-colors">Seguridad Cuántica</span>
                    <span className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-cyan-400 transition-colors">Terminal L1</span>
                </div>
                <div className="flex gap-4">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10"><Globe className="w-4 h-4" /></div>
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10"><Radar className="w-4 h-4" /></div>
                </div>
            </footer>
        </div>
    );
};

export default LandingView;
