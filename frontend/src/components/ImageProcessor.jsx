import React, { useRef, useState } from 'react';

const ImageProcessor = ({ initialWeight = 90, currentWeight = 75 }) => {
    const canvasRef = useRef(null);
    const [images, setImages] = useState({ before: null, after: null });

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImages(prev => ({ ...prev, [type]: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const generateCollage = () => {
        if (!images.before || !images.after) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imgBefore = new Image();
        const imgAfter = new Image();

        imgBefore.src = images.before;
        imgAfter.src = images.after;

        imgBefore.onload = () => {
            imgAfter.onload = () => {
                // Set canvas size (Side-by-side)
                const width = 1200;
                const height = 800;
                canvas.width = width;
                canvas.height = height;

                // Draw Images
                ctx.drawImage(imgBefore, 0, 0, width / 2, height);
                ctx.drawImage(imgAfter, width / 2, 0, width / 2, height);

                // Overlay Styles
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.fillRect(0, height - 100, width, 100);

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 40px Inter, sans-serif';
                ctx.textAlign = 'center';

                const date = new Date().toLocaleDateString();
                const weightLoss = initialWeight - currentWeight;

                ctx.fillText(`Antes (${initialWeight}kg) | Después (${currentWeight}kg)`, width / 2, height - 55);
                ctx.font = '30px Inter, sans-serif';
                ctx.fillText(`${date} - Total: ${weightLoss}kg Perdidos con BioBalance`, width / 2, height - 20);

                // Branding
                ctx.font = 'bold 20px Inter, sans-serif';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillText('BioBalance App', width - 100, 30);
            };
        };
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `BioBalance-Progreso-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8 bg-slate-900 rounded-3xl border border-slate-800 text-white">
            <h2 className="text-3xl font-bold text-center mb-8">Evolución: Antes y Después</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <p className="font-semibold text-slate-400">Foto Inicio</p>
                    <div className="relative group aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden flex items-center justify-center bg-slate-800/50 hover:border-cyan-500 transition-all">
                        {images.before ? (
                            <img src={images.before} alt="Inicio" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-500">Subir primer foto</span>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange(e, 'before')}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="font-semibold text-slate-400">Foto Actual</p>
                    <div className="relative group aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden flex items-center justify-center bg-slate-800/50 hover:border-cyan-500 transition-all">
                        {images.after ? (
                            <img src={images.after} alt="Actual" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-slate-500">Subir foto actual</span>
                        )}
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => handleFileChange(e, 'after')}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-6 pt-8 border-t border-slate-800">
                <button
                    onClick={generateCollage}
                    disabled={!images.before || !images.after}
                    className="px-8 py-3 bg-cyan-600 rounded-full font-bold hover:bg-cyan-500 disabled:bg-slate-700 disabled:opacity-50 transition-all shadow-xl shadow-cyan-900/20"
                >
                    Generar Comparativa
                </button>

                <canvas
                    ref={canvasRef}
                    className="w-full max-w-2xl rounded-xl border border-slate-700 shadow-2xl hidden"
                    style={{ display: images.before && images.after ? 'block' : 'none' }}
                />

                {images.before && images.after && (
                    <button
                        onClick={downloadImage}
                        className="flex items-center space-x-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Descargar Imagen de Alta Calidad</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageProcessor;
