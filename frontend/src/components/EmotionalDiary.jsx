import React, { useState } from 'react';
import { Heart, Smile, Frown, Meh, Star, Trophy, MessageCircle } from 'lucide-react';

const EmotionalDiary = ({ onSubmit }) => {
    const [mood, setMood] = useState(null);
    const [note, setNote] = useState('');
    const [showReward, setShowReward] = useState(false);

    const moods = [
        { label: 'Increíble', icon: Smile, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Bien', icon: Meh, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { label: 'Neutral', icon: Meh, color: 'text-slate-400', bg: 'bg-slate-400/10' },
        { label: 'Bajo', icon: Frown, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Estresado', icon: Frown, color: 'text-red-400', bg: 'bg-red-400/10' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!mood) return;

        // Simulate submission
        onSubmit({ mood, note });
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-glass p-8 rounded-3xl space-y-8 relative overflow-hidden">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                        <Heart className="text-indigo-400 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Diario Emocional</h2>
                        <p className="text-slate-400 text-sm">Tu bienestar mental es clave para tu progreso físico.</p>
                    </div>
                </div>

                {/* Mood Selector */}
                <div className="space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">¿Cómo te sientes hoy?</p>
                    <div className="flex flex-wrap gap-4">
                        {moods.map((m) => (
                            <button
                                key={m.label}
                                onClick={() => setMood(m.label)}
                                className={`flex-1 min-w-[100px] p-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 group ${mood === m.label
                                        ? `${m.bg} border-${m.color.split('-')[1]}-500/50 scale-105`
                                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                    }`}
                            >
                                <m.icon className={`w-8 h-8 ${mood === m.label ? m.color : 'text-slate-500 group-hover:text-slate-300'}`} />
                                <span className={`text-xs font-bold ${mood === m.label ? 'text-white' : 'text-slate-500'}`}>{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Note Input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <textarea
                            placeholder="¿Qué tienes en mente? (Opcional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                        />
                        <MessageCircle className="absolute top-6 right-6 text-slate-700 w-5 h-5 pointer-events-none" />
                    </div>

                    <button
                        type="submit"
                        disabled={!mood}
                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Guardar Entrada
                    </button>
                </form>

                {/* Reward Modal/Overlay */}
                {showReward && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-10 animate-in zoom-in duration-300">
                        <div className="p-6 bg-yellow-500/20 rounded-full mb-6">
                            <Trophy className="text-yellow-400 w-16 h-16 animate-bounce" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-2">¡Increíble Constancia!</h3>
                        <p className="text-slate-400 max-w-xs">Has ganado la medalla de <strong>"Equilibrio Interior"</strong> por registrar tu estado de ánimo.</p>
                        <div className="mt-8 flex items-center space-x-2 text-yellow-400 font-bold">
                            <Star className="w-5 h-5 fill-current" />
                            <span>+50 Puntos de Bienestar</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Badges Section */}
            <div className="bg-glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Trophy className="text-yellow-500" /> Tus Medallas de Bienestar
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: 'Mente Clara', icon: Star, color: 'text-blue-400' },
                        { name: 'Siete Días', icon: Trophy, color: 'text-yellow-400' },
                        { name: 'Poder Mental', icon: Heart, color: 'text-red-400' },
                        { name: 'Zen Mode', icon: Smile, color: 'text-purple-400' },
                    ].map((badge, i) => (
                        <div key={badge.name} className={`p-6 rounded-3xl border border-slate-800 bg-slate-900/30 flex flex-col items-center text-center transition-all ${i > 1 ? 'opacity-30 grayscale' : 'hover:border-slate-600'}`}>
                            <badge.icon className={`w-10 h-10 mb-3 ${badge.color}`} />
                            <span className="text-xs font-bold uppercase tracking-widest">{badge.name}</span>
                            {i > 1 && <span className="text-[10px] text-slate-500 mt-2">Bloqueado</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmotionalDiary;
