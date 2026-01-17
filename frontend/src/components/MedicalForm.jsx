import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, Loader2, Heart } from 'lucide-react';
import axios from 'axios';
import API_URL from '../config';

const MedicalForm = ({ onSubmit, user }) => {
  const [formData, setFormData] = useState({
    hypertension: false,
    diabetes: false,
    jointInjuries: false,
    allergies: false,
    allergiesDetail: '',
    otherConditions: ''
  });

  const [loading, setLoading] = useState(false);
  const [riskProfile, setRiskProfile] = useState('low');

  const handleChange = (e) => {
    const { name, checked, value, type } = e.target;
    const val = type === 'checkbox' ? checked : value;

    const newFormData = { ...formData, [name]: val };
    setFormData(newFormData);

    if (newFormData.hypertension || newFormData.diabetes || newFormData.jointInjuries) {
      setRiskProfile('high');
    } else {
      setRiskProfile('low');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        userId: user.uid,
        riskProfile,
        email: user.email,
        fullName: user.displayName || user.email?.split('@')[0]
      };
      await axios.post(`${API_URL}/api/medical`, payload);
      onSubmit(payload);
    } catch (err) {
      console.error("Error saving medical data:", err);
      alert("Error al guardar los datos medicos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-1 bg-gradient-to-b from-cyan-500/20 to-purple-500/20 rounded-[2.5rem] shadow-2xl">
      <div className="bg-slate-950/90 backdrop-blur-xl p-10 rounded-[2.4rem] border border-white/10 text-white relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex items-center space-x-4 mb-8">
          <div className="p-4 bg-cyan-500/20 rounded-2xl">
            <Heart className="text-cyan-400 w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Perfil Médico
            </h2>
            <p className="text-slate-400">Análisis personalizado para tu seguridad.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'hypertension', label: 'Hipertensión', icon: Activity },
              { id: 'diabetes', label: 'Diabetes', icon: Activity },
              { id: 'jointInjuries', label: 'Lesiones Articulares', icon: ShieldAlert },
              { id: 'allergies', label: 'Alergias', icon: ShieldAlert },
            ].map((item) => (
              <label
                key={item.id}
                className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer group ${formData[item.id]
                  ? 'bg-cyan-500/10 border-cyan-500/50 scale-[1.02]'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={`w-5 h-5 ${formData[item.id] ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className={`font-bold ${formData[item.id] ? 'text-white' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </div>
                <input
                  type="checkbox"
                  name={item.id}
                  checked={formData[item.id]}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData[item.id] ? 'bg-cyan-500 border-cyan-500' : 'border-slate-700'
                  }`}>
                  {formData[item.id] && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              </label>
            ))}
          </div>

          {formData.allergies && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <textarea
                name="allergiesDetail"
                value={formData.allergiesDetail}
                onChange={handleChange}
                placeholder="Especifica tus alergias (ej. gluten, lactosa)..."
                className="w-full h-32 p-6 bg-slate-900/80 border-2 border-slate-800 rounded-[2rem] focus:outline-none focus:border-cyan-500/50 text-white placeholder-slate-600 transition-all resize-none"
              />
            </div>
          )}

          <div className={`p-8 rounded-[2rem] border-2 transition-all flex items-start space-x-4 ${riskProfile === 'high'
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-green-500/10 border-green-500/30'
            }`}>
            <div className={`p-3 rounded-xl ${riskProfile === 'high' ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
              <ShieldAlert className={riskProfile === 'high' ? 'text-red-400' : 'text-green-400'} />
            </div>
            <div>
              <p className="text-xl font-bold">
                Riesgo: <span className={riskProfile === 'high' ? 'text-red-400' : 'text-green-400'}>
                  {riskProfile === 'high' ? 'ALTO' : 'BAJO'}
                </span>
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {riskProfile === 'high'
                  ? 'Hemos aplicado restricciones de sodio y actividad física de alto impacto.'
                  : 'Tu perfil es óptimo para el plan estándar de BioBalance.'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2rem] font-black text-xl hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-3"
          >
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <span>Activar Mi BioBalance</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSubmit({ skipped: true })}
            className="w-full py-4 text-slate-500 hover:text-slate-300 font-bold text-sm uppercase tracking-widest transition-colors"
          >
            Omitir por ahora (Ir al Dashboard)
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicalForm;

