import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Presenter, OutfitTheme, HostTransitionType, TransitionSpeed } from '../types';
import { Avatar3D } from './Avatar3D';
import { soundFx } from '../utils/soundEffects';
import {
  Sparkles,
  Waves,
  ShieldAlert,
  PartyPopper,
  Wand2,
  Paintbrush,
  FastForward,
  Play,
  Volume2,
} from 'lucide-react';

interface HostSlideTransitionOverlayProps {
  isTransitioning: boolean;
  onMidpoint?: () => void;
  onComplete: () => void;
  activityType?: HostTransitionType;
  speed?: TransitionSpeed;
  rifat: Presenter;
  ratul: Presenter;
  globalOutfit: OutfitTheme;
  targetSlideTitle: string;
  targetSlideNumber: number;
}

const ACTIVITIES: ('curtains' | 'shutter' | 'watersplash' | 'magic' | 'squeegee' | 'confetti')[] = [
  'curtains',
  'shutter',
  'watersplash',
  'magic',
  'squeegee',
  'confetti',
];

export const HostSlideTransitionOverlay: React.FC<HostSlideTransitionOverlayProps> = ({
  isTransitioning,
  onMidpoint,
  onComplete,
  activityType = 'auto',
  speed = 'cinematic',
  rifat,
  ratul,
  globalOutfit,
  targetSlideTitle,
  targetSlideNumber,
}) => {
  const [currentActivity, setCurrentActivity] = useState<'curtains' | 'shutter' | 'watersplash' | 'magic' | 'squeegee' | 'confetti'>('curtains');
  const [phase, setPhase] = useState<'idle' | 'covering' | 'showcase' | 'revealing'>('idle');
  const midpointTriggeredRef = useRef(false);

  // Determine timing values based on selected speed
  // Cinematic is slower and allows full viewing of avatars, props, speech bubbles and next slide card!
  const getTimingConfig = (s?: TransitionSpeed | string) => {
    switch (s) {
      case 'brisk':
        return {
          coverDuration: 0.45,
          showcaseStart: 450,
          midpointTime: 650,
          revealStart: 1100,
          totalDuration: 1550,
          animDuration: 0.45,
        };
      case 'normal':
        return {
          coverDuration: 0.65,
          showcaseStart: 650,
          midpointTime: 950,
          revealStart: 1650,
          totalDuration: 2300,
          animDuration: 0.6,
        };
      case 'cinematic':
      default:
        return {
          coverDuration: 0.85,
          showcaseStart: 850,
          midpointTime: 1200,
          revealStart: 2200,
          totalDuration: 3050,
          animDuration: 0.8,
        };
    }
  };

  const timing = getTimingConfig(speed);

  useEffect(() => {
    if (isTransitioning) {
      midpointTriggeredRef.current = false;

      // Pick activity
      let chosen: 'curtains' | 'shutter' | 'watersplash' | 'magic' | 'squeegee' | 'confetti';
      if (activityType === 'auto' || !activityType) {
        const randIdx = Math.floor(Math.random() * ACTIVITIES.length);
        chosen = ACTIVITIES[randIdx];
      } else {
        chosen = activityType as typeof currentActivity;
      }
      setCurrentActivity(chosen);
      setPhase('covering');

      // Play corresponding audio
      switch (chosen) {
        case 'curtains':
          soundFx.playCurtainRope();
          break;
        case 'shutter':
          soundFx.playShutterSlam();
          break;
        case 'watersplash':
          soundFx.playWaterSplash();
          break;
        case 'magic':
          soundFx.playMagicPortal();
          break;
        case 'squeegee':
          soundFx.playSqueegeeWipe();
          break;
        case 'confetti':
          soundFx.playConfettiPop();
          break;
      }

      // Step 1: Reach full screen cover and enter Showcase phase
      const showcaseTimer = setTimeout(() => {
        setPhase('showcase');
      }, timing.showcaseStart);

      // Step 2: Midpoint: slide change occurs seamlessly under the backdrop
      const midpointTimer = setTimeout(() => {
        if (!midpointTriggeredRef.current && onMidpoint) {
          midpointTriggeredRef.current = true;
          onMidpoint();
        }
      }, timing.midpointTime);

      // Step 3: Begin revealing new slide
      const revealTimer = setTimeout(() => {
        setPhase('revealing');
      }, timing.revealStart);

      // Step 4: Complete transition and restore interactivity
      const completeTimer = setTimeout(() => {
        setPhase('idle');
        onComplete();
      }, timing.totalDuration);

      return () => {
        clearTimeout(showcaseTimer);
        clearTimeout(midpointTimer);
        clearTimeout(revealTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setPhase('idle');
    }
  }, [isTransitioning, activityType, speed]);

  // Handle Quick Skip
  const handleSkip = () => {
    if (!midpointTriggeredRef.current && onMidpoint) {
      midpointTriggeredRef.current = true;
      onMidpoint();
    }
    setPhase('idle');
    onComplete();
  };

  if (!isTransitioning && phase === 'idle') return null;

  const isCovered = phase === 'covering' || phase === 'showcase';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Skip Button in Top Right */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        onClick={handleSkip}
        className="absolute top-5 right-5 z-50 pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/20 hover:border-white/40 text-slate-200 text-xs font-bold shadow-2xl backdrop-blur-md transition-all cursor-pointer group"
      >
        <span className="text-[11px] text-slate-300">Skip Transition</span>
        <FastForward className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>

      {/* ---------------------------------------------------- */}
      {/* 1. CURTAIN PULL TRANSITION */}
      {/* ---------------------------------------------------- */}
      {currentActivity === 'curtains' && (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {/* Left Velvet Curtain */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={isCovered ? { x: '0%' } : { x: '-100%' }}
            transition={{
              duration: timing.animDuration,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute top-0 left-0 w-1/2 h-full z-20 shadow-2xl flex items-center justify-end"
            style={{
              background: 'linear-gradient(90deg, #4a044e 0%, #3b0764 35%, #1e1b4b 75%, #090e24 100%)',
              boxShadow: '20px 0 45px rgba(0,0,0,0.95)',
            }}
          >
            {/* Velvet Drapery Folds Texture */}
            <div className="absolute inset-0 opacity-45 mix-blend-overlay bg-[repeating-linear-gradient(90deg,transparent,transparent_35px,rgba(255,255,255,0.18)_50px,transparent_70px)]" />
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-amber-400/50 to-transparent border-r-4 border-amber-400" />
            {/* Gold Tassel Fringe on edge */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-5">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-2.5 h-10 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 shadow-lg" />
              ))}
            </div>
          </motion.div>

          {/* Right Velvet Curtain */}
          <motion.div
            initial={{ x: '100%' }}
            animate={isCovered ? { x: '0%' } : { x: '100%' }}
            transition={{
              duration: timing.animDuration,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute top-0 right-0 w-1/2 h-full z-20 shadow-2xl flex items-center justify-start"
            style={{
              background: 'linear-gradient(270deg, #4a044e 0%, #3b0764 35%, #1e1b4b 75%, #090e24 100%)',
              boxShadow: '-20px 0 45px rgba(0,0,0,0.95)',
            }}
          >
            <div className="absolute inset-0 opacity-45 mix-blend-overlay bg-[repeating-linear-gradient(90deg,transparent,transparent_35px,rgba(255,255,255,0.18)_50px,transparent_70px)]" />
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-amber-400/50 to-transparent border-l-4 border-amber-400" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-5">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-2.5 h-10 rounded-full bg-gradient-to-b from-amber-300 to-amber-600 shadow-lg" />
              ))}
            </div>
          </motion.div>

          {/* Central Golden Winbridge Medallion Crest */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -30 }}
            animate={
              isCovered
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 0, opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: 0.15, ease: 'backOut' }}
            className="relative z-30 flex flex-col items-center max-w-lg text-center px-4"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 p-2 shadow-[0_0_60px_rgba(245,158,11,0.7)] border-2 border-amber-200 flex items-center justify-center mb-3">
              <div className="w-full h-full rounded-full bg-[#050A18] flex flex-col items-center justify-center text-amber-300 border border-amber-400/40">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold">SLIDE {targetSlideNumber}</span>
                <span className="text-2xl sm:text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">WB</span>
                <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">ANNUAL 2026</span>
              </div>
            </div>

            <div className="px-6 py-2.5 rounded-2xl bg-[#050A18]/95 border-2 border-amber-400/60 shadow-2xl backdrop-blur-xl">
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold mb-0.5">
                ✦ PRESENTING NEXT SECTION ✦
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow">
                {targetSlideTitle}
              </h3>
            </div>
          </motion.div>

          {/* Left Host (Mr. Rifat) Pulling the Rope */}
          <motion.div
            initial={{ x: -220, opacity: 0 }}
            animate={isCovered ? { x: 20, opacity: 1 } : { x: -220, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute left-6 sm:left-12 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              {/* Rope pulled in hands */}
              <div className="absolute top-6 right-3 w-3 h-80 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 rounded-full shadow-2xl rotate-12 -z-10 border border-amber-200/50" />
              <Avatar3D
                presenter={rifat}
                outfitTheme={globalOutfit}
                action="waving"
                size="lg"
                interactive={false}
              />
            </div>
            {/* Host comic speech bubble */}
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={isCovered ? { scale: 1, y: 0 } : { scale: 0 }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="mt-2 px-4 py-2 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 border-2 border-amber-200"
            >
              <span>🎭 Heave-ho! Opening the drapes!</span>
            </motion.div>
          </motion.div>

          {/* Right Host (Mr. Ratul) Pulling the Rope */}
          <motion.div
            initial={{ x: 220, opacity: 0 }}
            animate={isCovered ? { x: -20, opacity: 1 } : { x: 220, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute right-6 sm:right-12 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              {/* Rope pulled in hands */}
              <div className="absolute top-6 left-3 w-3 h-80 bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 rounded-full shadow-2xl -rotate-12 -z-10 border border-amber-200/50" />
              <Avatar3D
                presenter={ratul}
                outfitTheme={globalOutfit}
                action="celebrating"
                size="lg"
                interactive={false}
              />
            </div>
            {/* Host comic speech bubble */}
            <motion.div
              initial={{ scale: 0, y: 10 }}
              animate={isCovered ? { scale: 1, y: 0 } : { scale: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="mt-2 px-4 py-2 rounded-2xl bg-blue-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 border-2 border-blue-200"
            >
              <span>✨ Revealing Slide {targetSlideNumber}!</span>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. INDUSTRIAL CYBER SHUTTER TRANSITION */}
      {/* ---------------------------------------------------- */}
      {currentActivity === 'shutter' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
          {/* Top Descending Blast Shutter Panel */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={isCovered ? { y: '0%' } : { y: '-100%' }}
            transition={{
              duration: timing.animDuration,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute top-0 inset-x-0 h-full z-20 flex flex-col justify-between p-8 bg-gradient-to-b from-[#091124] via-[#050A18] to-[#0d1b38] border-b-8 border-blue-500 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
          >
            {/* High Tech Hazard Chevron Stripes */}
            <div className="w-full h-10 bg-[repeating-linear-gradient(45deg,#3b82f6,#3b82f6_25px,#1e293b_25px,#1e293b_50px)] rounded-2xl border border-blue-400/50 opacity-90 shadow-md" />

            {/* Shutter Center Display */}
            <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-blue-500/20 border border-blue-400/60 text-blue-300 font-mono text-xs font-bold tracking-[0.25em] uppercase shadow-lg">
                <ShieldAlert className="w-4 h-4 text-blue-400 animate-spin" />
                STAGE SECTOR ENGAGED • PROTOCOL 0{targetSlideNumber}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-100 to-indigo-300 drop-shadow-lg">
                {targetSlideTitle}
              </h2>
              <div className="flex items-center gap-4 font-mono text-xs text-slate-300 bg-slate-900/80 px-4 py-1.5 rounded-full border border-blue-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>HYDRAULIC BLAST LOCK ENGAGED • WINBRIDGE TECH</span>
              </div>
            </div>

            {/* Bottom Hazard Stripe */}
            <div className="w-full h-10 bg-[repeating-linear-gradient(-45deg,#3b82f6,#3b82f6_25px,#1e293b_25px,#1e293b_50px)] rounded-2xl border border-blue-400/50 opacity-90 shadow-md" />
          </motion.div>

          {/* Left Host (Mr. Rifat) Pulling Industrial Lever */}
          <motion.div
            initial={{ y: 240, opacity: 0 }}
            animate={isCovered ? { y: 0, opacity: 1 } : { y: 240, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute left-6 sm:left-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            {/* Lever Graphic */}
            <div className="relative">
              <div className="absolute -top-6 right-0 w-4 h-20 bg-gradient-to-t from-red-600 to-red-400 rounded-full border-2 border-red-200 rotate-45 shadow-xl -z-10" />
              <Avatar3D
                presenter={rifat}
                outfitTheme={globalOutfit}
                action="celebrating"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-xl bg-red-500 text-white font-black text-xs sm:text-sm shadow-2xl border border-red-300 flex items-center gap-1.5">
              <span>🚨 Lever Pulled! Shutter Locked!</span>
            </div>
          </motion.div>

          {/* Right Host (Mr. Ratul) Turning Steam Valve */}
          <motion.div
            initial={{ y: 240, opacity: 0 }}
            animate={isCovered ? { y: 0, opacity: 1 } : { y: 240, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute right-6 sm:right-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute -top-3 left-0 w-14 h-14 rounded-full border-4 border-cyan-400 animate-spin -z-10 shadow-lg" />
              <Avatar3D
                presenter={ratul}
                outfitTheme={globalOutfit}
                action="waving"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl border border-cyan-200 flex items-center gap-1.5">
              <span>⚙️ Steam Pressure Normal! Ready!</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. WATER SPLASH / SUPER SOAKER BLAST */}
      {/* ---------------------------------------------------- */}
      {currentActivity === 'watersplash' && (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {/* Big Cartoon Water Wave Rising Across Screen */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={isCovered ? { y: '0%', opacity: 1 } : { y: '-100%', opacity: 0.3 }}
            transition={{
              duration: timing.animDuration,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-t from-cyan-700 via-blue-600/95 to-sky-400/95 backdrop-blur-xl"
          >
            {/* Water Ripple Waves Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.35)_0%,transparent_70%)] animate-pulse" />

            {/* Floating Water Droplets & Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-30, -180],
                    x: [Math.sin(i) * 40, Math.cos(i) * 50],
                    scale: [0.9, 1.4, 1.0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.4 + (i % 4) * 0.3,
                    ease: 'easeOut',
                  }}
                  style={{
                    left: `${(i * 5.5) % 95}%`,
                    top: `${45 + (i * 4) % 45}%`,
                  }}
                  className="absolute w-9 h-9 rounded-full bg-white/40 border-2 border-white/80 shadow-xl backdrop-blur-md flex items-center justify-center text-sm"
                >
                  💧
                </motion.div>
              ))}
            </div>

            {/* Center Splash Title */}
            <div className="relative z-30 text-center px-8 py-5 rounded-3xl bg-white/15 backdrop-blur-2xl border-2 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.4)] max-w-xl mx-4">
              <div className="inline-flex items-center gap-2 text-cyan-100 font-black text-xs tracking-widest uppercase mb-1.5">
                <Waves className="w-5 h-5 text-cyan-200 animate-bounce" />
                SPLASH WASH TRANSITION • SLIDE {targetSlideNumber}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white drop-shadow-md">
                {targetSlideTitle}
              </h2>
            </div>
          </motion.div>

          {/* Left Host (Mr. Rifat) Blasting Super Soaker */}
          <motion.div
            initial={{ x: -200, rotate: -15 }}
            animate={isCovered ? { x: 15, rotate: 0 } : { x: -200, rotate: 15 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute left-6 sm:left-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              {/* Water blaster stream */}
              <div className="absolute top-14 right-0 w-44 h-8 bg-gradient-to-r from-cyan-300 via-blue-300 to-transparent rounded-full blur-[1px] animate-pulse -z-10 shadow-lg" />
              <Avatar3D
                presenter={rifat}
                outfitTheme={globalOutfit === 'formal' ? 'festive' : globalOutfit}
                action="celebrating"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-2xl bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl border-2 border-white flex items-center gap-1.5">
              <span>🔫 Super Soaker Blast! 🌊</span>
            </div>
          </motion.div>

          {/* Right Host (Mr. Ratul) Splashing Water Bucket */}
          <motion.div
            initial={{ x: 200, rotate: 15 }}
            animate={isCovered ? { x: -15, rotate: 0 } : { x: 200, rotate: -15 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute right-6 sm:right-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute top-8 left-0 text-4xl animate-bounce">🪣</div>
              <Avatar3D
                presenter={ratul}
                outfitTheme={globalOutfit === 'formal' ? 'festive' : globalOutfit}
                action="dancing"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-2xl bg-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl border-2 border-white flex items-center gap-1.5">
              <span>💦 Bucket Splash! Fresh View!</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. MAGIC PORTAL & STARDUST VORTEX */}
      {/* ---------------------------------------------------- */}
      {currentActivity === 'magic' && (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {/* Swirling Cosmic Galaxy Stardust Ring */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={
              isCovered
                ? { scale: 3.8, rotate: 180, opacity: 1 }
                : { scale: 6, rotate: 360, opacity: 0 }
            }
            transition={{
              duration: timing.animDuration * 1.1,
              ease: 'easeInOut',
            }}
            className="absolute w-96 h-96 rounded-full z-20 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #6366f1 0%, #a855f7 35%, #ec4899 65%, #050A18 100%)',
              boxShadow: '0 0 120px rgba(168,85,247,0.85)',
            }}
          />

          {/* Magic Center Flash & Rune Ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isCovered
                ? { scale: 1, opacity: 1 }
                : { scale: 1.6, opacity: 0 }
            }
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.15 }}
            className="relative z-30 flex flex-col items-center text-center p-6 max-w-xl mx-4"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-pink-400 to-indigo-400 p-1.5 flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.9)] mb-3 animate-spin">
              <div className="w-full h-full rounded-full bg-[#050A18] flex items-center justify-center text-amber-300">
                <Sparkles className="w-12 h-12 text-amber-300" />
              </div>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-slate-950/95 border-2 border-purple-400/70 shadow-2xl backdrop-blur-xl">
              <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-widest">
                COSMIC WARP GATEWAY • SLIDE {targetSlideNumber}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                {targetSlideTitle}
              </h3>
            </div>
          </motion.div>

          {/* Left Host (Mr. Rifat) Casting Magic Wand */}
          <motion.div
            initial={{ x: -220, scale: 0.8 }}
            animate={isCovered ? { x: 20, scale: 1 } : { x: -220, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute left-6 sm:left-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute top-6 right-2 text-3xl animate-spin">🪄</div>
              <Avatar3D
                presenter={rifat}
                outfitTheme={globalOutfit}
                action="speaking"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-xl border border-purple-300 flex items-center gap-1.5">
              <span>🪄 Abracadabra Warp! ✨</span>
            </div>
          </motion.div>

          {/* Right Host (Mr. Ratul) Casting Star Spell */}
          <motion.div
            initial={{ x: 220, scale: 0.8 }}
            animate={isCovered ? { x: -20, scale: 1 } : { x: 220, scale: 0.8 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute right-6 sm:right-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute top-6 left-2 text-3xl animate-pulse">🌟</div>
              <Avatar3D
                presenter={ratul}
                outfitTheme={globalOutfit}
                action="celebrating"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl border border-pink-200 flex items-center gap-1.5">
              <span>✨ Dimension Portal Open!</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. SQUEEGEE GLASS CLEAN WIPE */}
      {/* ---------------------------------------------------- */}
      {currentActivity === 'squeegee' && (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {/* Soapy Screen Foam Wipe */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={isCovered ? { x: '0%' } : { x: '100%' }}
            transition={{
              duration: timing.animDuration,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 z-20 bg-gradient-to-r from-blue-950/95 via-indigo-950/95 to-slate-950/95 backdrop-blur-2xl border-r-8 border-cyan-400 flex items-center justify-center"
          >
            {/* Foam Squeegee Blade Line */}
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-cyan-300 via-white to-transparent shadow-[0_0_40px_#22d3ee]" />

            {/* Bubble Suds Pattern */}
            <div className="flex flex-col items-center text-center p-8 z-30 max-w-xl mx-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-xs uppercase mb-3 border border-cyan-400/50 shadow-lg">
                <Paintbrush className="w-4 h-4 text-cyan-300" />
                SQUEEGEE GLASS WASH • SLIDE {targetSlideNumber}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white drop-shadow">
                {targetSlideTitle}
              </h2>
            </div>
          </motion.div>

          {/* Both Hosts Running Across with Giant Squeegee */}
          <motion.div
            initial={{ x: '-120vw' }}
            animate={isCovered ? { x: '0vw' } : { x: '120vw' }}
            transition={{ duration: timing.animDuration * 1.1, ease: 'easeInOut' }}
            className="absolute bottom-8 sm:bottom-12 z-40 flex items-end gap-8"
          >
            <div className="flex flex-col items-center">
              <Avatar3D
                presenter={rifat}
                outfitTheme={globalOutfit}
                action="dancing"
                size="lg"
                interactive={false}
              />
              <div className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl">
                🧽 Squeegee on!
              </div>
            </div>

            <div className="flex flex-col items-center">
              <Avatar3D
                presenter={ratul}
                outfitTheme={globalOutfit}
                action="waving"
                size="lg"
                interactive={false}
              />
              <div className="mt-2 px-4 py-1.5 rounded-xl bg-blue-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl">
                ✨ Polishing the stage!
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. DUAL CONFETTI CANNON BLAST */}
      {/* ---------------------------------------------------- */}
      {currentActivity === 'confetti' && (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          {/* Confetti Particle Explosion Blanket */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isCovered
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.2 }
            }
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/95 via-[#050A18]/95 to-purple-950/95 backdrop-blur-xl"
          >
            {/* 3D Confetti Ribbons Falling */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-40, 700],
                    rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
                    x: [0, Math.sin(i) * 80],
                  }}
                  transition={{
                    duration: 1.2 + (i % 5) * 0.15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    left: `${(i * 3.5) % 96}%`,
                    top: `${(i * 2.5) % 40}%`,
                  }}
                  className={`absolute w-3.5 h-10 rounded-sm shadow-lg ${
                    i % 4 === 0
                      ? 'bg-amber-400'
                      : i % 4 === 1
                      ? 'bg-rose-500'
                      : i % 4 === 2
                      ? 'bg-cyan-400'
                      : 'bg-emerald-400'
                  }`}
                />
              ))}
            </div>

            <div className="relative z-30 text-center px-10 py-6 rounded-3xl bg-white/10 border-2 border-amber-400/50 shadow-2xl backdrop-blur-2xl max-w-xl mx-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2.5 border border-amber-400/40">
                <PartyPopper className="w-4 h-4 text-amber-400" />
                CELEBRATION CANNON BLAST • SLIDE {targetSlideNumber}
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-rose-300 drop-shadow">
                {targetSlideTitle}
              </h2>
            </div>
          </motion.div>

          {/* Left Host (Mr. Rifat) Firing Cannon */}
          <motion.div
            initial={{ x: -200, y: 60 }}
            animate={isCovered ? { x: 15, y: 0 } : { x: -200, y: 60 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute left-6 sm:left-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute top-10 right-0 text-4xl animate-bounce">🎊</div>
              <Avatar3D
                presenter={rifat}
                outfitTheme={globalOutfit === 'formal' ? 'festive' : globalOutfit}
                action="celebrating"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl border border-amber-200 flex items-center gap-1.5">
              <span>💥 3, 2, 1... FIRE CANNON!</span>
            </div>
          </motion.div>

          {/* Right Host (Mr. Ratul) Firing Cannon */}
          <motion.div
            initial={{ x: 200, y: 60 }}
            animate={isCovered ? { x: -15, y: 0 } : { x: 200, y: 60 }}
            transition={{ duration: 0.6, ease: 'backOut', delay: 0.1 }}
            className="absolute right-6 sm:right-14 bottom-8 sm:bottom-12 z-40 flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute top-10 left-0 text-4xl animate-bounce">🎉</div>
              <Avatar3D
                presenter={ratul}
                outfitTheme={globalOutfit === 'formal' ? 'festive' : globalOutfit}
                action="celebrating"
                size="lg"
                interactive={false}
              />
            </div>
            <div className="mt-2 px-4 py-1.5 rounded-2xl bg-rose-500 text-white font-black text-xs sm:text-sm shadow-2xl border border-rose-300 flex items-center gap-1.5">
              <span>🎉 Confetti Shower! Enjoy!</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
