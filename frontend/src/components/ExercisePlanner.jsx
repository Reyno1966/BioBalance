import React, { useState, useEffect } from 'react';
import {
    Activity, Dumbbell, Move, Sun, Wind, CheckCircle2,
    Loader2, ShieldAlert, Timer, Play, Pause, RotateCcw,
    Zap, Brain, Target, Sparkles, ChevronRight, BarChart3,
    Trophy, Heart, Flame, Radar, Cpu, Clock, Info, ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';
import { useTranslation } from 'react-i18next';

// Base Holograms
import bioAvatar from '../assets/bio-avatar.png';
import muscleMap from '../assets/muscle-map.png';

// Dynamic Pose Holograms
import pushupHolo from '../assets/hologram-pushup.png';
import squatHolo from '../assets/hologram-squat.png';
import benchHolo from '../assets/hologram-benchpress.png';
import lotusHolo from '../assets/hologram-lotus.png';
import sprintHolo from '../assets/hologram-sprint.png';
import cobraHolo from '../assets/hologram-cobra.png';
import plankHolo from '../assets/hologram-plank.png';
import lsitHolo from '../assets/hologram-lsit.png';
import pistolHolo from '../assets/hologram-pistol.png';
import archerHolo from '../assets/hologram-archer.png';
import sidePlankHolo from '../assets/hologram-side-plank.png';
import hollowHolo from '../assets/hologram-hollow.png';
import burpeeHolo from '../assets/hologram-burpee.png';
import climberHolo from '../assets/hologram-climber.png';
import dipsHolo from '../assets/hologram-dips.png';
import bearHolo from '../assets/hologram-bear.png';
import pikeHolo from '../assets/hologram-pike.png';
import powerLungeHolo from '../assets/hologram-power-lunge.png';
import supermanHolo from '../assets/hologram-superman.png';
import bridgeHolo from '../assets/hologram-bridge.png';
import wallSitHolo from '../assets/hologram-wallsit.png';
import navajaHolo from '../assets/hologram-navaja.png';
import diamondHolo from '../assets/hologram-diamond.png';
import prisonerHolo from '../assets/hologram-prisoner.png';
import commandoHolo from '../assets/hologram-commando.png';
import lateralLungeHolo from '../assets/hologram-lateral-lunge.png';
import tuckJumpHolo from '../assets/hologram-tuck-jump.png';

const ExercisePlanner = ({ user }) => {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeExercise, setActiveExercise] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('bodyweight');

    const getPoseHologram = (exercise) => {
        if (!exercise) return bioAvatar;
        const title = (exercise.title || '').toLowerCase();
        if (title.includes('pistol')) return pistolHolo;
        if (title.includes('burpee')) return burpeeHolo;
        if (title.includes('escalador') || title.includes('climber')) return climberHolo;
        if (title.includes('fondo') || title.includes('dips')) return dipsHolo;
        if (title.includes('arquera') || title.includes('archer')) return archerHolo;
        if (title.includes('oso') || title.includes('bear')) return bearHolo;
        if (title.includes('lateral')) return sidePlankHolo;
        if (title.includes('pica') || title.includes('pike')) return pikeHolo;
        if (title.includes('zancada') || title.includes('power')) return powerLungeHolo;
        if (title.includes('superman')) return supermanHolo;
        if (title.includes('puente')) return bridgeHolo;
        if (title.includes('pared')) return wallSitHolo;
        if (title.includes('diamante')) return diamondHolo;
        if (title.includes('prisionero')) return prisonerHolo;
        if (title.includes('comando')) return commandoHolo;
        if (title.includes('rodilla') || title.includes('tuck')) return tuckJumpHolo;
        if (title.includes('flexión') || title.includes('push')) return pushupHolo;
        if (title.includes('sentadilla') || title.includes('squat')) return squatHolo;
        if (title.includes('hollow')) return hollowHolo;
        if (title.includes('navaja')) return navajaHolo;
        if (title.includes('l-sit')) return lsitHolo;
        if (title.includes('medita') || title.includes('zen')) return lotusHolo;
        if (selectedCategory === 'weights') return benchHolo;
        if (selectedCategory === 'zen') return lotusHolo;
        return bioAvatar;
    };

    const exerciseData = {
        bodyweight: [
            { id: 'bw-1', title: 'Sentadilla Pistola (Pistol)', focus: 'Tren Inferior', difficulty: 'Élite', desc: 'Fuerza unimodal.' },
            { id: 'bw-2', title: 'Flexiones Arqueras', focus: 'Pectoral', difficulty: 'Alta', desc: 'Distribución asimétrica.' },
            { id: 'bw-3', title: 'Plancha Lateral', focus: 'Core', difficulty: 'Media', desc: 'Estabilidad.' },
            { id: 'bw-4', title: 'Hollow Body Rock', focus: 'Core Profundo', difficulty: 'Alta', desc: 'Activación anterior.' },
            { id: 'bw-5', title: 'Burpee con Salto', focus: 'Metabólico', difficulty: 'Máxima', desc: 'Alta demanda.' },
            { id: 'bw-6', title: 'Escaladores', focus: 'Cardio', difficulty: 'Media', desc: 'Movilidad.' },
            { id: 'bw-7', title: 'Fondos en Paralelas', focus: 'Tríceps', difficulty: 'Alta', desc: 'Extensión forzada.' },
            { id: 'bw-8', title: 'Paso del Oso', focus: 'Full Body', difficulty: 'Media', desc: 'Coordinación.' },
            { id: 'bw-9', title: 'Flexiones en Pica', focus: 'Hombros', difficulty: 'Alta', desc: 'Empuje vertical.' },
            { id: 'bw-10', title: 'Zancadas de Poder', focus: 'Explosividad', difficulty: 'Máxima', desc: 'Potencia.' },
            { id: 'bw-11', title: 'Superman Isométrico', focus: 'Espalda', difficulty: 'Baja', desc: 'Postural.' },
            { id: 'bw-12', title: 'Puente de Glúteo', focus: 'Glúteo', difficulty: 'Media', desc: 'Aislamiento.' },
            { id: 'bw-13', title: 'Wall Sit', focus: 'Cuádriceps', difficulty: 'Media', desc: 'Resistencia.' },
            { id: 'bw-14', title: 'Abdominales Navaja', focus: 'Core', difficulty: 'Alta', desc: 'Compresión.' },
            { id: 'bw-15', title: 'Flexiones Diamante', focus: 'Tríceps', difficulty: 'Media', desc: 'Aislamiento.' },
            { id: 'bw-16', title: 'Sentadilla de Prisionero', focus: 'Postural', difficulty: 'Baja', desc: 'Corrección.' },
            { id: 'bw-17', title: 'Plancha Comando', focus: 'Hombros/Core', difficulty: 'Alta', desc: 'Dinámico.' },
            { id: 'bw-18', title: 'Estocadas Laterales', focus: 'Aductores', difficulty: 'Media', desc: 'Plano frontal.' },
            { id: 'bw-19', title: 'L-Sit Progressions', focus: 'Core Élite', difficulty: 'Élite', desc: 'Tensión máxima.' },
            { id: 'bw-20', title: 'Saltos de Rodilla', focus: 'Potencia', difficulty: 'Máxima', desc: 'Reactivo.' }
        ],
        weights: [
            { id: 'w-1', title: 'Press de Banca Bio-Force', focus: 'Pecho', difficulty: 'Alta', desc: 'Fuerza pura.' },
            { id: 'w-2', title: 'Peso Muerto Rumano', focus: 'Espalda', difficulty: 'Alta', desc: 'Cadena posterior.' },
            { id: 'w-3', title: 'Press Militar', focus: 'Hombros', difficulty: 'Alta', desc: 'Empuje vertical.' },
            { id: 'w-4', title: 'Sentadilla Frontal', focus: 'Cuádriceps', difficulty: 'Élite', desc: 'Verticalidad.' },
            { id: 'w-5', title: 'Remo con Mancuerna', focus: 'Dorsal', difficulty: 'Media', desc: 'Simetría.' },
            { id: 'w-6', title: 'Curl Martillo', focus: 'Bíceps', difficulty: 'Media', desc: 'Carga constante.' },
            { id: 'w-7', title: 'Extensiones Tríceps', focus: 'Tríceps', difficulty: 'Media', desc: 'Estiramiento.' },
            { id: 'w-8', title: 'Press Inclinado', focus: 'Pecho Superior', difficulty: 'Alta', desc: 'Ángulo superior.' },
            { id: 'w-9', title: 'Goblet Squat', focus: 'Piernas', difficulty: 'Media', desc: 'Apertura cadera.' },
            { id: 'w-10', title: 'Face Pulls', focus: 'Hombro Post.', difficulty: 'Baja', desc: 'Salud escapular.' }
        ],
        zen: [
            { id: 'z-1', title: 'Respiración de Caja 4-4-4', focus: 'Nervios', difficulty: 'Baja', desc: 'Reset neural.' },
            { id: 'z-2', title: 'Coherencia Cardiaca', focus: 'Corazón', difficulty: 'Media', desc: 'Sincronización.' },
            { id: 'z-3', title: 'Escaneo Corporal REM', focus: 'Sueño', difficulty: 'Baja', desc: 'Relajación.' },
            { id: 'z-4', title: 'Meditación Trataka', focus: 'Foco', difficulty: 'Media', desc: 'Atención visual.' },
            { id: 'z-5', title: 'Yoga Nidra', focus: 'Descanso Celular', difficulty: 'Alta', desc: 'Estado theta.' },
            { id: 'z-6', title: 'Estiramiento Cobra', focus: 'Caja Torácica', difficulty: 'Baja', desc: 'Apertura.' }
        ]
    };

    const handleStartSimulation = (exercise) => {
        setActiveExercise(exercise);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeLeft(exercise.id.includes('z') ? 300 : 45);
        setIsActive(true);
    };

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 pb-40 px-6 animate-in fade-in duration-1000">
            {/* Visual Simulator */}
            <div className="relative h-[600px] w-full bg-slate-900/60 rounded-[4rem] border-2 border-cyan-500/20 overflow-hidden shadow-2xl">
                <div className="absolute top-8 left-8 z-30 flex items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-white/10">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <span className="text-[10px] font-black text-white uppercase italic">Bio_Scanner_Active</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center p-10">
                    <img src={getPoseHologram(activeExercise)} alt="Simulation" className="h-full object-contain mix-blend-screen drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]" />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-10 bg-gradient-to-t from-slate-950 to-transparent">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                            <button onClick={() => setIsActive(!isActive)} className="p-6 bg-cyan-600 rounded-full shadow-lg shadow-cyan-500/20">
                                {isActive ? <Pause className="text-slate-950" /> : <Play className="text-slate-950" />}
                            </button>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase">{activeExercise?.title || 'SELECCIONA EJERCICIO'}</h3>
                                <p className="text-cyan-500/50 text-[9px] font-bold uppercase tracking-[0.3em]">Status: Ready for Sync</p>
                            </div>
                        </div>
                        <div className="text-5xl font-mono font-black text-white tracking-tighter">{formatTime(timeLeft)}</div>
                    </div>
                </div>
            </div>

            {/* Diversity Library */}
            <div className="space-y-12">
                <div className="flex justify-between items-end border-b border-white/5 pb-8">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Bio-Library</h2>
                    <div className="flex bg-slate-900/80 p-1 rounded-full border border-white/10">
                        {['bodyweight', 'weights', 'zen'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                            >
                                {cat === 'bodyweight' ? 'Sin Pesas' : cat === 'weights' ? 'Con Pesas' : 'Zen'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {exerciseData[selectedCategory].map((exercise) => (
                        <div
                            key={exercise.id}
                            onClick={() => handleStartSimulation(exercise)}
                            className={`p-6 rounded-[3rem] border-2 transition-all cursor-pointer group ${activeExercise?.id === exercise.id ? 'border-cyan-500 bg-cyan-500/10' : 'bg-slate-900/40 border-white/5 hover:border-white/20'}`}
                        >
                            <div className="aspect-square bg-slate-950/60 rounded-[2rem] flex items-center justify-center mb-6 overflow-hidden">
                                <img src={getPoseHologram(exercise)} className="h-3/4 object-contain mix-blend-screen group-hover:scale-110 transition-transform" />
                            </div>
                            <h4 className="text-lg font-black text-white italic uppercase group-hover:text-cyan-400 transition-colors">{exercise.title}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{exercise.focus}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExercisePlanner;
