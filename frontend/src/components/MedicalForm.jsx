import React, { useState } from 'react';

const MedicalForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    hypertension: false,
    diabetes: false,
    jointInjuries: false,
    allergies: false,
    allergiesDetail: '',
    otherConditions: ''
  });

  const [riskProfile, setRiskProfile] = useState('low');

  const handleChange = (e) => {
    const { name, checked, value, type } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    const newFormData = { ...formData, [name]: val };
    setFormData(newFormData);

    // Business Logic: Risk Assessment
    if (newFormData.hypertension || newFormData.diabetes || newFormData.jointInjuries) {
      setRiskProfile('high');
    } else {
      setRiskProfile('low');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, riskProfile });
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 text-white">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Onboarding Médico
      </h2>
      <p className="text-gray-300 mb-8">Por tu seguridad, necesitamos conocer tu estado de salud actual.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="flex items-center space-x-3 cursor-pointer group">
          <input 
            type="checkbox" 
            name="hypertension" 
            checked={formData.hypertension} 
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 accent-cyan-500"
          />
          <span className="text-lg group-hover:text-cyan-300 transition-colors">¿Padeces Hipertensión?</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input 
            type="checkbox" 
            name="diabetes" 
            checked={formData.diabetes} 
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 accent-cyan-500"
          />
          <span className="text-lg group-hover:text-cyan-300 transition-colors">¿Padeces Diabetes?</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input 
            type="checkbox" 
            name="jointInjuries" 
            checked={formData.jointInjuries} 
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 accent-cyan-500"
          />
          <span className="text-lg group-hover:text-cyan-300 transition-colors">¿Tienes Lesiones Articulares?</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer group">
          <input 
            type="checkbox" 
            name="allergies" 
            checked={formData.allergies} 
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500 accent-cyan-500"
          />
          <span className="text-lg group-hover:text-cyan-300 transition-colors">¿Tienes Alergias?</span>
        </label>

        {formData.allergies && (
          <textarea
            name="allergiesDetail"
            value={formData.allergiesDetail}
            onChange={handleChange}
            placeholder="Especifica tus alergias..."
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
          />
        )}

        <div className={`p-4 rounded-xl border transition-all ${riskProfile === 'high' ? 'bg-red-500/20 border-red-500/50' : 'bg-green-500/20 border-green-500/50'}`}>
          <p className="text-sm font-semibold">
            Perfil de Riesgo: <span className={riskProfile === 'high' ? 'text-red-400' : 'text-green-400'}>
              {riskProfile === 'high' ? 'ALTO (Restricciones Aplicadas)' : 'BAJO'}
            </span>
          </p>
          {riskProfile === 'high' && (
            <p className="text-xs mt-1 text-red-200">Se bloquearán ejercicios de alto impacto automáticamente.</p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Guardar y Continuar
        </button>
      </form>
    </div>
  );
};

export default MedicalForm;
