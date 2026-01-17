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
    const [saving, setSaving] = useState(false);
    const [simulatorMode, setSimulatorMode] = useState('duo');
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
        if (title.includes('plancha lateral')) return sidePlankHolo;
        if (title.includes('pica') || title.includes('pike')) return pikeHolo;
        if (title.includes('zancada') || title.includes('power lunge')) return powerLungeHolo;
        if (title.includes('superman')) return supermanHolo;
        if (title.includes('puente')) return bridgeHolo;
        if (title.includes('pared') || title.includes('wall sit')) return wallSitHolo;
        if (title.includes('diamante') || title.includes('diamond')) return diamondHolo;
        if (title.includes('prisionero')) return prisonerHolo;
        if (title.includes('comando')) return commandoHolo;
        if (title.includes('lateral lunge')) return lateralLungeHolo;
        if (title.includes('tuck jump') || title.includes('rodilla')) return tuckJumpHolo;
        if (title.includes('flexión') || title.includes('push')) return pushupHolo;
        if (title.includes('sentadilla') || title.includes('squat')) return squatHolo;
        if (title.includes('meditación') || title.includes('zen')) return lotusHolo;
        if (title.includes('plancha')) return plankHolo;
        if (title.includes('hollow')) return hollowHolo;
        if (title.includes('navaja')) return navajaHolo;
        if (title.includes('l-sit')) return lsitHolo;

        if (selectedCategory === 'weights') return benchHolo;
        if (selectedCategory === 'zen') return lotusHolo;
        return bioAvatar;
    };

    const exerciseData = {
        bodyweight: [
            { id: 'bw-1', title: 'Sentadilla Pistola (Pistol)', focus: 'Tren Inferior', difficulty: 'Élite', desc: 'Equilibrio y fuerza unimodal.' },
            { id: 'bw-2', title: 'Flexiones Arqueras', focus: 'Pectoral', difficulty: 'Alta', desc: 'Distribución asimétrica de carga.' },
            { id: 'bw-3', title: 'Plancha Lateral', focus: 'Core', difficulty: 'Media', desc: 'Estabilidad rotacional.' },
            { id: 'bw-4', title: 'Hollow Body Rock', focus: 'Core Profundo', difficulty: 'Alta', desc: 'Activación cadena anterior.' },
            { id: 'bw-5', title: 'Burpee con Salto', focus: 'Metabólico', difficulty: 'Máxima', desc: 'Protocolo de alta demanda.' },
            { id: 'bw-6', title: 'Escaladores', focus: 'Cardio', difficulty: 'Media', desc: 'Movilidad dinámica.' },
            { id: 'bw-7', title: 'Fondos en Paralelas', focus: 'Tríceps', difficulty: 'Alta', desc: 'Extensión forzada.' },
            { id: 'bw-8', title: 'Paso del Oso', focus: 'Total Body', difficulty: 'Media', desc: 'Coordinación cuadrúpeda.' },
            { id: 'bw-9', title: 'Flexiones en Pica', focus: 'Hombros', difficulty: 'Alta', desc: 'Empuje vertical.' },
            { id: 'bw-10', title: 'Zancadas de Poder', focus: 'Explosividad', difficulty: 'Máxima', desc: 'Fibras tipo IIb.' },
            { id: 'bw-11', title: 'Superman Isométrico', focus: 'Espalda', difficulty: 'Baja', desc: 'Cadena posterior.' },
            { id: 'bw-12', title: 'Puente de Glúteo', focus: 'Glúteo', difficulty: 'Media', desc: 'Aislamiento pélvico.' },
            { id: 'bw-13', title: 'Wall Sit', focus: 'Cuádriceps', difficulty: 'Media', desc: 'Resistencia isométrica.' },
            { id: 'bw-14', title: 'Abdominales Navaja', focus: 'Core', difficulty: 'Alta', desc: 'Compresión máxima.' },
            { id: 'bw-15', title: 'Flexiones Diamante', focus: 'Tríceps', difficulty: 'Media', desc: 'Enfoque en tríceps.' },
            { id: 'bw-16', title: 'Sentadilla Prisionero', focus: 'Postural', difficulty: 'Baja', desc: 'Corrección técnica.' },
            { id: 'bw-17', title: 'Plancha Comando', focus: 'Hombros', difficulty: 'Alta', desc: 'Transición dinámica.' },
            { id: 'bw-18', title: 'Estocada Lateral', focus: 'Aductores', difficulty: 'Media', desc: 'Plano frontal.' },
            { id: 'bw-19', title: 'L-Sit Progressions', focus: 'Core Élite', difficulty: 'Élite', desc: 'Tensión máxima.' },
            { id: 'bw-20', title: 'Saltos al Pecho', focus: 'Potencia', difficulty: 'Máxima', desc: 'Impacto biocinético.' }
        ],
        weights: [
            { id: 'w-1', title: 'Press de Banca', focus: 'Pecho', difficulty: 'Alta', desc: 'Fuerza pura.' },
            { id: 'w-2', title: 'Peso Muerto', focus: 'Espalda/Piernas', difficulty: 'Alta', desc: 'Cadena posterior.' },
            { id: 'w-3', title: 'Press Militar', focus: 'Hombros', difficulty: 'Alta', desc: 'Empuje vertical.' },
            { id: 'w-10', title: 'Curl de Bíceps', focus: 'Bíceps', difficulty: 'Media', desc: 'Aislamiento.' }
        ],
        zen: [
            { id: 'z-1', title: 'Meditación Guiada', focus: 'Mente', difficulty: 'Baja', desc: 'Paz mental.' },
            { id: 'z-2', title: 'Respiración Profunda', focus: 'Nervios', difficulty: 'Baja', desc: 'Relajación.' }
        ]
    };

    const handleStartSimulation = (exercise) => {
        setActiveExercise(exercise);
        setSimulatorMode(selectedCategory === 'weights' ? 'muscle' : 'duo');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const baseDuration = exercise.id.includes('z') ? 300 : 60;
        setTimeLeft(baseDuration);
        setIsActive(true);
    };

    const fetchHistory = async () => {
        try {
            if (user?.uid === 'guest-123') return;
            const response = await axios.get(`${API_URL}/api/exercise/history/${user.uid}`);
            setHistory(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) fetchHistory();
    }, [user]);

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
        <div className="max-w-7xl mx-auto space-y-12 pb-40 px-6 animate-in fade-in duration-1000">
            {/* Simulator */}
            <div className="relative h-[600px] w-full bg-slate-900/60 rounded-[4rem] border border-white/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <img
                        src={getPoseHologram(activeExercise)}
                        alt="Trainer"
                        className="h-full object-contain mix-blend-screen drop-shadow-[0_0_40px_rgba(6,182,212,0.3)]"
                    />
                </div>

                <div className="absolute bottom-0 inset-x-0 p-12 bg-gradient-to-t from-slate-950 to-transparent">
                    <div className="flex justify-between items-end">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                                {activeExercise?.title || 'Seleccionar Ejercicio'}
                            </h3>
                            <div className="text-5xl font-mono font-black text-cyan-400">
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <button onClick={() => setIsActive(!isActive)} className="p-8 bg-cyan-600 rounded-full text-slate-950">
                            {isActive ? <Pause /> : <Play />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Selector */}
            <div className="flex gap-4">
                {['bodyweight', 'weights', 'zen'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest border transition-all ${selectedCategory === cat ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-500 border-white/5'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {exerciseData[selectedCategory].map((exercise) => (
                    <div
                        key={exercise.id}
                        onClick={() => handleStartSimulation(exercise)}
                        className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group"
                    >
                        <div className="aspect-square bg-slate-950/50 rounded-3xl overflow-hidden mb-6 flex items-center justify-center">
                            <img src={getPoseHologram(exercise)} className="h-4/5 object-contain mix-blend-screen group-hover:scale-110 transition-transform" />
                        </div>
                        <h4 className="text-lg font-black text-white italic truncate uppercase">{exercise.title}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{exercise.focus}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExercisePlanner;
