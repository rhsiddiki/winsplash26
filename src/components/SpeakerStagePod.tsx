import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Presenter, OutfitTheme } from '../types';
import { Avatar3D } from './Avatar3D';
import {
  Camera,
  Upload,
  RefreshCw,
  Eye,
  User,
  Check,
  Loader2,
  Sparkles,
  Quote,
  ShieldCheck,
  Crown,
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import {
  useCustomPhotos,
  saveStoredImage,
  removeStoredImage,
  processAndOptimizeImage,
} from '../utils/imageStorage';

interface SpeakerStagePodProps {
  presenter: Presenter;
  globalOutfit?: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
  defaultMode?: 'photo' | 'avatar';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechQuote?: boolean;
}

export const SpeakerStagePod: React.FC<SpeakerStagePodProps> = ({
  presenter,
  globalOutfit = 'formal',
  onPresenterOutfitChange,
  defaultMode = 'photo',
  className = '',
  size = 'lg',
  showSpeechQuote = true,
}) => {
  const customPhotos = useCustomPhotos();
  const customPhotoUrl = customPhotos[presenter.id];

  // View mode persistence
  const [viewMode, setViewMode] = useState<'photo' | 'avatar'>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(`winbridge_speaker_view_${presenter.id}`);
      if (saved === 'photo' || saved === 'avatar') return saved;
    }
    return defaultMode;
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync viewMode preference
  const handleModeChange = (mode: 'photo' | 'avatar') => {
    setViewMode(mode);
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`winbridge_speaker_view_${presenter.id}`, mode);
      } catch {
        // ignore
      }
    }
    soundFx.playClick();
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const optimizedUrl = await processAndOptimizeImage(file);
      await saveStoredImage(presenter.id, optimizedUrl);
      
      // Auto-switch to photo mode
      setViewMode('photo');
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(`winbridge_speaker_view_${presenter.id}`, 'photo');
        } catch {
          // ignore
        }
      }

      setSaveSuccessMsg('Photo Saved & Persisted!');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
      soundFx.playFanfare();
    } catch (err) {
      console.error('Failed to save speaker image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetPhoto = async () => {
    await removeStoredImage(presenter.id);
    setSaveSuccessMsg('Reset to Default Photo');
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

  // Determine active photo URL
  const displayedPhotoUrl =
    customPhotoUrl ||
    presenter.photoUrl ||
    (presenter.id === 'fakhrul'
      ? '/images/md_fakhrul_hasan.svg'
      : `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80`);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDropFile}
      className={`p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 via-[#0a1026]/90 to-[#050A18] border ${
        isDragOver
          ? 'border-amber-400 ring-4 ring-amber-400/30 bg-amber-950/20'
          : 'border-white/10 hover:border-blue-500/30'
      } backdrop-blur-xl shadow-2xl w-full flex flex-col items-center relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden File Input for Image Upload */}
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

      {/* View Switcher: Photo vs 3D Avatar */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 mb-4 z-10">
        <button
          onClick={() => handleModeChange('photo')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            viewMode === 'photo'
              ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Official Photo</span>
        </button>

        <button
          onClick={() => handleModeChange('avatar')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            viewMode === 'avatar'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>3D Avatar</span>
        </button>
      </div>

      {/* MAIN SPEAKER DISPLAY */}
      <AnimatePresence mode="wait">
        {viewMode === 'photo' ? (
          /* OFFICIAL PORTRAIT PHOTO CONTAINER */
          <motion.div
            key="photo-mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center w-full z-10"
          >
            {/* PORTRAIT ORNAMENTAL FRAME */}
            <div className="relative w-44 h-44 sm:w-48 sm:h-48 my-2 group">
              {/* Radiance Aura */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 animate-pulse blur-[3px] opacity-70 -z-10" />

              {/* Inner Photo Frame */}
              <div className="w-full h-full rounded-3xl p-1.5 bg-gradient-to-b from-amber-300 via-amber-600 to-yellow-200 shadow-[0_0_30px_rgba(245,158,11,0.35)] overflow-hidden">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 relative border-2 border-[#050A18]">
                  <img
                    src={displayedPhotoUrl}
                    alt={presenter.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/md_fakhrul_hasan.svg';
                    }}
                  />

                  {/* Drag overlay indicator */}
                  {isDragOver && (
                    <div className="absolute inset-0 bg-blue-900/90 flex flex-col items-center justify-center text-white p-3 text-center backdrop-blur-sm">
                      <Upload className="w-8 h-8 animate-bounce text-amber-300" />
                      <span className="text-xs font-bold mt-1">Drop Image to Save</span>
                    </div>
                  )}

                  {/* Loading indicator */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-white p-3 text-center backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-2" />
                      <span className="text-xs font-bold">Optimizing & Saving...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Speaker Badge */}
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-xl border border-amber-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>Speaker</span>
              </div>
            </div>

            {/* SPEAKER DETAILS */}
            <div className="text-center mt-3 mb-2">
              <h4 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-400">
                {presenter.name}
              </h4>
              <p className="text-xs font-bold text-amber-300/90 mt-0.5">
                {presenter.designation}
              </p>
              <p className="text-[11px] font-semibold text-slate-400">
                {presenter.department}
              </p>
            </div>

            {/* PHOTO ACTION BUTTONS: UPLOAD / CHANGE / RESET */}
            <div className="mt-2 flex flex-col items-center gap-2 w-full">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>{customPhotoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    </>
                  )}
                </button>

                {customPhotoUrl && (
                  <button
                    onClick={handleResetPhoto}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Reset to Default Portrait"
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
                  className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/40 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{saveSuccessMsg}</span>
                </motion.div>
              )}

              <p className="text-[10px] text-slate-400 text-center">
                Drag & drop or click upload (saved permanently).
              </p>
            </div>
          </motion.div>
        ) : (
          /* 3D AVATAR RIG */
          <motion.div
            key="avatar-mode"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center w-full z-10"
          >
            <Avatar3D
              presenter={presenter}
              outfitTheme={globalOutfit}
              action="speaking"
              size={size}
              showSpeechBubble={false}
              onOutfitChange={(theme) => onPresenterOutfitChange?.(presenter.id, theme)}
            />

            {/* SPEAKER DETAILS FOR AVATAR */}
            <div className="text-center mt-2">
              <h4 className="text-xl font-black text-white">{presenter.name}</h4>
              <p className="text-xs font-bold text-blue-400">{presenter.designation}</p>
              <p className="text-[11px] text-slate-400">{presenter.department}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPEECH QUOTE & KEY TALK POINTS */}
      {showSpeechQuote && presenter.speechQuote && (
        <div className="mt-4 pt-4 border-t border-white/10 w-full z-10">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 relative">
            <Quote className="w-4 h-4 text-amber-400 mb-1 opacity-75" />
            <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
              "{presenter.speechQuote}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
