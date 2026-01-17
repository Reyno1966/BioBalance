import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, Info, Sparkles, Scale, Dna, Search } from 'lucide-react';


import { useAuth } from '../context/AuthContext';
import API_URL from '../config';

const FoodAnalyzer = ({ user }) => {
    // const { user } = useAuth();
    // Support for guest user from App.jsx state if needed, but App.jsx passes activeUser as user
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const demoAnalysis = {
        foodName: "Salmón con Espárragos y Quinoa",
        description: "Un plato equilibrado rico en Omega-3, fibra y proteínas de alta calidad. Los espárragos aportan prebióticos esenciales para tu bioma.",
        calories: 520,
        protein: 35,
        carbs: 42,
        fat: 18,
        portionSize: "Mediana (450g)",
        confidence: 98,
        recommendation: "Excelente elección para tu recuperación muscular post-entrenamiento de hoy. Combina con una infusión de jengibre para maximizar la absorción de nutrientes."
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
                setImage(event.target.result);
                setAnalysis(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const analyzeFood = async () => {
        if (!image) return;

        setLoading(true);
        setError(null);

        try {
            if (user?.uid === 'guest-123') {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 2500));
                setAnalysis(demoAnalysis);
            } else {
                const response = await fetch(`${API_URL}/api/nutrition/analyze`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.uid,
                        image: image
                    }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Error al analizar la comida');
                setAnalysis(data.analysis);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-glass p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-cyan-500/20 rounded-2xl">
                        <Camera className="text-cyan-400 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Analizador de Comidas IA</h2>
                        <p className="text-slate-400 text-sm">Sube una foto de tu plato para obtener un desglose nutricional instantáneo.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image Upload Area */}
                    <div className="space-y-4">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden 
                            ${preview ? 'border-transparent' : 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/50'}`}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <p className="text-white font-bold">Cambiar Imagen</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="bg-slate-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <Upload className="text-slate-400 w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-slate-300">Seleccionar Foto</p>
                                    <p className="text-slate-500 text-sm mt-2">JPG, PNG o WEBP</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <button
                            onClick={analyzeFood}
                            disabled={!image || loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:hover:shadow-none transition-all flex items-center justify-center space-x-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Analizando con IA...</span>
                                </>
                            ) : (
                                <span>Analizar Plato</span>
                            )}
                        </button>

                        {error && (
                            <p className="text-red-400 text-center text-sm font-medium">{error}</p>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="bg-slate-950/40 rounded-3xl border border-white/5 p-6 min-h-[400px]">
                        {!analysis ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                                <div className="p-4 bg-slate-900 rounded-full">
                                    <Info className="w-8 h-8 opacity-20" />
                                </div>
                                <p className="max-w-[200px]">Sube y analiza una foto para ver los resultados aquí.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="32" cy="32" r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="transparent"
                                                    className="text-slate-800"
                                                />
                                                <circle
                                                    cx="32" cy="32" r="28"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    fill="transparent"
                                                    strokeDasharray={175.9}
                                                    strokeDashoffset={175.9 - (175.9 * (analysis.bioScore || 85)) / 100}
                                                    className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-1000"
                                                />
                                            </svg>
                                            <span className="absolute text-sm font-black text-white italic">{analysis.bioScore || 85}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white italic tracking-tight">{analysis.foodName}</h3>
                                            <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Bio-Score de Alimento</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="flex items-center text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-400/20">
                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                            Sincronizado
                                        </div>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Confianza IA: {analysis.confidence}%</p>
                                    </div>
                                </div>


                                <p className="text-slate-400 text-sm leading-relaxed">{analysis.description}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Calorías</p>
                                        <p className="text-2xl font-black text-cyan-400">{analysis.calories} <span className="text-xs font-normal">kcal</span></p>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Proteína</p>
                                        <p className="text-2xl font-black text-blue-400">{analysis.protein} <span className="text-xs font-normal">g</span></p>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Carbohidratos</p>
                                        <p className="text-2xl font-black text-purple-400">{analysis.carbs} <span className="text-xs font-normal">g</span></p>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Grasas</p>
                                        <p className="text-2xl font-black text-pink-400">{analysis.fat} <span className="text-xs font-normal">g</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Genomic Match</p>
                                            <p className={`text-xs font-black ${analysis.genomicSuitability === 'High' ? 'text-cyan-400' : 'text-yellow-500'}`}>{analysis.genomicSuitability || 'Normal'}</p>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Dna className="w-4 h-4 text-indigo-400" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Porción</p>
                                            <p className="text-xs text-white font-black">{analysis.portionSize || 'Normal'}</p>
                                        </div>
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Scale className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-4 rounded-2xl border border-cyan-500/20">
                                    <p className="text-xs text-slate-300 italic">"Los valores son estimaciones basadas en el análisis visual de la IA."</p>
                                </div>

                                {analysis.recommendation && (
                                    <div className="bg-slate-900/80 p-5 rounded-2xl border border-white/5 flex items-start space-x-4 animate-in slide-in-from-left-4 duration-1000">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <Sparkles className="w-4 h-4 text-yellow-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Tip de Bienestar</p>
                                            <p className="text-xs text-slate-300 leading-relaxed font-medium">{analysis.recommendation}</p>
                                            <button
                                                className="mt-3 text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center hover:text-cyan-300 transition-colors"
                                                onClick={() => alert("Buscando recetas con " + (analysis.foodName || "este ingrediente") + "...")}
                                            >
                                                Ver Recetas Recomendadas <Search className="w-3 h-3 ml-2" />
                                            </button>
                                        </div>

                                    </div>
                                )}
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodAnalyzer;
