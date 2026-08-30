import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData } from '../types';
import { X, Mic, Clock, FileText, Sparkles, ChevronRight } from 'lucide-react';

interface SlidePresenterNotesProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: SlideData;
  slideIndex: number;
  totalSlides: number;
}

export const SlidePresenterNotes: React.FC<SlidePresenterNotesProps> = ({
  isOpen,
  onClose,
  currentSlide,
  slideIndex,
  totalSlides,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#050A18]/95 border-l border-white/10 backdrop-blur-2xl shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Mic className="w-4 h-4" />
              Presenter Teleprompter & Notes
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Slide Info */}
          <div>
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-[0.2em]">
              Slide {slideIndex + 1} of {totalSlides} • {currentSlide.category}
            </div>
            <h3 className="text-xl font-black text-white mt-1">{currentSlide.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentSlide.subtitle}</p>
          </div>

          {/* On Stage Presenters */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              On Stage Now:
            </span>
            <div className="space-y-2">
              {currentSlide.presenters.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">{p.name}</h5>
                    <p className="text-[11px] text-blue-400">{p.designation}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                    Live
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Talking Points / Prompts */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Talking Points & Cues:
            </span>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {currentSlide.speechNotes ? (
                currentSlide.speechNotes.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{note}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">No specific cues added for this slide.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Press Space / Arrow keys to navigate</span>
          <span className="text-blue-400 font-semibold">Winbridge Tech</span>
        </div>
      </div>
    </AnimatePresence>
  );
};
