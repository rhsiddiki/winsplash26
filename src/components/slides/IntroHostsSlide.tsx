import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SlideData, OutfitTheme } from '../../types';
import { Avatar3D } from '../Avatar3D';
import { Sparkles, Heart, Crown, Mic2, Star, Calendar, Users, Music } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface IntroHostsSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const IntroHostsSlide: React.FC<IntroHostsSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activeHost, setActiveHost] = useState<'both' | 'rifat' | 'ratul'>('both');
  const [honorCheers, setHonorCheers] = useState(0);

  const rifat = slide.presenters.find((p) => p.id === 'rifat') || slide.presenters[0];
  const ratul = slide.presenters.find((p) => p.id === 'ratul') || slide.presenters[1];

  const handleHonorBlessings = () => {
    setHonorCheers((prev) => prev + 1);
    soundFx.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8'],
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Top Banner Tag */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-3 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          SESSION 01 • GRAND OPENING CEREMONY
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200 tracking-tight"
        >
          Winbridge Tech Annual Picnic 2025
        </motion.h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2 font-normal">
          {slide.subtitle}
        </p>
      </div>

      {/* DUAL HOSTS 3D STAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Host: Mr. Rifat */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="p-1 rounded-3xl bg-gradient-to-br from-blue-900/25 via-slate-900/50 to-indigo-900/30 backdrop-blur-xl border border-white/10 shadow-2xl w-full flex flex-col items-center py-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <Avatar3D
                presenter={rifat}
                outfitTheme={globalOutfit}
                action="speaking"
                size="lg"
                showSpeechBubble={activeHost === 'both' || activeHost === 'rifat'}
                onOutfitChange={(theme) => onPresenterOutfitChange?.(rifat.id, theme)}
              />
            </div>
          </motion.div>
        </div>

        {/* Center: Stage Teleprompter & Honorable Fathers Special Tribute */}
        <div className="lg:col-span-4 space-y-5">
          {/* SPECIAL HONOR & GRATITUDE CARD FOR FATHERS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/15 via-[#0a1026]/90 to-[#050A18] border-2 border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.15)] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              <Crown className="w-3.5 h-3.5" />
              Special Honorable Guests
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-amber-100 mb-1">
              Fathers of MD & Chairman
            </h3>
            <p className="text-xs text-amber-200/90 mb-4 leading-relaxed font-medium">
              We extend our heartfelt respect and highest gratitude to the respected fathers of our Managing Director (MD Fakhrul Hasan) and Chairman (Hasib Khalid Bin Noor). Your values and prayers illuminate our journey.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4 text-left">
              <div className="p-3 rounded-2xl bg-white/5 border border-amber-500/30">
                <p className="text-[11px] font-bold text-amber-300">Father of MD</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Foundational Pillar of Values & Integrity</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-amber-500/30">
                <p className="text-[11px] font-bold text-amber-300">Father of Chairman</p>
                <p className="text-[10px] text-slate-300 mt-0.5">Guiding Light of Wisdom & Ethics</p>
              </div>
            </div>

            <button
              onClick={handleHonorBlessings}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              Standing Ovation & Tribute {honorCheers > 0 && `(${honorCheers})`}
            </button>
          </motion.div>

          {/* Quick Host Navigation Switcher */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl justify-center text-xs gap-1">
            <button
              onClick={() => {
                setActiveHost('both');
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl transition-all ${activeHost === 'both' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Both Hosts
            </button>
            <button
              onClick={() => {
                setActiveHost('rifat');
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl transition-all ${activeHost === 'rifat' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mr. Rifat
            </button>
            <button
              onClick={() => {
                setActiveHost('ratul');
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl transition-all ${activeHost === 'ratul' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mr. Ratul
            </button>
          </div>
        </div>

        {/* Right Host: Mr. Ratul */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full flex flex-col items-center"
          >
            <div className="p-1 rounded-3xl bg-gradient-to-br from-indigo-900/25 via-slate-900/50 to-blue-900/30 backdrop-blur-xl border border-white/10 shadow-2xl w-full flex flex-col items-center py-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <Avatar3D
                presenter={ratul}
                outfitTheme={globalOutfit}
                action="waving"
                size="lg"
                showSpeechBubble={activeHost === 'both' || activeHost === 'ratul'}
                onOutfitChange={(theme) => onPresenterOutfitChange?.(ratul.id, theme)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Program Agenda / Sequence Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
        {[
          { step: '01', title: 'Executive Speeches', desc: 'MD, Chairman, AVP', icon: Crown },
          { step: '02', title: 'Department Data', desc: 'Preservation, Commercial, R&D', icon: Users },
          { step: '03', title: 'Awards & Honors', desc: 'Top Stars & Retained Pillars', icon: Star },
          { step: '04', title: 'New Web Launch & DJ', desc: 'Portal Unveil & Picnic Games', icon: Music },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                {item.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
