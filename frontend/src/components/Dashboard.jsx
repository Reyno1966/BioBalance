import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, Utensils, Zap, Scale, Loader2 } from 'lucide-react';
import axios from 'axios';

const Dashboard = ({ userData }) => {
    const [loading, setLoading] = React.useState(true);
    const [nutritionData, setNutritionData] = React.useState(null);
    const [weightHistory, setWeightHistory] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, userId would come from auth context
                const userId = '00000000-0000-0000-0000-000000000000'; // Placeholder
                const [nutritionRes, weightRes] = await Promise.all([
                    axios.get(`${API_URL}/api/nutrition/summary/${userId}`),
                    axios.get(`${API_URL}/api/weight/history/${userId}`)
                ]);
                setNutritionData(nutritionRes.data);
                setWeightHistory(weightRes.data.length > 0 ? weightRes.data : [
                    { date: '1 Ene', weight: 95 },
                    { date: '8 Ene', weight: 93.5 },
                    { date: '15 Ene', weight: 92 },
                    { date: '22 Ene', weight: 91.2 },
                    { date: '29 Ene', weight: 89.8 },
                ]);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const macroData = [
        { name: 'Proteínas', value: parseInt(nutritionData?.avg_protein || 30), color: '#22d3ee' },
        { name: 'Carbohidratos', value: parseInt(nutritionData?.avg_carbs || 45), color: '#3b82f6' },
        { name: 'Grasas', value: parseInt(nutritionData?.avg_fat || 25), color: '#818cf8' },
    ];

    const calorieGoal = nutritionData?.calorieGoal || 2200;
    const caloriesConsumed = parseInt(nutritionData?.total_calories || 0);
    const caloriesRemaining = Math.max(0, calorieGoal - caloriesConsumed);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Sincronizando tu BioBalance...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Risk Alert (If High Risk) */}
            {userData?.risk_profile === 'high' && (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center space-x-4">
                    <Activity className="text-red-400 w-6 h-6 shrink-0" />
                    <p className="text-sm text-red-200">
                        <strong>Perfil de Riesgo Detectado:</strong> Tu plan de nutrición ha sido ajustado automáticamente para evitar excesos de sodio y azúcares procesados.
                    </p>
                </div>
            )}

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Calories Card */}
                <div className="bg-glass p-6 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Zap className="w-4 h-4 text-cyan-400" /> Calorías
                        </h3>
                    </div>
                    <div className="relative flex items-center justify-center h-40">
                        <div className="text-center">
                            <span className="text-4xl font-extrabold text-white">{caloriesRemaining}</span>
                            <p className="text-slate-400 text-xs mt-1 font-semibold uppercase">Restantes</p>
                        </div>
                        {/* Progress Ring (Simulated with CSS) */}
                        <svg className="absolute w-full h-full -rotate-90">
                            <circle cx="50%" cy="50%" r="65" className="fill-none stroke-slate-800 stroke-[10]" />
                            <circle
                                cx="50%" cy="50%" r="65"
                                className="fill-none stroke-cyan-500 stroke-[10]"
                                strokeDasharray="408"
                                strokeDashoffset={408 * (1 - caloriesConsumed / calorieGoal)}
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <p className="text-center text-sm text-slate-500">Objetivo: {calorieGoal} kcal</p>
                </div>

                {/* Macros Pie Chart */}
                <div className="bg-glass p-6 rounded-3xl flex flex-col items-center justify-center">
                    <h3 className="font-bold text-slate-400 self-start mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Utensils className="w-4 h-4 text-blue-400" /> Macros (%)
                    </h3>
                    <div className="h-44 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={macroData}
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {macroData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex space-x-4 mt-2">
                        {macroData.map(m => (
                            <div key={m.name} className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Current Weight Card */}
                <div className="bg-glass p-6 rounded-3xl flex flex-col justify-between">
                    <h3 className="font-bold text-slate-400 flex items-center gap-2 text-sm uppercase tracking-wider mb-4">
                        <Scale className="w-4 h-4 text-indigo-400" /> Peso Actual
                    </h3>
                    <div className="text-center flex-1 flex flex-col justify-center">
                        <span className="text-5xl font-black text-white">89.8 <span className="text-xl text-slate-500 font-normal">kg</span></span>
                        <div className="mt-4 inline-flex items-center space-x-1 text-green-400 bg-green-400/10 px-3 py-1 rounded-full mx-auto self-center text-xs font-bold">
                            <span>↓ 5.2 kg perdidos</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest mt-4">Meta: 82 kg</p>
                </div>
            </div>

            {/* Weight Evolution Chart */}
            <div className="bg-glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <Activity className="text-cyan-400" /> Evolución del Peso
                </h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                                domain={['dataMin - 5', 'dataMax + 5']}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '16px' }}
                                itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="#06b6d4"
                                strokeWidth={4}
                                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                                animationDuration={2000}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Meal Plan Preview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Desayuno', 'Almuerzo', 'Cena', 'Snack'].map((meal) => (
                    <div key={meal} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer group">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{meal}</h4>
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                            {meal === 'Desayuno' ? 'Avena con frutos rojos' :
                                meal === 'Almuerzo' ? 'Pechuga a la plancha con quinoa' :
                                    meal === 'Cena' ? 'Salmón con espárragos' : 'Mix de frutos secos'}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-2 block italic">Est. 350-450 kcal</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
