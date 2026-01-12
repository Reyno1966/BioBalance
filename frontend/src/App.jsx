import React, { useState } from 'react';
import MedicalForm from './components/MedicalForm';
import ImageProcessor from './components/ImageProcessor';
import Dashboard from './components/Dashboard';
import EmotionalDiary from './components/EmotionalDiary';
import Pricing from './components/Pricing';
import AuthForms from './components/AuthForms';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

function AppContent() {
    const { user, logout } = useAuth();
    const [step, setStep] = useState('onboarding');
    const [view, setView] = useState('dashboard');
    const [isPremium, setIsPremium] = useState(false);
    const [userData, setUserData] = useState(null);

    const handleMedicalSubmit = async (data) => {
        setUserData(data);
        setStep('tracker');
    };

    const handlePurchase = (premium) => {
        setIsPremium(premium);
        setView('dashboard');
    };

    if (!user) {
        return <AuthForms />;
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <header className="py-6 px-10 flex justify-between items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <h1 className="text-3xl font-black tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                        BioBalance
                    </span>
                </h1>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5">
                        <UserIcon className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-bold text-slate-200">{user.displayName || user.email}</span>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="p-2 hover:bg-red-500/10 rounded-full text-slate-500 hover:text-red-400 transition-all"
                        title="Cerrar Sesión"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 mt-8">
                {step === 'onboarding' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <MedicalForm onSubmit={handleMedicalSubmit} />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12">
                        {/* Navigation Tabs */}
                        <div className="flex justify-center space-x-4 mb-8">
                            {['dashboard', 'tracker', 'health', 'pricing'].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={`px-8 py-3 rounded-full font-bold transition-all text-sm uppercase tracking-widest ${view === v
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-900/40 scale-105'
                                            : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                        }`}
                                >
                                    {v === 'dashboard' ? 'Panel' : v === 'tracker' ? 'Progreso' : v === 'health' ? 'Mente' : 'Premium'}
                                </button>
                            ))}
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

                        <section className="text-center py-12">
                            <p className="text-slate-600 italic text-sm">"Tu salud es la mejor inversión."</p>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
