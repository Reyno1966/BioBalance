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
    const [loading, setLoading] = useState(false); // Cambiado a false para evitar pantallas blancas
    const [activeExercise, setActiveExercise] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [completedExercises, setCompletedExercises] = useState([]);
    const [saving, setSaving] = useState(false);
    const [simulatorMode, setSimulatorMode] = useState('duo');
    const [selectedCategory, setSelectedCategory] = useState('bodyweight');

    // Helper to get the correct hologram based on exercise title and metadata
    const getPoseHologram = (exercise) => {
        if (!exercise) return bioAvatar;
        const title = (exercise.title || '').toLowerCase();
        const focus = (exercise.focus || '').toLowerCase();

        // 1. Title Based Logic
        if (title.includes('pistol') || (title.includes('sentadilla') && title.includes('pistola'))) return pistolHolo;
        if (title.includes('burpee')) return burpeeHolo;
        if (title.includes('escalador') || title.includes('climber')) return climberHolo;
        if (title.includes('fondo') || title.includes('dips')) return dipsHolo;
        if (title.includes('arquera') || title.includes('archer')) return archerHolo;
        if (title.includes('oso') || title.includes('bear')) return bearHolo;
        if (title.includes('plancha lateral') || title.includes('side plank')) return sidePlankHolo;
        if (title.includes('pica') || title.includes('pike')) return pikeHolo;
        if (title.includes('zancada de poder') || title.includes('power lunge') || title.includes('pliométrico') || title.includes('pliometrico')) return powerLungeHolo;
        if (title.includes('superman')) return supermanHolo;
        if (title.includes('puente') || title.includes('glute bridge')) return bridgeHolo;
        if (title.includes('wall sit') || title.includes('pared') || title.includes('adducción')) return wallSitHolo;
        if (title.includes('diamante') || title.includes('diamond')) return diamondHolo;
        if (title.includes('prisionero') || title.includes('prisoner')) return prisonerHolo;
        if (title.includes('comando') || title.includes('up-down')) return commandoHolo;
        if (title.includes('estocada lateral') || title.includes('lateral lunge')) return lateralLungeHolo;
        if (title.includes('rodilla al pecho') || title.includes('tuck jump')) return tuckJumpHolo;
        if (title.includes('flexión') || title.includes('push')) return pushupHolo;
        if (title.includes('sentadilla') || title.includes('squat') || title.includes('zancada') || title.includes('estocada')) return squatHolo;

        // ONLY allow weights hologram if NOT in bodyweight category
        if (selectedCategory !== 'bodyweight') {
            if (title.includes('press') || title.includes('banca') || title.includes('militar') || title.includes('arnold')) return benchHolo;
            if (title.includes('peso muerto') || title.includes('swing') || title.includes('remo') || title.includes('curl') || title.includes('rack')) return benchHolo;
        }

        if (title.includes('meditación') || title.includes('respiración') || title.includes('nidra') || title.includes('zen') || title.includes('coherencia')) return lotusHolo;
        if (title.includes('burpee') || title.includes('salto') || title.includes('sprint') || title.includes('climber') || title.includes('running')) return sprintHolo;
        if (title.includes('estiramiento') || title.includes('cobra') || title.includes('yoga') || title.includes('flexibilidad') || title.includes('movilidad')) return cobraHolo;

        // Bodyweight Specific Postures
        if (title.includes('hollow body') || title.includes('hollow rock')) return hollowHolo;
        if (title.includes('v-sit') || title.includes('navaja')) return navajaHolo;
        if (title.includes('plancha') || title.includes('core') || title.includes('abdominal') || title.includes('hollow')) return plankHolo;
        if (title.includes('l-sit') || title.includes('compresión')) return lsitHolo;
        if (title.includes('fondo') || title.includes('arquera')) return pushupHolo;

        // 2. Focus Based Logic (Fallbacks)
        if (focus.includes('core') || focus.includes('abdominal')) return plankHolo;
        if (focus.includes('inferior') || focus.includes('pierna') || focus.includes('glúteo')) return squatHolo;
        if (focus.includes('mente') || focus.includes('nervio') || focus.includes('sueño')) return lotusHolo;
        if (focus.includes('explosiva') || focus.includes('cardio') || focus.includes('agilidad')) return sprintHolo;

        // 3. Category fallbacks
        if (selectedCategory === 'zen') return lotusHolo;
        if (selectedCategory === 'weights') return benchHolo;
        if (selectedCategory === 'bodyweight') return pushupHolo;

        return sprintHolo;
    };

    const exerciseData = {
        bodyweight: [
            { id: 'bw-1', title: 'Sentadilla Pistola (Pistol)', focus: 'Tren Inferior', difficulty: 'Élite', desc: 'Sincronización de equilibrio y fuerza unimodal.' },
            { id: 'bw-2', title: 'Flexiones Arqueras', focus: 'Pectoral/Tríceps', difficulty: 'Alta', desc: 'Distribución asimétrica de carga para hipertrofia.' },
            { id: 'bw-3', title: 'Plancha Lateral con Rotación', focus: 'Core/Oblicuos', difficulty: 'Media', desc: 'Estabilidad rotacional del núcleo central.' },
            { id: 'bw-4', title: 'Hollow Body Rock', focus: 'Core Profundo', difficulty: 'Alta', desc: 'Activación de la cadena cinética anterior.' },
            { id: 'bw-5', title: 'Burpee con Salto Térmico', focus: 'Cardio-Sistémico', difficulty: 'Máxima', desc: 'Protocolo de alta demanda metabólica.' },
            { id: 'bw-6', title: 'Escaladores Cruzados', focus: 'Abdominal/Hombros', difficulty: 'Media', desc: 'Movilidad dinámica de cadera y hombro.' },
            { id: 'bw-7', title: 'Fondos en Paralelas (Body)', focus: 'Tríceps/Pecho', difficulty: 'Alta', desc: 'Extensión forzada de codo por autocarga.' },
            { id: 'bw-8', title: 'Paso del Oso (Bear Crawl)', focus: 'Full Body', difficulty: 'Media', desc: 'Coordinación cuadrúpeda y control motor.' },
            { id: 'bw-9', title: 'Flexiones en Pica (Pike)', focus: 'Deltoides', difficulty: 'Alta', desc: 'Preparación para el empuje vertical.' },
            { id: 'bw-10', title: 'Zancadas de Poder (Pliométrico)', focus: 'Tren Inferior', difficulty: 'Máxima', desc: 'Explosividad de fibras tipo IIb.' },
            { id: 'bw-11', title: 'Vuelo de Superman Isométrico', focus: 'Erectores Espinales', difficulty: 'Baja', desc: 'Optimización de la postura y cadena posterior.' },
            { id: 'bw-12', title: 'Puente de Glúteo Unilateral', focus: 'Glúteo/Isquios', difficulty: 'Media', desc: 'Aislamiento de potencia pélvica.' },
            { id: 'bw-13', title: 'Wall Sit con Adducción', focus: 'Cuádriceps', difficulty: 'Media', desc: 'Resistencia isométrica prolongada.' },
            { id: 'bw-14', title: 'Abdominales V-Sit (Navaja)', focus: 'Recto Abdominal', difficulty: 'Alta', desc: 'Compresión máxima del segmento medio.' },
            { id: 'bw-15', title: 'Flexiones Diamante', focus: 'Tríceps Braquial', difficulty: 'Media', desc: 'Enfoque biomecánico en extensión de brazo.' },
            { id: 'bw-16', title: 'Sentadilla de Prisionero', focus: 'Cadena Posterior', difficulty: 'Baja', desc: 'Corrección postural mediante flexión de rodilla.' },
            { id: 'bw-17', title: 'Plancha Comando (Up-Downs)', focus: 'Hombros/Core', difficulty: 'Alta', desc: 'Transición dinámica de estabilidad.' },
            { id: 'bw-18', title: 'Estocadas Laterales', focus: 'Aductores', difficulty: 'Media', desc: 'Mejora del plano frontal de movimiento.' },
            { id: 'bw-19', title: 'L-Sit Progressions', focus: 'Flexores/Core', difficulty: 'Élite', desc: 'Soporte isométrico de alta tensión abdominal.' },
            { id: 'bw-20', title: 'Saltos de Rodilla al Pecho', focus: 'Potencia Explosiva', difficulty: 'Máxima', desc: 'Impacto reactivo biocinético.' }
        ],
        weights: [
            { id: 'w-1', title: 'Press de Banca Bio-Force', focus: 'Pectoral Mayor', difficulty: 'Alta', desc: 'Tensión mecánica para desarrollo de fuerza pura.' },
            { id: 'w-2', title: 'Peso Muerto Rumano', focus: 'Cadena Posterior', difficulty: 'Alta', desc: 'Estiramiento bajo carga de isquiotibiales.' },
            { id: 'w-3', title: 'Press Militar (Barra)', focus: 'Hombros/Deltoides', difficulty: 'Alta', desc: 'Empuje vertical técnico multiarticular.' },
            { id: 'w-4', title: 'Sentadilla Frontal (Carga)', focus: 'Cuádriceps', difficulty: 'Élite', desc: 'Estabilidad vertical con centro de base adelantado.' },
            { id: 'w-5', title: 'Remo con Mancuerna (SA)', focus: 'Dorsal Ancho', difficulty: 'Media', desc: 'Tracción unilateral para simetría muscular.' },
            { id: 'w-6', title: 'Curl Martillo Constante', focus: 'Braquial/Bíceps', difficulty: 'Media', desc: 'Carga de tensión prolongada en flexores.' },
            { id: 'w-7', title: 'Extensiones Tríceps Trasnuca', focus: 'Cabeza Larga Tríceps', difficulty: 'Media', desc: 'Estiramiento máximo de la fibra braquial.' },
            { id: 'w-8', title: 'Press Inclinado (Mancuernas)', focus: 'Haz Clavicular Pecho', difficulty: 'Alta', desc: 'Optimización del ángulo de empuje superior.' },
            { id: 'w-9', title: 'Goblet Squat Profunda', focus: 'Tren Inferior Full', difficulty: 'Media', desc: 'Apertura de cadera mediante contrapeso vital.' },
            { id: 'w-10', title: 'Face Pulls Neuronal', focus: 'Deltoides posterior', difficulty: 'Baja', desc: 'Salud escapular y corrección postural interna.' },
            { id: 'w-11', title: 'Zancadas en Rack Frontal', focus: 'Glúteo/Piernas', difficulty: 'Alta', desc: 'Inestabilidad controlada con carga anterior.' },
            { id: 'w-12', title: 'Thrusters Metabólicos', focus: 'Poder Total', difficulty: 'Máxima', desc: 'Sincronización de empuje y tracción sistémica.' },
            { id: 'w-13', title: 'Press Arnold Rotacional', focus: 'Hombro 360', difficulty: 'Alta', desc: 'Recorrido completo del deltoides.' },
            { id: 'w-14', title: 'Remo al Mentón (Pesas)', focus: 'Trapecio/Hombro', difficulty: 'Media', desc: 'Tracción vertical para densidad superior.' },
            { id: 'w-15', title: 'Buenos Días (Carga Ligera)', focus: 'Lumbar/Isquios', difficulty: 'Media', desc: 'Bisagra de cadera reforzada mediante carga.' },
            { id: 'w-16', title: 'Clean & Press Técnico', focus: 'Hombros/Cadera', difficulty: 'Élite', desc: 'Movimiento olímpico adaptado a bio-mecánica.' },
            { id: 'w-17', title: 'Aperturas Laterales (Flyes)', focus: 'Deltoide Lateral', difficulty: 'Baja', desc: 'Aislamiento de la silueta en V.' },
            { id: 'w-18', title: 'Curl de Bíceps Axial', focus: 'Bíceps Braquial', difficulty: 'Media', desc: 'Supinación forzada para pico de contracción.' },
            { id: 'w-19', title: 'Kettlebell Swings (Hip Drive)', focus: 'Cadera Explosiva', difficulty: 'Alta', desc: 'Generación de poder desde la bisagra pélvica.' },
            { id: 'w-20', title: 'Press Francés con Barra', focus: 'Tríceps aislados', difficulty: 'Media', desc: 'Flexión de codo técnica en banco plano.' }
        ],
        zen: [
            { id: 'z-1', title: 'Respiración de Caja 4-4-4', focus: 'Nervio Vago', difficulty: 'Baja', desc: 'Reset del sistema nervioso central instantáneo.' },
            { id: 'z-2', title: 'Coherencia Cardiaca 0.1Hz', focus: 'Corazón/Cerebro', difficulty: 'Media', desc: 'Sincronización del ritmo sinusal con ondas alfa.' },
            { id: 'z-3', title: 'Escaneo Corporal REM', focus: 'Recuperación Somática', difficulty: 'Baja', desc: 'Preparación para el sueño profundo por inducción.' },
            { id: 'z-4', title: 'Meditación Trataka (Vela)', focus: 'Foco Visual', difficulty: 'Media', desc: 'Entrenamiento de atención plena mediante fijación.' },
            { id: 'z-5', title: 'Yoga Nidra (Sueño Psíquico)', focus: 'Descanso Celular', difficulty: 'Alta', desc: 'Entrado en estado de relajación theta consciente.' },
            { id: 'z-6', title: 'Pranayama Nadi Shodhana', focus: 'Balance Hemisférico', difficulty: 'Media', desc: 'Equilibrio de flujo de aire y energía cerebral.' },
            { id: 'z-7', title: 'Yoga Gato-Vaca Dinámico', focus: 'Flexibilidad Espinal', difficulty: 'Baja', desc: 'Movilidad de la columna y descompresión discal.' },
            { id: 'z-8', title: 'Mindfulness de 5 Sentidos', focus: 'Presencia Absoluta', difficulty: 'Baja', desc: 'Anclaje al momento presente para reducir ansiedad.' },
            { id: 'z-9', title: 'Estiramiento Cobra (Fascia)', focus: 'Cadena Anterior', difficulty: 'Baja', desc: 'Apertura de caja torácica y plexo solar.' },
            { id: 'z-10', title: 'Vipassana (Observación)', focus: 'Ecuanimidad', difficulty: 'Alta', desc: 'Observación desapegada de sensaciones físicas.' },
            { id: 'z-11', title: 'Respiración de Fuego (Tummo)', focus: 'Energía Vital', difficulty: 'Alta', desc: 'Protocolo de hiperoxigenación controlada.' },
            { id: 'z-12', title: 'Meditación de Gratitud', focus: 'Neuroquímica Dopamina', difficulty: 'Baja', desc: 'Reconfiguración de redes de pensamiento positivo.' },
            { id: 'z-13', title: 'Relajación Jacobon', focus: 'Músculos Profundos', difficulty: 'Media', desc: 'Tensión-relajación sistemática para soltar carga.' },
            { id: 'z-14', title: 'Visualización de Éxito', focus: 'Córtex Prefrontal', difficulty: 'Baja', desc: 'Pre-activación de redes neuronales de logro.' },
            { id: 'z-15', title: 'Yoga Guerrero I (Fuerza)', focus: 'Propiocepción', difficulty: 'Media', desc: 'Conexión tierra y estabilidad de base biológica.' },
            { id: 'z-16', title: 'Zen Zazen (Vacío)', focus: 'Silencio Neural', difficulty: 'Élite', desc: 'Mantener la mente en el no-pensamiento absoluto.' },
            { id: 'z-17', title: 'Estiramiento Isquio (Infinito)', focus: 'Movilidad Posterior', difficulty: 'Baja', desc: 'Alargamiento de fascias en la cadena inferior.' },
            { id: 'z-18', title: 'Sonidos Binaurales Guía', focus: 'Ondas Cerebrales', difficulty: 'Baja', desc: 'Sincronización bio-auditiva para meditación.' },
            { id: 'z-19', title: 'Pausa de Coherencia', focus: 'Estrés Basal', difficulty: 'Baja', desc: 'Micro-meditación para momentos de alta demanda.' },
            { id: 'z-20', title: 'Cierre Ciclo Circadiano', focus: 'Melatonina', difficulty: 'Media', desc: 'Protocolo final de día para biohacking de sueño.' }
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
            if (user?.uid === 'guest-123') {
                setHistory([
                    { id: 1, title: 'Sentadilla Pistola', duration: '45 seg', calories: 15, recorded_at: new Date(Date.now() - 86400000).toISOString() },
                    { id: 2, title: 'Press de Banca Bio-Force', duration: '12 Reps', calories: 45, recorded_at: new Date(Date.now() - 172800000).toISOString() }
                ]);
            } else {
                const response = await axios.get(`${API_URL}/api/exercise/history/${user.uid}`);
                setHistory(response.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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

    const toggleComplete = async (exercise) => {
        if (completedExercises.includes(exercise.id)) return;
        setSaving(true);
        try {
            if (user?.uid !== 'guest-123') {
                await axios.post(`${API_URL}/api/exercise/log`, {
                    userId: user.uid,
                    exerciseId: exercise.id,
                    title: exercise.title,
                    duration: '5 min',
                    calories: 30
                });
            }
            setCompletedExercises(prev => [...prev, exercise.id]);
            fetchHistory();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <Loader2 className="w-16 h-16 text-cyan-500 animate-spin" />
                <p className="text-cyan-500/60 font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">Iniciando Red Neuronal de Entrenamiento...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-24 pb-40 px-6 animate-in fade-in duration-1000">
            {/* Professional 3D Simulator */}
            <div className="relative h-[700px] w-full bg-slate-950/60 rounded-[5rem] border-2 border-cyan-500/20 overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />

                {/* HUD Elements */}
                <div className="absolute top-12 left-12 z-30 space-y-4">
                    <div className="bg-slate-900/80 backdrop-blur-3xl p-5 border border-white/10 rounded-3xl flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-2xl">
                            <Cpu className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Estado del Sistema</p>
                            <h4 className="text-white font-black text-xs uppercase italic">Pose_Recognition_Active</h4>
                        </div>
                    </div>
                </div>

                {/* Main Simulator Image - DYNAMIC POSES */}
                <div className="absolute inset-0 flex items-center justify-center p-20 z-10">
                    <div className="relative h-full w-full flex items-center justify-center">
                        <div className="absolute bottom-0 w-[800px] h-32 bg-cyan-500/10 blur-[100px] rounded-full" />
                        <img
                            src={getPoseHologram(activeExercise)}
                            alt="Holographic Trainer"
                            className="h-full object-contain mix-blend-screen animate-in zoom-in duration-700 drop-shadow-[0_0_50px_rgba(6,182,212,0.4)]"
                        />
                    </div>
                </div>

                {/* Simulator Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-slate-950 to-transparent z-40">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-12">
                        <div className="flex items-center gap-8">
                            <div className="p-6 bg-cyan-600 rounded-[2.5rem] shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                                <Play className="w-10 h-10 text-slate-950 fill-current" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white italic leading-tight uppercase tracking-tighter">
                                    {activeExercise?.title || 'Selección Pendiente'}
                                </h3>
                                <p className="text-cyan-500/60 font-black text-[10px] uppercase tracking-[0.4em] mt-1">
                                    Pose: {activeExercise ? activeExercise.title.split(' ')[0] : 'Scanning...'}
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Temporizador de Tensión</p>
                            <div className="text-6xl font-mono font-black text-white leading-none tracking-tighter inline-flex items-center gap-4">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex justify-end gap-5">
                            <button onClick={() => setIsActive(!isActive)} className="p-6 bg-white/5 hover:bg-cyan-500/10 border-2 border-white/10 hover:border-cyan-500/50 rounded-3xl transition-all">
                                {isActive ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expansive and Diverse Library */}
            <div className="space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-1 bg-cyan-500 rounded-full" />
                            <span className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.5em]">Laboratorio de Optimización</span>
                        </div>
                        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                            Bio-Library <span className="text-cyan-500">Global</span>
                        </h2>
                    </div>

                    <div className="bg-slate-900/60 p-2 rounded-[3.5rem] border border-white/10 flex flex-wrap gap-2 shadow-2xl">
                        {[
                            { id: 'bodyweight', label: 'Cuerpo (Sin Pesas)', icon: Move },
                            { id: 'weights', label: 'Carga (Con Pesas)', icon: Dumbbell },
                            { id: 'zen', label: 'Zen (Mente)', icon: Brain }
                        ].map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${selectedCategory === cat.id
                                    ? 'bg-cyan-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-105'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {exerciseData[selectedCategory].map((exercise) => (
                        <div
                            key={exercise.id}
                            onClick={() => handleStartSimulation(exercise)}
                            className={`group relative bg-slate-900/40 p-1 rounded-[3.5rem] border-2 transition-all duration-700 cursor-pointer overflow-hidden ${activeExercise?.id === exercise.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/5 hover:border-white/20'
                                }`}
                        >
                            <div className="p-8 space-y-6">
                                <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white/10 bg-slate-950/50">
                                    <img
                                        src={getPoseHologram(exercise)}
                                        className="w-full h-full object-contain grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 mix-blend-screen"
                                        alt={exercise.title}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest border backdrop-blur-md ${exercise.difficulty === 'Élite' ? 'bg-rose-500 text-white' : 'bg-cyan-500/20 text-cyan-400'
                                            }`}>
                                            {exercise.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-cyan-400 transition-colors">
                                        {exercise.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase">{exercise.focus}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExercisePlanner;
