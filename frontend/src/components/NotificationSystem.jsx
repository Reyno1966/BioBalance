import React, { useState, useEffect } from 'react';
import { Bell, Droplets, Moon, Coffee, Heart, Check, X } from 'lucide-react';

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (type) => {
        const configs = {
            water: { title: '¡Hora de Hidratarse!', desc: 'Bebe un vaso de agua para mantener tu metabolismo activo.', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            rest: { title: 'Pausa Mental', desc: 'Tómate 2 minutos para respirar profundamente.', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
            posture: { title: 'Corrige tu Postura', desc: 'Endereza tu espalda y relaja los hombros.', icon: Heart, color: 'text-red-400', bg: 'bg-red-400/10' }
        };

        const config = configs[type];
        const id = Date.now();
        setNotifications(prev => [{ id, ...config }, ...prev]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 8000);
    };

    useEffect(() => {
        // Randomly simulate a notification every 2 minutes for demo purposes
        const interval = setInterval(() => {
            const types = ['water', 'rest', 'posture'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            addNotification(randomType);
        }, 120000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-10 right-10 z-[100] space-y-4 max-w-sm w-full">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-start space-x-4 animate-in slide-in-from-right-full duration-500 relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className={`p-3 rounded-2xl ${n.bg} shrink-0`}>
                        <n.icon className={`w-6 h-6 ${n.color}`} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{n.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                    <button
                        onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))}
                        className="p-1 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                    <div className="absolute bottom-0 left-0 h-1 bg-cyan-500/50 animate-[shrink_8s_linear_forwards]" style={{ width: '100%' }} />
                </div>
            ))}

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};

export default NotificationSystem;
