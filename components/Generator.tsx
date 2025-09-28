
import React, { useState, useCallback, useRef } from 'react';
import type { User } from '../types';
import { generateImageWithJesus, fileToBase64 } from '../services/geminiService';
import { Spinner } from './Spinner';
import { UploadIcon, DownloadIcon } from './Icons';

interface GeneratorProps {
  user: User | null;
  onGenerate: () => void;
}

type Status = 'idle' | 'uploading' | 'generating' | 'success' | 'error';

export const Generator: React.FC<GeneratorProps> = ({ user, onGenerate }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setGeneratedImage(null);
      setStatus('idle');
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    if (!user) {
        setError('Please sign in to generate an image.');
        return;
    }
    if (user.generationsLeft <= 0) {
      setError('You have no generations left this month. Please upgrade your plan.');
      return;
    }

    setStatus('generating');
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await fileToBase64(file);
      const resultBase64 = await generateImageWithJesus(base64Image, file.type);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
      setStatus('success');
      onGenerate();
    } catch (err) {
      setStatus('error');
      setError((err as Error).message || 'An unknown error occurred.');
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'touchfeets_divine_creation.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isFreeTier = !user || user.tier.id === 'free';
  // FIX: Refined canGenerate logic to only include states where the generate button is intended to be active.
  const canGenerate = user && user.generationsLeft > 0 && file && (status === 'idle' || status === 'error');

  return (
    <section id="generator" className="py-12 px-4">
      <div className="container mx-auto max-w-4xl bg-gray-900/20 border neon-crimson-border rounded-lg p-6 sm:p-8 shadow-2xl shadow-red-900/20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side: Upload & Original Image */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full h-80 bg-black/30 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-center p-4">
              {originalImage ? (
                <img src={originalImage} alt="Uploaded feet" className="max-w-full max-h-full object-contain" />
              ) : (
                <p className="text-gray-400">Your image will appear here</p>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600 rounded-md px-4 py-3 text-lg font-semibold transition-all duration-300"
            >
              <UploadIcon className="w-6 h-6" />
              <span>{originalImage ? 'Choose a Different Image' : 'Upload Image'}</span>
            </button>
          </div>

          {/* Right Side: Generated Image & Actions */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full h-80 bg-black/30 border-2 border-dashed border-red-800/50 rounded-lg flex items-center justify-center relative overflow-hidden">
              {status === 'generating' && (
                  <div className="text-center">
                      <Spinner />
                      <p className="mt-2 text-red-300 animate-pulse">Awaiting divine intervention...</p>
                  </div>
              )}
              {status === 'success' && generatedImage && (
                <>
                  <img src={generatedImage} alt="AI generated art" className="max-w-full max-h-full object-contain" />
                  {isFreeTier && (
                      <div className="absolute bottom-2 inset-x-0 text-center text-white/50 font-semibold tracking-widest text-lg pointer-events-none">
                          touchfeets.com
                      </div>
                  )}
                </>
              )}
              {status !== 'generating' && status !== 'success' && (
                 <p className="text-gray-400">Your blessed image will appear here</p>
              )}
            </div>
            {status === 'success' ? (
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center space-x-2 bg-red-800/50 hover:bg-red-700/70 border border-red-600 rounded-md px-4 py-3 text-lg font-semibold transition-all duration-300"
                >
                    <DownloadIcon className="w-6 h-6" />
                    <span>Download Creation</span>
                </button>
            ) : (
                <button
                    onClick={handleGenerate}
                    // FIX: Simplified disabled logic to fix the comparison error.
                    disabled={!canGenerate}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900/50 disabled:cursor-not-allowed disabled:text-gray-500 text-white rounded-md px-4 py-3 text-lg font-bold transition-all duration-300 shadow-lg shadow-red-500/30"
                >
                    {status === 'generating' ? 'Generating...' : 'Generate'}
                </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
            {user ? (
                <p>You have <span className="font-bold text-red-400">{user.generationsLeft}</span> generations left this month.</p>
            ) : (
                <p>Please sign in to begin your sacred creations.</p>
            )}
            {error && <p className="mt-2 text-yellow-400">{error}</p>}
        </div>
      </div>
    </section>
  );
};