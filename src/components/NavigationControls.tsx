import React from 'react';
import { motion } from 'motion/react';
import { SlideData, OutfitTheme, HostTransitionType } from '../types';
import { WinbridgeLogo } from './WinbridgeLogo';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  FileText,
  Settings,
  Shirt,
  Sparkles,
  Play,
  Pause,
  Wand2,
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface NavigationControlsProps {
  slides: SlideData[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenNotes: () => void;
  onOpenCustomizer: () => void;
  globalOutfit: OutfitTheme;
  customLogoUrl?: string;
  hostTransitionType?: HostTransitionType;
  onCycleHostTransition?: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onPrev,
  onNext,
  isFullscreen,
  onToggleFullscreen,
  isMuted,
  onToggleMute,
  onOpenNotes,
  onOpenCustomizer,
  globalOutfit,
  customLogoUrl,
  hostTransitionType = 'auto',
  onCycleHostTransition,
}) => {
  const getTransitionLabel = (t?: HostTransitionType | string) => {
    switch (t) {
      case 'auto': return '🔀 Host Auto-Mix';
      case 'curtains': return '🎭 Velvet Drapes';
      case 'shutter': return '🪟 Cyber Shutter';
      case 'watersplash': return '🌊 Water Splash';
      case 'magic': return '🪄 Magic Portal';
      case 'squeegee': return '🧽 Squeegee Wipe';
      case 'confetti': return '🎉 Confetti Cannon';
      default: return '🔀 Host Auto-Mix';
    }
  };

  return (
    <>
      {/* TOP HEADER BAR */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-3 flex items-center justify-between border-b border-white/10 bg-[#050A18]/80 backdrop-blur-xl">
        {/* Left: Geometric Brand & Event Title */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3">
            <WinbridgeLogo customUrl={customLogoUrl} size="md" showTagline={false} />
          </div>

          {/* Geometric Session / Slide Tracker */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">
              SESSION {String(currentSlideIndex + 1).padStart(2, '0')} : {slides[currentSlideIndex]?.category || 'STAGE'}
            </span>
          </div>
        </div>

        {/* Right: Actions (Host Activity Badge, Outfit theme tag, Sound, Notes, Customizer, Fullscreen) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Host Transition Stunt Badge */}
          <button
            onClick={onCycleHostTransition || onOpenCustomizer}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/40 hover:border-blue-400 hover:from-blue-600/50 hover:to-indigo-600/50 text-xs font-bold text-blue-200 transition-all cursor-pointer shadow-sm"
            title="Click to cycle host slide transition stunt"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>{getTransitionLabel(hostTransitionType)}</span>
          </button>

          {/* Global Outfit Badge */}
          <button
            onClick={onOpenCustomizer}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
            title="Change Avatar Outfits"
          >
            <Shirt className="w-3.5 h-3.5 text-blue-400" />
            <span className="capitalize">{globalOutfit} Outfits</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Procedural Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Presenter Notes */}
          <button
            onClick={onOpenNotes}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Speaker Teleprompter & Notes"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Notes</span>
          </button>

          {/* Settings / Customizer */}
          <button
            onClick={onOpenCustomizer}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 transition-colors cursor-pointer"
            title="Stage & Presentation Settings"
          >
            <Settings className="w-4 h-4 text-slate-300 hover:text-white" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.35)] cursor-pointer"
            title="Toggle Fullscreen Mode (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* BOTTOM FLOATING TIMELINE & SLIDE NAVIGATION BAR */}
      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-3 pointer-events-auto">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-[#050A18]/90 border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2 sm:gap-4">
          {/* Previous Button */}
          <button
            onClick={onPrev}
            disabled={currentSlideIndex === 0}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 text-slate-200 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Slide Dots / Timeline Pills */}
          <div 
            className="flex-1 flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto py-1 px-1 no-scrollbar [&::-webkit-scrollbar]:hidden select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {slides.map((slide, idx) => {
              const isActive = currentSlideIndex === idx;
              return (
                <button
                  key={slide.id}
                  onClick={() => onSelectSlide(idx)}
                  className={`relative py-1.5 px-2 sm:px-2.5 md:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/40 ring-1 ring-blue-400/50'
                      : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-amber-300 animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-mono text-[10px] opacity-70">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="truncate max-w-[80px] sm:max-w-[110px] md:max-w-none">{slide.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-25 disabled:pointer-events-none transition-all shadow-[0_0_15px_rgba(59,130,246,0.35)] cursor-pointer shrink-0"
            title="Next Slide (Right Arrow / Space)"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </footer>
    </>
  );
};
