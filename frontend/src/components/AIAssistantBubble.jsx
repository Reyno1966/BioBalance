import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, Loader2, Brain, Utensils, Zap, Moon } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const AIAssistantBubble = ({ user, context = 'general' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    const configs = {
        nutrition: {
            title: 'Hologram Nutricionista',
            icon: Utensils,
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10',
            welcome: 'Soy tu experto en Bio-Nutrición. ¿Analizamos tu balance calórico o micro-nutrientes hoy?'
        },
        exercise: {
            title: 'Coach Biocinético',
            icon: Zap,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            welcome: 'Sincronizado para optimizar tu rendimiento. ¿Tienes dudas sobre tu rutina o técnica?'
        },
        sleep: {
            title: 'Especialista REM',
            icon: Moon,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            welcome: 'Analizando tus ciclos circadiano. ¿Cómo podemos mejorar tu recuperación nocturna?'
        },
        mind: {
            title: 'Neuro-Guía AI',
            icon: Brain,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            welcome: 'Estabilidad de red neuronal establecida. ¿Deseas explorar técnicas de enfoque profundo?'
        },
        general: {
            title: 'BioBalance Assistant',
            icon: Bot,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            welcome: 'Bienvenido al Hub Central. ¿En qué área de tu evolución humana trabajamos hoy?'
        }
    };

    const config = configs[context] || configs.general;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMsg = { role: 'user', content: message };
        setChat(prev => [...prev, userMsg]);
        setMessage('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/ai/chat`, {
                userId: user?.uid || 'guest-123',
                message: message,
                expert: context
            });

            setChat(prev => [...prev, { role: 'ai', content: res.data.advice }]);
        } catch (err) {
            const errorInfo = err.response?.data?.error || err.message;
            setChat(prev => [...prev, {
                role: 'ai',
                content: `DIAGNÓSTICO_PUENTE: Fallo de conexión (${errorInfo}). Asegúrate de que VITE_API_URL apunte a tu backend en Vercel.`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[999]">
            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[400px] h-[600px] bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
                    {/* Window Header */}
                    <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl ${config.bg}`}>
                                <config.icon className={`w-6 h-6 ${config.color}`} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-sm uppercase tracking-widest">{config.title}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">Sincronía En Línea</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors p-2">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        {/* Welcome Message */}
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div className="bg-slate-900 px-6 py-4 rounded-[1.8rem] border border-white/5 text-slate-300 text-sm italic font-medium">
                                {config.welcome}
                            </div>
                        </div>

                        {chat.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full border border-white/5 flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-900'}`}>
                                    {msg.role === 'user' ? <Sparkles className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-cyan-400" />}
                                </div>
                                <div className={`px-6 py-4 rounded-[1.8rem] text-sm font-medium ${msg.role === 'user'
                                    ? 'bg-cyan-600/10 border border-cyan-500/30 text-white'
                                    : 'bg-slate-900 border border-white/5 text-slate-300'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
                                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                                </div>
                                <div className="bg-slate-900/50 px-6 py-4 rounded-[1.8rem] text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    Procesando respuesta neuronal...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-8 border-t border-white/5">
                        <div className="relative">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu consulta..."
                                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-slate-950 transition-all disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Float Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`p-6 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-110 active:scale-95 transition-all group relative overflow-hidden bg-slate-900 border border-white/10`}
                >
                    <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-br from-cyan-400 to-blue-600`} />
                    <MessageSquare className="w-8 h-8 text-white relative z-10" />
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan-400 animate-pulse" />
                </button>
            )}
        </div>
    );
};

export default AIAssistantBubble;
