import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutfitTheme, Presenter } from '../../types';
import { Avatar3D } from '../Avatar3D';
import { Crown, Mic, Sparkles, CheckCircle, Volume2, Quote, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

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
  const currentPresenter: Presenter = slide.presenters[selectedIdx] || slide.presenters[0];

  const handleSpeakerChange = (index: number) => {
    setSelectedIdx(index);
    soundFx.playClick();
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
                <h4 className="font-bold text-xs sm:text-sm">{presenter.name}</h4>
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

          {/* Left Avatar Stage */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 w-full flex flex-col items-center">
              <Avatar3D
                presenter={currentPresenter}
                outfitTheme={globalOutfit}
                action="speaking"
                size="hero"
                showSpeechBubble={false}
                onOutfitChange={(theme) => onPresenterOutfitChange?.(currentPresenter.id, theme)}
              />
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
