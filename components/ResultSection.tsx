import React from 'react';
import { UploadedImage, ImageAction } from '../types';
import { CheckCircleIcon } from './Icons';

interface ResultSectionProps {
  adText: string;
  images: UploadedImage[];
}

export const ResultSection: React.FC<ResultSectionProps> = ({ adText, images }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Text Section */}
      <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-100">
        <div className="flex items-center mb-6">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <CheckCircleIcon />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Anuncio Generado</h2>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <pre className="whitespace-pre-wrap font-sans text-slate-700 text-base leading-relaxed">
            {adText}
          </pre>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            onClick={() => navigator.clipboard.writeText(adText)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            Copiar Texto
          </button>
        </div>
      </div>

      {/* Images Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 pl-2 border-l-4 border-blue-500">Galería Procesada</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100">
              <div className="p-4 border-b border-slate-50 bg-slate-50 flex justify-between items-center">
                <span className="font-semibold text-slate-700">
                  {img.selectedAction === ImageAction.STAGE ? 'Virtual Staging' : 
                   img.selectedAction === ImageAction.EMPTY ? 'Espacio Vacio' : 'Original'}
                </span>
                {img.selectedAction !== ImageAction.KEEP && (
                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">IA Mejorada</span>
                )}
              </div>
              
              <div className="relative">
                {img.selectedAction !== ImageAction.KEEP && img.processedUrl ? (
                  <div className="grid grid-rows-2 h-[500px]">
                    <div className="relative group border-b border-white">
                        <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">Antes</span>
                        <img src={img.previewUrl} className="w-full h-full object-cover" alt="Original" />
                    </div>
                    <div className="relative group">
                        <span className="absolute top-2 left-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">Después</span>
                        <img src={img.processedUrl} className="w-full h-full object-cover" alt="Processed" />
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <img src={img.previewUrl} className="w-full h-full object-cover" alt="Original" />
                  </div>
                )}
              </div>
              <div className="p-4 flex justify-end bg-white">
                 {img.processedUrl && (
                    <a 
                      href={img.processedUrl} 
                      download={`inmogenius-${img.id}.png`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Descargar Imagen
                    </a>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};