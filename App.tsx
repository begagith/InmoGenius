import React, { useState, useCallback } from 'react';
import { UploadIcon, SparklesIcon, MagicWandIcon } from './components/Icons';
import { ImageCard } from './components/ImageCard';
import { AdSettingsPanel } from './components/AdSettingsPanel';
import { ResultSection } from './components/ResultSection';
import { UploadedImage, ImageAction, AdSettings, AdAudience, AdLength, AdTone } from './types';
import { generateAdText, editImage } from './services/geminiService';

const App: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [settings, setSettings] = useState<AdSettings>({
    audience: AdAudience.FAMILIES,
    length: AdLength.MEDIUM,
    tone: AdTone.PROFESSIONAL
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages: UploadedImage[] = Array.from(event.target.files).map((file: File) => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        previewUrl: URL.createObjectURL(file),
        selectedAction: ImageAction.KEEP, // Default
        status: 'pending'
      }));
      setImages((prev) => [...prev, ...newImages]);
      setShowResults(false);
    }
  };

  const handleActionChange = (id: string, action: ImageAction) => {
    setImages((prev) => prev.map(img => img.id === id ? { ...img, selectedAction: action } : img));
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter(img => img.id !== id));
  };

  const handleGenerate = async () => {
    if (images.length === 0) return;
    
    setIsGenerating(true);
    setShowResults(false);
    setGeneratedText(null);

    try {
      // 1. Generate Text (using original images to understand the context)
      const textPromise = generateAdText(images, settings);

      // 2. Process Images (in parallel)
      const imageProcessingPromises = images.map(async (img) => {
        if (img.selectedAction === ImageAction.KEEP) {
          return img;
        }
        // Mark as processing in UI (optional complexity, skipping for simplicity)
        const processedUrl = await editImage(img);
        return {
          ...img,
          processedUrl: processedUrl || undefined,
          status: processedUrl ? 'completed' : 'error'
        } as UploadedImage;
      });

      // Execute both tasks
      const [adText, processedImages] = await Promise.all([
        textPromise,
        Promise.all(imageProcessingPromises)
      ]);

      setGeneratedText(adText);
      setImages(processedImages);
      setShowResults(true);

    } catch (error) {
      console.error("Error in generation process", error);
      alert("Hubo un error generando el anuncio. Por favor intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
                <MagicWandIcon />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">InmoGenius <span className="text-blue-600">AI</span></h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Asistente Inmobiliario Inteligente
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero / Intro */}
        {!showResults && images.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Crea anuncios perfectos en segundos
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Sube las fotos de tu propiedad. Nuestra IA redactará el texto ideal y mejorará visualmente las imágenes (staging o vaciado) automáticamente.
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-dashed border-slate-300 hover:border-blue-400 transition-colors text-center group">
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-full text-blue-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <UploadIcon />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-700">Sube las fotos del inmueble</span>
                <p className="text-slate-500 text-sm mt-1">Arrastra y suelta o haz clic para seleccionar</p>
              </div>
            </div>
          </label>
        </div>

        {/* Image List & Settings Grid */}
        {images.length > 0 && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">1. Configura tus imágenes ({images.length})</h3>
              <button onClick={() => setImages([])} className="text-sm text-red-500 hover:text-red-700 font-medium">
                Borrar todo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img) => (
                <ImageCard 
                  key={img.id} 
                  image={img} 
                  onActionChange={handleActionChange} 
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>

            <div className="border-t border-slate-200 pt-8">
               <h3 className="text-xl font-bold text-slate-800 mb-6">2. Configura el texto</h3>
               <AdSettingsPanel settings={settings} onSettingsChange={setSettings} />
            </div>

            {/* Action Button */}
            <div className="sticky bottom-6 z-40 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-blue-100 flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`
                  w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all
                  flex items-center justify-center space-x-3
                  ${isGenerating 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-blue-500/25'}
                `}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando IA...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    <span>Generar Anuncio Completo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && generatedText && (
          <div id="results" className="pt-8 border-t-2 border-slate-100">
            <ResultSection adText={generatedText} images={images} />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;