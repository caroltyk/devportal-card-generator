import React, { useState } from 'react';
import { generateImage } from './services/gemini';
import { GeneratedImage, StylePreset, CATALOGUE_WIDTH, CATALOGUE_HEIGHT, PRODUCT_WIDTH, PRODUCT_HEIGHT } from './types';
import { Button } from './components/Button';
import { StyleSelector } from './components/StyleSelector';
import { ImageCropper } from './components/ImageCropper';
import { Sparkles, Download, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [stylePreset, setStylePreset] = useState<StylePreset>(StylePreset.ABSTRACT_TECH);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const base64Data = await generateImage(prompt, stylePreset);
      // Set original, waiting for croppers to populate catalogueBase64 and productBase64
      setCurrentImage({
        originalBase64: base64Data,
        catalogueBase64: null,
        productBase64: null,
        prompt: prompt,
        timestamp: Date.now()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCatalogueCropped = (processedBase64: string) => {
    setCurrentImage(prev => prev ? { ...prev, catalogueBase64: processedBase64 } : null);
  };

  const handleProductCropped = (processedBase64: string) => {
    setCurrentImage(prev => prev ? { ...prev, productBase64: processedBase64 } : null);
  };

  const downloadImage = (base64: string | null, width: number, height: number, type: string) => {
    if (!base64) return;
    
    const link = document.createElement('a');
    link.href = base64;
    link.download = `devcard-${type}-${width}x${height}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-xl mb-4">
            <ImageIcon className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            DevPortal Card Generator
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Create perfectly sized assets for your developer portal using Gemini AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* Controls Section (Left Column) */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm h-fit">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
                What should your API cards look like?
              </label>
              <textarea
                id="prompt"
                rows={4}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="e.g., A futuristic data stream connecting global nodes, dark theme, blue and violet accents..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Style Preset
              </label>
              <StyleSelector selected={stylePreset} onSelect={setStylePreset} />
            </div>

            <Button 
              onClick={handleGenerate} 
              isLoading={isGenerating} 
              disabled={!prompt.trim()}
              className="w-full py-3 text-lg"
              icon={<Sparkles size={20} />}
            >
              {isGenerating ? 'Generating Assets...' : 'Generate Card Images'}
            </Button>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-start space-x-3 text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-xl text-sm text-indigo-200 mt-6">
              <p className="font-semibold mb-1">Generates two formats:</p>
              <ul className="list-disc list-inside space-y-1 text-indigo-300/80">
                <li>Catalogue Card ({CATALOGUE_WIDTH} &times; {CATALOGUE_HEIGHT}px)</li>
                <li>Product Page Header ({PRODUCT_WIDTH} &times; {PRODUCT_HEIGHT}px)</li>
              </ul>
            </div>
          </div>

          {/* Preview Section (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Catalogue Image Preview */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span className="font-medium text-white">Catalogue Card ({CATALOGUE_WIDTH} &times; {CATALOGUE_HEIGHT}px)</span>
                {currentImage?.catalogueBase64 && <span className="text-green-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Ready</span>}
              </div>

              <div 
                className="relative w-full bg-slate-950 border-2 border-dashed border-slate-700 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-500 shadow-xl mx-auto"
                style={{ aspectRatio: `${CATALOGUE_WIDTH}/${CATALOGUE_HEIGHT}`, maxWidth: '100%' }}
              >
                {currentImage?.catalogueBase64 ? (
                  <img 
                    src={currentImage.catalogueBase64} 
                    alt="Catalogue Card" 
                    className="w-full h-full object-cover"
                  />
                ) : isGenerating ? (
                   <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-indigo-400 animate-pulse">Processing</span>
                   </div>
                ) : (
                  <div className="text-center text-slate-600">
                    <div className="mx-auto w-8 h-8 mb-2 opacity-50 border border-current rounded border-dashed"></div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 mt-auto">
                 <Button 
                    onClick={() => downloadImage(currentImage?.catalogueBase64 || null, CATALOGUE_WIDTH, CATALOGUE_HEIGHT, 'catalogue')}
                    disabled={!currentImage?.catalogueBase64}
                    className="!py-1.5 !px-3 !text-sm"
                    variant="secondary"
                    icon={<Download size={14} />}
                  >
                    Download
                  </Button>
              </div>
            </div>

            {/* Product Image Preview */}
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <span className="font-medium text-white">Product Page Header ({PRODUCT_WIDTH} &times; {PRODUCT_HEIGHT}px)</span>
                {currentImage?.productBase64 && <span className="text-green-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Ready</span>}
              </div>

              <div 
                className="relative w-full bg-slate-950 border-2 border-dashed border-slate-700 rounded-lg overflow-hidden flex items-center justify-center transition-all duration-500 shadow-xl mx-auto"
                style={{ aspectRatio: `${PRODUCT_WIDTH}/${PRODUCT_HEIGHT}`, maxWidth: '100%' }}
              >
                {currentImage?.productBase64 ? (
                  <img 
                    src={currentImage.productBase64} 
                    alt="Product Header" 
                    className="w-full h-full object-cover"
                  />
                ) : isGenerating ? (
                   <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-indigo-400 animate-pulse">Processing</span>
                   </div>
                ) : (
                  <div className="text-center text-slate-600">
                    <div className="mx-auto w-8 h-8 mb-2 opacity-50 border border-current rounded border-dashed"></div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 mt-auto">
                 <Button 
                    onClick={() => downloadImage(currentImage?.productBase64 || null, PRODUCT_WIDTH, PRODUCT_HEIGHT, 'product')}
                    disabled={!currentImage?.productBase64}
                    className="!py-1.5 !px-3 !text-sm"
                    variant="secondary"
                    icon={<Download size={14} />}
                  >
                    Download
                  </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Off-screen canvas processors */}
      {currentImage?.originalBase64 && (
        <>
          <ImageCropper 
            base64Source={currentImage.originalBase64} 
            targetWidth={CATALOGUE_WIDTH}
            targetHeight={CATALOGUE_HEIGHT}
            onProcessed={handleCatalogueCropped} 
          />
          <ImageCropper 
            base64Source={currentImage.originalBase64} 
            targetWidth={PRODUCT_WIDTH}
            targetHeight={PRODUCT_HEIGHT}
            onProcessed={handleProductCropped} 
          />
        </>
      )}
    </div>
  );
};

export default App;
