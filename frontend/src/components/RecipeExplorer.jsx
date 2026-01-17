import React, { useState, useEffect } from 'react';
import {
    Utensils, Clock, Flame, BookOpen, ChevronRight,
    Loader2, Sparkles, ChefHat, Heart, Dna,
    Zap, Activity, Target, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const RecipeExplorer = ({ user }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/ai/recipes/${user?.uid || 'guest-123'}`);
                setRecipes(response.data);
            } catch (err) {
                console.error("Error fetching recipes:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchRecipes();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-6">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-cyan-500 animate-spin" />
                    <Dna className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-cyan-500 font-black uppercase tracking-[0.3em] text-[10px]">Secuenciando Menú Genético...</p>
                    <p className="text-slate-500 text-[9px] mt-2 italic">Analizando perfiles metabólicos y riesgos biogénicos</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4 pb-20">
            {/* Header Lab */}
            <div className="bg-glass p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-[3000ms]">
                    <ChefHat className="w-64 h-64 text-cyan-400" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-cyan-500/10 rounded-[1.5rem] ai-glow">
                                <Activity className="text-cyan-400 w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-black text-white italic tracking-tight">Bio-Recetario <span className="text-cyan-400">Génico</span></h2>
                        </div>
                        <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
                            Algoritmo nutritivo ajustado a tu perfil de riesgo y bio-marcadores actuales.
                            Cada plato es una intervención celular.
                        </p>
                    </div>

                    <div className="bg-slate-950/80 px-8 py-5 rounded-[2rem] border border-white/10 flex items-center gap-4 backdrop-blur-xl">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">IA Optimizada: Activa</span>
                    </div>
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {recipes.map((recipe, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="bg-glass p-1 rounded-[3rem] transition-all duration-500 group cursor-pointer hover:-translate-y-2"
                    >
                        <div className="bg-slate-950/60 p-8 rounded-[2.8rem] border border-white/5 h-full flex flex-col relative overflow-hidden">
                            {/* Card Image Simulation */}
                            <div className="h-44 bg-slate-900/50 rounded-[2rem] mb-6 relative overflow-hidden group-hover:bg-slate-900/80 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Utensils className="w-12 h-12 text-slate-800 opacity-30 group-hover:scale-125 group-hover:opacity-50 transition-all duration-700" />
                                </div>
                                <div className="absolute top-4 right-4 z-20">
                                    <div className="bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-500/30 flex items-center gap-2">
                                        <Dna className="w-4 h-4 text-indigo-400" />
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{recipe.genomicMatch || 90}% Match</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className="bg-cyan-500 text-slate-950 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                                        {recipe.time}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-grow space-y-4">
                                <h3 className="text-2xl font-black text-white italic group-hover:text-cyan-400 transition-colors uppercase leading-tight">
                                    {recipe.title}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-black text-slate-200">{recipe.calories} KCAL</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                        <Zap className="w-4 h-4 text-yellow-500" />
                                        <span className="text-[10px] font-black text-slate-200 uppercase">{recipe.difficulty || 'Fácil'}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-8 w-full py-5 bg-white/5 hover:bg-cyan-500 hover:text-slate-950 rounded-[1.5rem] border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3">
                                Analizar Secuencia
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal - Ultra Cinematic */}
            {selectedRecipe && (
                <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 lg:p-10 animate-in fade-in zoom-in duration-300">
                    <div className="bg-slate-900 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative flex flex-col lg:flex-row">

                        {/* Image / Stats Side */}
                        <div className="lg:w-1/3 bg-slate-950 p-12 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent" />

                            <div className="relative z-10 space-y-10">
                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="p-4 bg-slate-900 rounded-2xl hover:bg-slate-800 transition-all border border-white/5 group"
                                >
                                    <ChevronRight className="w-6 h-6 text-white rotate-180 group-hover:-translate-x-1 transition-transform" />
                                </button>

                                <div className="space-y-6">
                                    <h2 className="text-5xl font-black text-white italic uppercase leading-[0.9] text-glow">
                                        {selectedRecipe.title}
                                    </h2>
                                    <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-[2rem] flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-1">Compatibilidad DNA</span>
                                            <span className="text-3xl font-black text-white">{selectedRecipe.genomicMatch || 90}%</span>
                                        </div>
                                        <Target className="w-10 h-10 text-cyan-400 animate-pulse" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-white/5">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Energía</span>
                                        <span className="text-xl font-black text-white">{selectedRecipe.calories} <span className="text-[10px]">kcal</span></span>
                                    </div>
                                    <div className="bg-slate-900/50 p-6 rounded-[1.5rem] border border-white/5">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Complejidad</span>
                                        <span className="text-xl font-black text-white uppercase">{selectedRecipe.difficulty || 'F'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <p className="text-slate-500 text-xs italic leading-relaxed">
                                    "La nutrición molecular no es una dieta, es una reprogramación de tu entorno químico interno."
                                </p>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="lg:w-2/3 p-12 lg:p-20 overflow-y-auto custom-scrollbar bg-slate-900/40">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {/* Ingredientes */}
                                <div className="space-y-8">
                                    <h4 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
                                        <BookOpen className="w-6 h-6 text-indigo-400" /> Reactivos <span className="text-indigo-400">Nutritivos</span>
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedRecipe.ingredients.map((ing, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 bg-slate-950/40 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                                                <span className="text-slate-300 font-medium">{ing}</span>
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preparación */}
                                <div className="space-y-8">
                                    <h4 className="text-2xl font-black text-white italic uppercase flex items-center gap-3">
                                        <Zap className="w-6 h-6 text-yellow-400" /> Algoritmo <span className="text-yellow-400">Cocción</span>
                                    </h4>
                                    <div className="space-y-8 relative">
                                        <div className="absolute left-6 top-10 bottom-10 w-px bg-white/5" />
                                        {selectedRecipe.steps.map((step, i) => (
                                            <div key={i} className="flex gap-6 group">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center font-black text-white relative z-10 group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all">
                                                    {i + 1}
                                                </div>
                                                <p className="text-slate-400 text-sm leading-relaxed pt-2 group-hover:text-slate-200 transition-colors">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-500/10 rounded-xl">
                                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Recomendado para optimizar tu racha de Bienestar.</p>
                                </div>
                                <button className="px-10 py-5 bg-cyan-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all">
                                    Confirmar Preparación (+50 PTS)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeExplorer;
