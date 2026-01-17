import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const AuthForms = ({ onGuestLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, signup } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await signup(formData.email, formData.password, formData.name);
            }
        } catch (err) {
            console.error(err);
            setError(err.message.includes('auth/invalid-credential')
                ? 'Credenciales incorrectas'
                : 'Ocurrió un error. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md p-8 bg-glass border border-white/10 rounded-[2.5rem] shadow-2xl space-y-8 backdrop-blur-xl">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
                        {isLogin ? 'Bienvenido' : 'Paso Final'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isLogin ? 'Ingresa para ver tu progreso' : 'Crea tu cuenta de BioBalance'}
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center space-x-3 text-red-400 text-sm animate-in fade-in zoom-in duration-300">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                required
                                type="text"
                                placeholder="Nombre completo"
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            required
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            required
                            type="password"
                            placeholder="Contraseña"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : isLogin ? (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>Iniciar Sesión</span>
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                <span>Registrarme</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="flex-1 h-px bg-white/5"></div>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">O continúa con</span>
                        <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    <button
                        type="button"
                        onClick={onGuestLogin}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-2xl font-bold text-sm transition-all"
                    >
                        Acceder como Invitado (Modo Demo)
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthForms;
