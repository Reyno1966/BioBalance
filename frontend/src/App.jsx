import React, { useState } from 'react';
import MedicalForm from './components/MedicalForm';
import ImageProcessor from './components/ImageProcessor';
import Dashboard from './components/Dashboard';
import EmotionalDiary from './components/EmotionalDiary';
import Pricing from './components/Pricing';

function App() {
    const [step, setStep] = useState('onboarding');
    const [view, setView] = useState('pricing'); // Changed to pricing for demo
    const [isPremium, setIsPremium] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleMedicalSubmit = async (data) => {
        try {
            // ... API call logic ...
            setUserData(data);
            setStep('tracker');
            setView('pricing'); // Show pricing after onboarding
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePurchase = (premium) => {
        setIsPremium(premium);
        setView('dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <header className="py-10 text-center">
                <h1 className="text-5xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        BioBalance
                    </span>
                </h1>
                <p className="mt-4 text-slate-400 max-w-lg mx-auto">
                    Tu camino hacia el equilibrio físico y mental.
                </p>
            </header>

            <main className="container mx-auto px-4">
                {step === 'onboarding' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <MedicalForm onSubmit={handleMedicalSubmit} />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12">
                        <div className="bg-cyan-900/10 border border-cyan-500/20 p-6 rounded-2xl max-w-4xl mx-auto flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-cyan-400">Bienvenido de nuevo</h3>
                                <p className="text-slate-400 text-sm">Tu perfil de riesgo es:
                                    <span className={`ml-2 font-mono ${userData?.riskProfile === 'high' ? 'text-red-400' : 'text-green-400'}`}>
                                        {userData?.riskProfile?.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={() => setStep('onboarding')}
                                className="text-xs hover:text-cyan-400 transition-colors uppercase tracking-widest font-bold"
                            >
                                Volver al perfil
                            </button>
                        </div>

                        <div className="flex justify-center space-x-4 mb-8">
                            <button
                                onClick={() => setView('dashboard')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'dashboard' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setView('tracker')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'tracker' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Comparativa
                            </button>
                            <button
                                onClick={() => setView('health')}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${view === 'health' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Salud Mental
                            </button>
                        </div>

                        {view === 'pricing' ? (
                            <Pricing onPurchase={handlePurchase} />
                        ) : view === 'dashboard' ? (
                            <Dashboard userData={userData} isPremium={isPremium} />
                        ) : view === 'tracker' ? (
                            <ImageProcessor initialWeight={95} currentWeight={89.8} isPremium={isPremium} />
                        ) : (
                            <EmotionalDiary onSubmit={(data) => console.log('Mood Entry:', data)} />
                        )}

                        <section className="max-w-4xl mx-auto text-center py-12">
                            <p className="text-slate-500 italic">"La constancia es la llave del éxito."</p>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
