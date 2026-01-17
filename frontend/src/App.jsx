import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import API_URL from './config';
import MedicalForm from './components/MedicalForm';
import ImageProcessor from './components/ImageProcessor';
import FoodAnalyzer from './components/FoodAnalyzer';
import ExercisePlanner from './components/ExercisePlanner';
import WellnessChat from './components/WellnessChat';
import Challenges from './components/Challenges';
import CommunityRanking from './components/CommunityRanking';
import RecipeExplorer from './components/RecipeExplorer';
import RecoveryTracker from './components/RecoveryTracker';
import Marketplace from './components/Marketplace';
import BioAcademy from './components/BioAcademy';
import NotificationSystem from './components/NotificationSystem';




import Dashboard from './components/Dashboard';



import MindCenter from './components/MindCenter';
import Pricing from './components/Pricing';
import AuthForms from './components/AuthForms';
import LandingView from './components/LandingView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, User as UserIcon, Lock } from 'lucide-react';
import AIAssistantBubble from './components/AIAssistantBubble';

function AppContent() {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation();
    const [guestUser, setGuestUser] = useState(null);
    const [step, setStep] = useState('onboarding');
    const [view, setView] = useState('dashboard');
    const [isPremium, setIsPremium] = useState(false);
    const [userData, setUserData] = useState(null);

    React.useEffect(() => {
        const checkExistingData = async () => {
            if (user && !guestUser) {
                try {
                    const res = await axios.get(`${API_URL}/api/user/profile/${user.uid}`);
                    if (res.data) {
                        setUserData(res.data);
                        setIsPremium(res.data.is_premium || false);
                        if (res.data.level > 1 || res.data.points > 0) {
                            setStep('tracker');
                        }
                    }

                    // Check for Stripe session success
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.get('session_id')) {
                        setIsPremium(true);
                        // Clear the URL
                        window.history.replaceState({}, document.title, "/dashboard");
                        // We could also call the backend to verify, but the webhook usually handles this.
                        // Force a refresh of profile data to be sure
                        const updatedRes = await axios.get(`${API_URL}/api/user/profile/${user.uid}`);
                        setIsPremium(updatedRes.data.is_premium || true);
                    }
                } catch (err) {
                    console.error("Error checking user status:", err);
                }
            }
        };
        checkExistingData();
    }, [user, guestUser]);

    const handleMedicalSubmit = async (data) => {
        setUserData(data);
        setStep('tracker');
    };

    const handlePurchase = (premium) => {
        setIsPremium(premium);
        setView('dashboard');
    };

    const handleGuestLogin = () => {
        setGuestUser({
            uid: 'guest-123',
            displayName: 'Usuario Invitado',
            email: 'invitado@biobalance.ai'
        });
        setIsPremium(true); // Enable full access for demo mode
        setStep('tracker'); // Bypass onboarding for demo
    };

    const isPremiumFeature = (viewId) => {
        const premiumFeatures = ['chat', 'recipes', 'academy', 'market', 'health', 'ranking'];
        return !isPremium && premiumFeatures.includes(viewId);
    };

    const handleViewChange = (newView) => {
        if (isPremiumFeature(newView)) {
            alert("Este es un canal de Bio-Acceso Premium. ¡Sincroniza tu cuenta para desbloquearlo!");
            setView('pricing');
        } else {
            setView(newView);
        }
    };

    const handleLogout = () => {
        if (guestUser) {
            setGuestUser(null);
            setIsPremium(false);
            setStep('onboarding'); // Reset step on logout
        } else {
            logout();
        }
    };

    const activeUser = user || guestUser;

    if (!activeUser) {
        return <LandingView onGuestLogin={handleGuestLogin} />;
    }

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <header className="py-3 md:py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 gap-2 md:gap-4">
                <div className="flex justify-between items-center w-full md:w-auto">
                    <h1 className="text-xl md:text-3xl font-black tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                            BioBalance
                        </span>
                    </h1>

                    {/* Mobile Logout (only visible on mobile) */}
                    <button
                        onClick={handleLogout}
                        className="md:hidden p-1.5 hover:bg-red-500/10 rounded-full text-slate-500"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex items-center space-x-3 md:space-x-6 w-full md:w-auto justify-between md:justify-end">
                    {/* Language Switcher */}
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5 gap-0.5 md:gap-1 max-w-[140px] md:max-w-[200px] overflow-x-auto no-scrollbar-mobile">
                        {['es', 'en', 'it', 'pt', 'de', 'fr', 'ar', 'ru', 'zh', 'ja', 'ko'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => i18n.changeLanguage(lang)}
                                className={`px-1.5 py-0.5 text-[7px] md:px-2.5 md:py-1 md:text-[9px] font-black rounded-md md:rounded-lg transition-all uppercase shrink-0 ${i18n.language.startsWith(lang)
                                    ? 'bg-cyan-500 text-slate-950'
                                    : 'text-slate-500'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/5">
                            <UserIcon className="w-3 h-3 md:w-4 md:h-4 text-cyan-400" />
                            <span className="text-[10px] md:text-sm font-bold text-slate-200 truncate max-w-[100px] md:max-w-none">
                                {activeUser.displayName || activeUser.email?.split('@')[0]}
                            </span>
                        </div>
                        {/* Desktop Logout */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:block p-2 hover:bg-red-500/10 rounded-full text-slate-500 hover:text-red-400 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 mt-8">
                {step === 'onboarding' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <MedicalForm onSubmit={handleMedicalSubmit} user={activeUser} />
                    </div>

                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12">
                        {/* Navigation Tabs - STICKY Below Header */}
                        <div className="sticky top-[135px] md:top-[90px] z-40 bg-slate-950/95 backdrop-blur-xl py-6 border-b border-white/10">
                            <div className="flex justify-start md:justify-center overflow-x-auto gap-4 px-10 no-scrollbar-mobile scroll-smooth">
                                {[
                                    { id: 'dashboard', label: t('common.dashboard') },
                                    { id: 'food', label: t('common.nutrition') },
                                    { id: 'exercise', label: t('common.exercise') },
                                    { id: 'challenges', label: t('common.challenges') },
                                    { id: 'recipes', label: t('common.recipes') },
                                    { id: 'academy', label: t('common.academy') },
                                    { id: 'chat', label: t('common.chat') },
                                    { id: 'recovery', label: t('common.sleep') },
                                    { id: 'health', label: t('common.mind') },
                                    { id: 'ranking', label: t('common.community') },
                                    { id: 'market', label: t('common.market') },
                                    { id: 'pricing', label: t('common.premium') }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleViewChange(tab.id)}
                                        className={`px-6 py-3 rounded-full font-black transition-all text-[10px] md:text-[11px] uppercase tracking-[0.2em] shrink-0 border ${view === tab.id
                                            ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105'
                                            : 'bg-slate-900 text-slate-400 hover:text-white border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {tab.label}
                                            {['chat', 'recipes', 'academy', 'market', 'health', 'ranking'].includes(tab.id) && !isPremium && (
                                                <Lock className="w-2.5 h-2.5 text-cyan-500/50" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {view === 'pricing' ? (
                            <Pricing onPurchase={handlePurchase} />
                        ) : view === 'dashboard' ? (
                            <Dashboard user={activeUser} userData={userData} isPremium={isPremium} />
                        ) : view === 'food' ? (
                            <FoodAnalyzer user={activeUser} />
                        ) : view === 'exercise' ? (
                            <ExercisePlanner user={activeUser} />
                        ) : view === 'challenges' ? (
                            <Challenges user={activeUser} />
                        ) : view === 'recipes' ? (
                            <RecipeExplorer user={activeUser} />
                        ) : view === 'academy' ? (
                            <BioAcademy user={activeUser} />
                        ) : view === 'chat' ? (
                            <WellnessChat user={activeUser} />
                        ) : view === 'recovery' ? (
                            <RecoveryTracker user={activeUser} />
                        ) : view === 'health' ? (
                            <MindCenter user={activeUser} />
                        ) : view === 'ranking' ? (
                            <CommunityRanking currentUser={activeUser} />
                        ) : view === 'market' ? (
                            <Marketplace user={activeUser} />
                        ) : (
                            <div className="text-center py-20 text-slate-500">Vista no encontrada</div>
                        )}


                        <section className="text-center py-12">
                            <p className="text-slate-600 italic text-sm">{t('common.health_investment')}</p>
                        </section>
                    </div>
                )}
            </main>

            {/* Dynamic AI Expert Bubble */}
            <AIAssistantBubble
                user={activeUser}
                context={
                    view === 'food' || view === 'recipes' ? 'nutrition' :
                        view === 'exercise' || view === 'challenges' ? 'exercise' :
                            view === 'recovery' ? 'sleep' :
                                view === 'health' || view === 'academy' ? 'mind' : 'general'
                }
            />

            <NotificationSystem />
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
