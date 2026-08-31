import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutfitTheme, Presenter } from '../../types';
import { Avatar3D } from '../Avatar3D';
import { Crown, Mic, Sparkles, CheckCircle, Volume2, Quote, ArrowRight, User, Eye, Camera, Upload, RefreshCw, Check, Loader2 } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import {
  useCustomPhotos,
  saveStoredImage,
  removeStoredImage,
  processAndOptimizeImage,
} from '../../utils/imageStorage';

interface SpeechesSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const SpeechesSlide: React.FC<SpeechesSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const customPhotos = useCustomPhotos();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Persistent View mode for presenters: 'photo' vs 'avatar'
  const [viewModes, setViewModes] = useState<Record<string, 'photo' | 'avatar'>>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('winbridge_speech_view_modes');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      fakhrul: 'photo',
      hasib: 'photo',
      abuDaud: 'photo',
    };
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentPresenter: Presenter = slide.presenters[selectedIdx] || slide.presenters[0];
  const customPhoto = customPhotos[currentPresenter.id];
  const activeMode = viewModes[currentPresenter.id] || (customPhoto || currentPresenter.photoUrl ? 'photo' : 'avatar');
  const currentPhotoUrl = customPhoto || currentPresenter.photoUrl || '/images/md_fakhrul_hasan.svg';

  // Save viewMode preference to localStorage
  const toggleViewMode = (mode: 'photo' | 'avatar') => {
    const updated = {
      ...viewModes,
      [currentPresenter.id]: mode,
    };
    setViewModes(updated);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('winbridge_speech_view_modes', JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
    soundFx.playClick();
  };

  const handleSpeakerChange = (index: number) => {
    setSelectedIdx(index);
    soundFx.playClick();
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsSaving(true);
    try {
      // Optimize image so high-res files save seamlessly in IndexedDB
      const optimizedDataUrl = await processAndOptimizeImage(file);
      await saveStoredImage(currentPresenter.id, optimizedDataUrl);
      
      // Auto-switch to photo mode
      const updated = {
        ...viewModes,
        [currentPresenter.id]: 'photo' as const,
      };
      setViewModes(updated);
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('winbridge_speech_view_modes', JSON.stringify(updated));
        } catch {
          // ignore
        }
      }

      setSaveSuccessMsg('Photo Saved & Persisted!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
      soundFx.playFanfare();
    } catch (err) {
      console.error('Failed to save image:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = async () => {
    await removeStoredImage(currentPresenter.id);
    setSaveSuccessMsg('Reset to Default');
    setTimeout(() => setSaveSuccessMsg(null), 2500);
    soundFx.playClick();
  };

  const onDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Crown className="w-3.5 h-3.5 text-blue-400" />
          SESSION 02 • EXECUTIVE KEYNOTE ADDRESSES
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200">
          Vision, Philosophy & Leadership
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          Insights from the visionary leaders steering Winbridge Tech to unprecedented global heights.
        </p>
      </div>

      {/* Speaker Switcher Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {slide.presenters.map((presenter, idx) => {
          const isSelected = selectedIdx === idx;
          const hasPhoto = presenter.id === 'fakhrul' || customPhotos[presenter.id] || presenter.photoUrl;
          return (
            <button
              key={presenter.id}
              onClick={() => handleSpeakerChange(idx)}
              className={`px-4 sm:px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 text-left cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white shadow-[0_0_25px_rgba(59,130,246,0.35)] scale-105'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-blue-400 border border-white/10'
                }`}
              >
                0{idx + 1}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-xs sm:text-sm">{presenter.name}</h4>
                  {hasPhoto && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Official Photo Available" />
                  )}
                </div>
                <p className="text-[11px] opacity-80">{presenter.designation}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE PRESENTER STAGE DISPLAY */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPresenter.id}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/20 via-[#0a1026]/90 to-[#050A18] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Left: Stage Visual (Photo / 3D Avatar) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3">
            {/* Display Mode Toggle */}
            <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner text-xs gap-1">
              <button
                onClick={() => toggleViewMode('photo')}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMode === 'photo'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md ring-1 ring-amber-300 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Official Portrait
              </button>
              <button
                onClick={() => toggleViewMode('avatar')}
                className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMode === 'avatar'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-1 ring-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                3D Avatar
              </button>
            </div>

            {/* Visual Container */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={onDropFile}
              className={`p-4 rounded-3xl bg-gradient-to-b from-[#0e1630] via-[#080d21] to-[#040817] border ${
                isDragOver ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]' : 'border-white/10'
              } w-full flex flex-col items-center relative overflow-hidden transition-all shadow-2xl`}
            >
              {activeMode === 'photo' ? (
                /* OFFICIAL EXECUTIVE PORTRAIT CARD */
                <div className="w-full flex flex-col items-center py-2">
                  <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(245,158,11,0.25)] border-2 border-amber-400/60 group">
                    {/* Golden Ambient Halo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />

                    <img
                      src={currentPhotoUrl}
                      alt={currentPresenter.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/md_fakhrul_hasan.svg';
                      }}
                    />

                    {/* MD Executive Floating Gold Seal Badge */}
                    <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/60 flex items-center gap-1.5 shadow-lg">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                        {currentPresenter.id === 'fakhrul' ? 'Managing Director' : 'Executive Leader'}
                      </span>
                    </div>

                    {/* Bottom Photo Overlay Plate */}
                    <div className="absolute bottom-3 inset-x-3 z-20 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-center">
                      <h4 className="font-black text-sm text-white">{currentPresenter.name}</h4>
                      <p className="text-[10px] text-amber-300 font-semibold">{currentPresenter.designation}</p>
                    </div>
                  </div>

                  {/* Photo Action / File Upload Trigger */}
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSaving}
                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Image...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-3.5 h-3.5 text-amber-400" />
                            <span>{customPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                          </>
                        )}
                      </button>

                      {customPhoto && (
                        <button
                          onClick={handleRemovePhoto}
                          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Reset to Default Official Photo"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Reset</span>
                        </button>
                      )}
                    </div>

                    {saveSuccessMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-sm"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>{saveSuccessMsg}</span>
                      </motion.div>
                    )}

                    <p className="text-[10px] text-slate-400">
                      Drag & drop an image or click upload (permanently saved across slides & reloads).
                    </p>
                  </div>
                </div>
              ) : (
                /* 3D AVATAR RIG */
                <Avatar3D
                  presenter={currentPresenter}
                  outfitTheme={globalOutfit}
                  action="speaking"
                  size="hero"
                  showSpeechBubble={false}
                  onOutfitChange={(theme) => onPresenterOutfitChange?.(currentPresenter.id, theme)}
                />
              )}
            </div>
          </div>

          {/* Right Speech Teleprompter & Key Highlights */}
          <div className="lg:col-span-7 space-y-5">
            {/* Speaker Header */}
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5 mb-1 font-mono">
                <Mic className="w-3.5 h-3.5" />
                KEYNOTE SPEAKER 0{selectedIdx + 1}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                {currentPresenter.name}
              </h3>
              <p className="text-sm font-semibold text-blue-300">
                {currentPresenter.designation} • {currentPresenter.department}
              </p>
            </div>

            {/* Featured Quote Card */}
            {currentPresenter.speechQuote && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 relative shadow-inner">
                <Quote className="w-8 h-8 text-blue-400/20 absolute top-3 right-3" />
                <p className="text-base sm:text-lg font-medium text-slate-100 italic leading-relaxed">
                  "{currentPresenter.speechQuote}"
                </p>
              </div>
            )}

            {/* Key Speech Pillars / Points */}
            {currentPresenter.speechPoints && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 font-mono">
                  Key Strategic Themes
                </h4>
                <div className="space-y-2">
                  {currentPresenter.speechPoints.map((pt, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-slate-200">{pt}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Speaker Quick Jumper */}
            <div className="pt-2 flex justify-end">
              {selectedIdx < slide.presenters.length - 1 ? (
                <button
                  onClick={() => handleSpeakerChange(selectedIdx + 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Next Speaker ({slide.presenters[selectedIdx + 1].name})
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  All Keynotes Ready
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

