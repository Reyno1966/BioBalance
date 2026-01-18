import React, { useState, useRef, useEffect } from 'react';
import {
    Send, Bot, User, Loader2, Sparkles, MessageCircle, X,
    Mic, MicOff, Volume2, Brain, Zap, Radio, Cpu,
    Terminal, Globe, ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import API_URL from '../config';

const WellnessChat = ({ user }) => {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'SYSTEM_SYNC: BioBalance Neural Interface Online. How can I assist with your biological optimization today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Digital audio processing not supported on this terminal.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = i18n.language === 'en' ? 'en-US' : 'es-ES';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
        recognition.start();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/ai/chat`, {
                userId: user?.uid || 'guest-123',
                message: input
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.advice }]);
        } catch (err) {
            console.error("Neural processing error:", err);
            const errorMsg = err.response?.data?.error || err.message;
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `DIAGNÓSTICO: Error de conexión (${errorMsg}). Verifica que VITE_API_URL y GEMINI_API_KEY estén configuradas en Vercel.`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto h-[85vh] md:h-[750px] flex flex-col bg-slate-950/60 backdrop-blur-3xl rounded-3xl md:rounded-[3.5rem] border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden animate-in fade-in zoom-in duration-1000">
            {/* Background Neural Grid */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Header / System Status */}
            <div className="p-4 md:p-8 border-b border-white/5 bg-slate-900/30 flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3 md:space-x-5">
                    <div className="relative scale-75 md:scale-100">
                        <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full animate-pulse" />
                        <div className="p-3 bg-slate-900 rounded-2xl border border-cyan-500/30 relative">
                            <Brain className="text-cyan-400 w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-4 border-slate-950 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm md:text-xl font-black text-white italic uppercase tracking-wider flex items-center gap-2">
                            Neural <span className="text-cyan-400">Hub</span>
                            <span className="text-[8px] md:text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 md:py-0.5 rounded-lg border border-cyan-500/30 font-bold ml-1 md:ml-2">v4.0.2</span>
                        </h3>
                        <div className="flex items-center gap-2 md:gap-4 mt-0.5 md:mt-1">
                            <p className="text-[7px] md:text-[9px] text-cyan-500/60 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-1">
                                <Radio className="w-2 h-2 md:w-3 md:h-3 animate-ping" /> Sincronizado
                            </p>
                            <p className="text-[7px] md:text-[9px] text-indigo-400/60 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-1">
                                <Cpu className="w-2 h-2 md:w-3 md:h-3" /> <span className="hidden xs:inline">Core:</span> Quantum-L1
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Latencia Global</span>
                        <span className="text-xs font-mono text-cyan-400">12ms</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all group">
                        <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative flex">
                {/* Central Neural Aura - Floating behind messages */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 custom-scrollbar relative z-10">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
                            <div className={`flex max-w-[90%] md:max-w-[85%] gap-3 md:gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 ${msg.role === 'user'
                                    ? 'bg-blue-600/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                    : 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5 md:w-6 md:h-6 text-blue-400" /> : <Terminal className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />}
                                </div>

                                <div className="space-y-1.5 md:space-y-2">
                                    <div className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-xs md:text-sm leading-relaxed relative group/msg transition-all duration-500 ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/40'
                                        : 'bg-slate-900/80 backdrop-blur-xl text-slate-200 rounded-tl-none border border-white/5 hover:border-cyan-500/20'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <div className="absolute -top-2.5 left-4 md:left-6 text-[7px] md:text-[8px] font-black uppercase tracking-widest text-cyan-500 bg-slate-950 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                                AI_ADVICE_NODE
                                            </div>
                                        )}
                                        <p className={`${msg.role === 'assistant' ? 'font-medium' : 'font-bold'}`}>
                                            {msg.content}
                                        </p>

                                        {msg.role === 'assistant' && (
                                            <button
                                                onClick={() => {
                                                    const utterance = new SpeechSynthesisUtterance(msg.content);
                                                    utterance.lang = i18n.language === 'en' ? 'en-US' : 'es-ES';
                                                    window.speechSynthesis.speak(utterance);
                                                }}
                                                className="absolute -right-12 top-2 p-3 opacity-0 group-hover/msg:opacity-100 transition-all text-slate-500 hover:text-cyan-400 bg-slate-900/50 rounded-xl"
                                            >
                                                <Volume2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest opacity-30 ${msg.role === 'user' ? 'text-right block pr-2' : 'pl-2'}`}>
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="flex gap-5 items-center">
                                <div className="w-10 h-10 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                                </div>
                                <div className="bg-slate-900/40 px-6 py-4 rounded-3xl rounded-tl-none border border-cyan-500/10 italic text-slate-500 text-xs">
                                    Procesando respuesta neuronal...
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area / Molecular Sorter */}
            <div className="p-4 md:p-10 bg-slate-900/40 border-t border-white/5 relative z-10">
                {isListening && (
                    <div className="absolute -top-16 left-6 right-6 flex items-center justify-center gap-0.5 md:gap-1">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="w-0.5 md:w-1 bg-cyan-500 rounded-full animate-wave"
                                style={{
                                    height: `${Math.random() * 30 + 10}px`,
                                    animationDelay: `${i * 0.05}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-3 md:gap-6">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-cyan-500/5 blur-lg rounded-2xl md:rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "DECODING..." : "N_HUB_ENVÍAR..."}
                            className={`w-full bg-slate-950/80 border-[1.5px] rounded-2xl md:rounded-[2rem] px-4 md:px-8 py-3.5 md:py-5 text-xs md:text-sm text-white focus:outline-none transition-all placeholder-slate-600 font-bold tracking-wide relative z-10 ${isListening
                                ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                                : "border-white/10 focus:border-cyan-500 shadow-xl"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={startListening}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-xl md:rounded-2xl transition-all z-20 ${isListening
                                ? "bg-red-500 text-white"
                                : "text-slate-500 hover:text-white"
                                }`}
                        >
                            {isListening ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="p-3.5 md:p-5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-2xl md:rounded-[2rem] transition-all transform active:scale-95 disabled:opacity-30 shadow-[0_0_20px_rgba(6,182,212,0.3)] group"
                    >
                        <Send className="w-5 h-5 md:w-7 md:h-7 font-black transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-slate-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Global Sync On</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Real-time Optimization</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessChat;
