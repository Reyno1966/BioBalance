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
    const [loading, setLoading] = useState(false); // Siempre false para evitar esperas
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
        const focus = (exercise.focus || '').toLowerCase();

        if (title.includes('pistol')) return pistolHolo;
        if (title.includes('burpee')) return burpeeHolo;
        if (title.includes('escalador') || title.includes('climber')) return climberHolo;
        if (title.includes('fondo') || title.includes('dips')) return dipsHolo;
        if (title.includes('arquera') || title.includes('archer')) return archerHolo;
        if (title.includes('oso') || title.includes('bear')) return bearHolo;
        if (title.includes('plancha lateral') || title.includes('side plank')) return sidePlankHolo;
        if (title.includes('pica') || title.includes('pike')) return pikeHolo;
        if (title.includes('zancada de poder') || title.includes('power lunge')) return powerLungeHolo;
        if (title.includes('superman')) return supermanHolo;
        if (title.includes('puente') || title.includes('glute bridge')) return bridgeHolo;
        if (title.includes('wall sit') || title.includes('pared')) return wallSitHolo;
        if (title.includes('diamante') || title.includes('diamond')) return diamondHolo;
        if (title.includes('prisionero') || title.includes('prisoner')) return prisonerHolo;
        if (title.includes('comando') || title.includes('up-down')) return commandoHolo;
        if (title.includes('estocada lateral') || title.includes('lateral lunge')) return lateralLungeHolo;
        if (title.includes('rodilla al pecho') || title.includes('tuck jump')) return tuckJumpHolo;
        if (title.includes('flexión') || title.includes('push')) return pushupHolo;
        if (title.includes('sentadilla') || title.includes('squat') || title.includes('zancada')) return squatHolo;
        if (title.includes('meditación') || title.includes('respiración') || title.includes('zen')) return lotusHolo;

        if (selectedCategory === 'weights') return benchHolo;
        if (selectedCategory === 'zen') return lotusHolo;
        if (title.includes('plancha') || focus.includes('core')) return plankHolo;

        return bioAvatar;
    };

    const exerciseData = {
        bodyweight: [
            { id: 'bw-1', title: 'Sentadilla Pistola (Pistol)', focus: 'Tren Inferior', difficulty: 'Élite', desc: 'Equilibrio y fuerza unimodal.' },
            { id: 'bw-2', title: 'Flexiones Arqueras', focus: 'Pectoral/Tríceps', difficulty: 'Alta', desc: 'Distribución asimétrica de carga.' },
            { id: 'bw-3', title: 'Plancha Lateral con Rotación', focus: 'Core/Oblicuos', difficulty: 'Media', desc: 'Estabilidad rotacional.' },
            { id: 'bw-4', title: 'Hollow Body Rock', focus: 'Core Profundo', difficulty: 'Alta', desc: 'Activación cadena anterior.' },
            { id: 'bw-5', title: 'Burpee con Salto Térmico', focus: 'Cardio-Sistémico', difficulty: 'Máxima', desc: 'Protocolo de alta demanda.' },
            { id: 'bw-6', title: 'Escaladores Cruzados', focus: 'Abdominal/Hombros', difficulty: 'Media', desc: 'Movilidad dinámica.' },
            { id: 'bw-7', title: 'Fondos en Paralelas (Body)', focus: 'Tríceps/Pecho', difficulty: 'Alta', desc: 'Extensión forzada.' },
            { id: 'bw-8', title: 'Paso del Oso (Bear Crawl)', focus: 'Full Body', difficulty: 'Media', desc: 'Coordinación cuadrúpeda.' },
            { id: 'bw-9', title: 'Flexiones en Pica (Pike)', focus: 'Deltoides', difficulty: 'Alta', desc: 'Empuje vertical.' },
            { id: 'bw-10', title: 'Zancadas de Poder (Pliométrico)', focus: 'Tren Inferior', difficulty: 'Máxima', desc: 'Explosividad de fibras IIb.' },
            { id: 'bw-11', title: 'Superman Isométrico', focus: 'Erectores Espinales', difficulty: 'Baja', desc: 'Optimización de postura.' },
            { id: 'bw-12', title: 'Puente de Glúteo Unilateral', focus: 'Glúteo/Isquios', difficulty: 'Media', desc: 'Aislamiento de potencia.' },
            { id: 'bw-13', title: 'Wall Sit con Adducción', focus: 'Cuádriceps', difficulty: 'Media', desc: 'Resistencia isométrica.' },
            { id: 'bw-14', title: 'Abdominales V-Sit (Navaja)', focus: 'Recto Abdominal', difficulty: 'Alta', desc: 'Compresión máxima.' },
            { id: 'bw-15', title: 'Flexiones Diamante', focus: 'Tríceps Braquial', difficulty: 'Media', desc: 'Enfoque biomecánico.' },
            { id: 'bw-16', title: 'Sentadilla de Prisionero', focus: 'Cadena Posterior', difficulty: 'Baja', desc: 'Corrección postural.' },
            { id: 'bw-17', title: 'Plancha Comando (Up-Downs)', focus: 'Hombros/Core', difficulty: 'Alta', desc: 'Transición dinámica.' },
            { id: 'bw-18', title: 'Estocadas Laterales', focus: 'Aductores', difficulty: 'Media', desc: 'Plano frontal.' },
            { id: 'bw-19', title: 'L-Sit Progressions', focus: 'Flexores/Core', difficulty: 'Élite', desc: 'Soporte isométrico.' },
            { id: 'bw-20', title: 'Saltos de Rodilla al Pecho', focus: 'Potencia Explosiva', difficulty: 'Máxima', desc: 'Impacto reactivo.' }
        ],
        weights: [
            { id: 'w-1', title: 'Press de Banca Bio-Force', focus: 'Pectoral Mayor', difficulty: 'Alta', desc: 'Tensión mecánica pura.' },
            { id: 'w-2', title: 'Peso Muerto Rumano', focus: 'Cadena Posterior', difficulty: 'Alta', desc: 'Estiramiento bajo carga.' },
            { id: 'w-3', title: 'Press Militar (Barra)', focus: 'Hombros', difficulty: 'Alta', desc: 'Empuje vertical técnico.' },
            { id: 'w-4', title: 'Sentadilla Frontal (Carga)', focus: 'Cuádriceps', difficulty: 'Élite', desc: 'Estabilidad vertical.' },
            { id: 'w-5', title: 'Remo con Mancuerna', focus: 'Dorsal Ancho', difficulty: 'Media', desc: 'Tracción unilateral.' },
            { id: 'w-6', title: 'Curl Martillo Constante', focus: 'Braquial/Bíceps', difficulty: 'Media', desc: 'Carga de tensión.' },
            { id: 'w-7', title: 'Extensiones Tríceps Trasnuca', focus: 'Tríceps Cabeza Larga', difficulty: 'Media', desc: 'Estiramiento máximo.' },
            { id: 'w-10', title: 'Face Pulls Neuronal', focus: 'Delt. Posterior', difficulty: 'Baja', desc: 'Salud escapular.' },
            { id: 'w-19', title: 'Kettlebell Swings', focus: 'Cadera Explosiva', difficulty: 'Alta', desc: 'Hip drive dinámico.' },
            { id: 'w-20', title: 'Press Francés', focus: 'Tríceps aislados', difficulty: 'Media', desc: 'Flexión técnica.' }
        ],
        zen: [
            { id: 'z-1', title: 'Respiración de Caja 4-4-4', focus: 'Nervio Vago', difficulty: 'Baja', desc: 'Reset del sistema nervioso.' },
            { id: 'z-2', title: 'Coherencia Cardiaca', focus: 'Corazón/Cerebro', difficulty: 'Media', desc: 'Sincronización rítmica.' },
            { id: 'z-3', title: 'Escaneo Corporal REM', focus: 'Recuperación Somática', difficulty: 'Baja', desc: 'Inducción al sueño.' },
            { id: 'z-5', title: 'Yoga Nidra', focus: 'Descanso Celular', difficulty: 'Alta', desc: 'Relajación theta.' },
            { id: 'z-9', title: 'Estiramiento Cobra', focus: 'Cadena Anterior', difficulty: 'Baja', desc: 'Apertura de caja torácica.' },
            { id: 'z-16', title: 'Zen Zazen (Vacío)', focus: 'Silencio Neural', difficulty: 'Élite', desc: 'Mente en no-pensamiento.' }
        ]
    };

    const handleStartSimulation = (exercise) => {
        setActiveExercise(exercise);
        setSimulatorMode(selectedCategory === 'weights' ? 'muscle' : 'duo');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const baseDuration = exercise.id.includes('z') ? 300 : exercise.id.includes('w') ? 90 : 45;
        setTimeLeft(baseDuration);
        setIsActive(true);
    };

    const fetchHistory = async () => {
        try {
            if (user?.uid === 'guest-123') return;
            const response = await axios.get(`${API_URL}/api/exercise/history/${user.uid}`);
            setHistory(response.data);
        } catch (err) {
            console.error("Error fetching history:", err);
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
        <div className="max-w-7xl mx-auto space-y-24 pb-40 px-6 animate-in fade-in duration-1000">
            {/* Professional 3D Simulator HUD */}
            <div className="relative h-[700px] w-full bg-slate-950/60 rounded-[5rem] border-2 border-cyan-500/20 overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />

                <div className="absolute top-12 left-12 z-30 space-y-4">
                    <div className="bg-slate-900/80 backdrop-blur-3xl p-5 border border-white/10 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-2xl"><Cpu className="w-6 h-6 text-cyan-400" /></div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sistema Bio-Sync</p>
                            <h4 className="text-white font-black text-xs uppercase italic">Hologram_ACTIVE</h4>
                        </div>
                    </div>
                </div>

                {/* Main Visualizer */}
                <div className="absolute inset-0 flex items-center justify-center p-20 z-10">
                    <div className="relative h-full w-full flex items-center justify-center">
                        <div className="absolute bottom-0 w-[800px] h-32 bg-cyan-500/10 blur-[100px] rounded-full" />
                        <img
                            src={getPoseHologram(activeExercise)}
                            alt="Hologram"
                            className="h-full object-contain mix-blend-screen animate-in zoom-in duration-700 drop-shadow-[0_0_50px_rgba(6,182,212,0.4)]"
                        />
                    </div>
                </div>

                {/* HUD Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-slate-950 to-transparent z-40">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-12">
                        <div className="flex items-center gap-8">
                            <button onClick={() => setIsActive(!isActive)} className="p-6 bg-cyan-600 rounded-[2.5rem] shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                                {isActive ? <Pause className="w-10 h-10 text-slate-950 fill-current" /> : <Play className="w-10 h-10 text-slate-950 fill-current" />}
                            </button>
                            <div>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter truncate max-w-[250px]">
                                    {activeExercise?.title || 'ESCANEO PENDIENTE'}
                                </h3>
                                <p className="text-cyan-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-1">Status: Ready</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Reloj Bio-Cronometrado</p>
                            <div className="text-6xl font-mono font-black text-white leading-none tracking-tighter">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex justify-end gap-5">
                            <button onClick={() => setTimeLeft(prev => prev + 30)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase">+30s</button>
                            <button onClick={() => setTimeLeft(0)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase">Terminar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Library Section */}
            <div className="space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Bio-Library</h2>
                        <div className="flex bg-slate-900/60 p-2 rounded-[3.5rem] border border-white/10 gap-2">
                            {['bodyweight', 'weights', 'zen'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-cyan-600 text-white' : 'text-slate-500'}`}
                                >
                                    {cat === 'bodyweight' ? 'Sin Pesas' : cat === 'weights' ? 'Con Pesas' : 'Zen'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {exerciseData[selectedCategory].map((exercise) => (
                        <div
                            key={exercise.id}
                            onClick={() => handleStartSimulation(exercise)}
                            className={`p-6 bg-slate-900/40 rounded-[3.5rem] border-2 transition-all cursor-pointer group ${activeExercise?.id === exercise.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5'}`}
                        >
                            <div className="aspect-square bg-slate-950/50 rounded-[2.5rem] overflow-hidden mb-6 flex items-center justify-center">
                                <img src={getPoseHologram(exercise)} className="h-4/5 object-contain mix-blend-screen group-hover:scale-110 transition-transform" />
                            </div>
                            <h4 className="text-xl font-black text-white italic uppercase">{exercise.title}</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{exercise.focus}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExercisePlanner;
