import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, X, Award, Crown, CheckCircle2, Flame } from 'lucide-react';
import { AwardNominee } from '../types';
import { soundFx } from '../utils/soundEffects';

interface AwardCeremonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  awardTitle: string;
  nominees?: AwardNominee[];
  winner?: AwardNominee;
  singleCandidate?: AwardNominee;
  departmentName: string;
}

export const AwardCeremonyModal: React.FC<AwardCeremonyModalProps> = ({
  isOpen,
  onClose,
  awardTitle,
  nominees = [],
  winner,
  singleCandidate,
  departmentName,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // If single candidate, auto-reveal mode is active
  const actualWinner = singleCandidate || winner || nominees.find((n) => n.isWinner) || nominees[0];

  const triggerCelebration = () => {
    // Drum roll sound
    soundFx.playDrumRoll(2.0);
    setCountdown(3);

    const timer1 = setTimeout(() => {
      setCountdown(2);
      soundFx.playLaunchCountdownBeep(false);
    }, 600);

    const timer2 = setTimeout(() => {
      setCountdown(1);
      soundFx.playLaunchCountdownBeep(false);
    }, 1200);

    const timer3 = setTimeout(() => {
      setCountdown(null);
      setRevealed(true);
      soundFx.playFanfare();

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fbbf24', '#f59e0b', '#0284c7', '#ec4899'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.7 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.7 },
        });
      }, 300);
    }, 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050A18]/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-blue-900/20 via-[#0a1026]/95 to-[#050A18] border border-white/10 shadow-2xl p-6 sm:p-8 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Department Tag & Award Title */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            {departmentName} Annual Awards
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-amber-200 mb-2">
            {awardTitle}
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
            Recognizing relentless excellence, innovation, and outstanding contributions to Winbridge Tech.
          </p>

          {/* SINGLE CANDIDATE SPECIAL APPRECIATION MODE */}
          {singleCandidate ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="my-6 p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#0a1026]/90 to-[#050A18] border-2 border-amber-500/50 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.2)]"
            >
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                {/* 3D Animated Gold Trophy */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-2xl flex items-center justify-center mb-4"
                >
                  <div className="w-full h-full rounded-full bg-[#050A18] flex items-center justify-center text-amber-400">
                    <Trophy className="w-12 h-12" />
                  </div>
                </motion.div>

                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-widest mb-3">
                  <Crown className="w-3.5 h-3.5" />
                  Honoree Spotlight
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  {singleCandidate.name}
                </h3>
                <p className="text-base text-blue-300 font-medium mb-4">{singleCandidate.role}</p>

                <div className="max-w-xl p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm leading-relaxed mb-4">
                  "{singleCandidate.achievement}"
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500/30 to-blue-500/30 border border-amber-400/40 text-amber-200 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  {singleCandidate.metric}
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* NOMINEES GRID (Before Reveal) */}
              {!revealed && (
                <div className="my-6">
                  <h4 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">
                    Official Nominees
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {nominees.map((nominee, idx) => (
                      <motion.div
                        key={nominee.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col items-center text-center shadow-lg relative group"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-900 border border-blue-500/30 flex items-center justify-center text-blue-300 font-extrabold text-xl mb-3 shadow-inner group-hover:scale-105 transition-transform">
                          {nominee.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <h5 className="font-bold text-slate-100 text-base">{nominee.name}</h5>
                        <p className="text-xs text-blue-300 mb-2">{nominee.role}</p>
                        <p className="text-xs text-slate-400 line-clamp-2">{nominee.achievement}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Suspense Reveal Button / Countdown */}
                  <div className="mt-8">
                    {countdown !== null ? (
                      <motion.div
                        key={countdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400 animate-pulse"
                      >
                        {countdown}
                      </motion.div>
                    ) : (
                      <button
                        onClick={triggerCelebration}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base sm:text-lg shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2.5 mx-auto active:scale-95 cursor-pointer"
                      >
                        <Sparkles className="w-5 h-5" />
                        Drum Roll & Reveal Winner!
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* WINNER REVEALED CARD */}
              {revealed && actualWinner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, rotateX: 30 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="my-6 p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#0a1026]/90 to-[#050A18] border-2 border-amber-400/80 relative overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.25)]"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-2xl flex items-center justify-center mb-3"
                    >
                      <div className="w-full h-full rounded-full bg-[#050A18] flex items-center justify-center text-amber-400">
                        <Crown className="w-10 h-10" />
                      </div>
                    </motion.div>

                    <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-widest mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      Winner Revealed!
                    </div>

                    <h3 className="text-3xl sm:text-5xl font-black text-white mb-1">
                      {actualWinner.name}
                    </h3>
                    <p className="text-base sm:text-lg text-blue-300 font-semibold mb-4">{actualWinner.role}</p>

                    <div className="max-w-xl p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 text-sm leading-relaxed mb-4">
                      "{actualWinner.achievement}"
                    </div>

                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-400/50 text-amber-200 text-sm font-bold shadow-lg">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Key Metric: {actualWinner.metric}
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Action button */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
            >
              Close Ceremony
            </button>
            {revealed && (
              <button
                onClick={() => {
                  soundFx.playFanfare();
                  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-sm font-bold shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                More Confetti & Cheers!
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
