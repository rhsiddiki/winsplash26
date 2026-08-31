import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { SlideData, OutfitTheme } from '../../types';
import { Avatar3D } from '../Avatar3D';
import { PartyPopper, Music, Gift, Sparkles, Trophy, Disc, Camera, RefreshCw, Volume2 } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface HostFloorFinaleSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const HostFloorFinaleSlide: React.FC<HostFloorFinaleSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activeGame, setActiveGame] = useState<'wheel' | 'raffle' | 'music'>('wheel');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  // Raffle state
  const [raffleNumber, setRaffleNumber] = useState<string | null>(null);
  const [isDrawingRaffle, setIsDrawingRaffle] = useState(false);

  const rifat = slide.presenters.find((p) => p.id === 'rifat') || slide.presenters[0];
  const ratul = slide.presenters.find((p) => p.id === 'ratul') || slide.presenters[1];

  const wheelPrizes = [
    '🎁 Smart Tech Gadget',
    '🏖️ 1 Extra Paid Vacation Day',
    '🍽️ VIP Lunch with Directors',
    '🎧 Wireless ANC Headphones',
    '🍫 Luxury Gift Hamper',
    '🎬 Movie Night Tickets x2',
    '🌟 Winbridge Champion Trophy',
    '📦 Mystery Treasure Box',
  ];

  const spinTheWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonPrize(null);
    soundFx.playDrumRoll(3.0);

    const randomDegrees = 1440 + Math.floor(Math.random() * 360);
    const newRotation = wheelRotation + randomDegrees;
    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const prizeIndex = Math.floor(((newRotation % 360) / 360) * wheelPrizes.length);
      const prize = wheelPrizes[wheelPrizes.length - 1 - prizeIndex] || wheelPrizes[0];
      setWonPrize(prize);
      soundFx.playFanfare();

      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#ec4899', '#38bdf8'],
      });
    }, 3000);
  };

  const drawRaffle = () => {
    if (isDrawingRaffle) return;
    setIsDrawingRaffle(true);
    setRaffleNumber(null);
    soundFx.playDrumRoll(2.0);

    let counter = 0;
    const interval = setInterval(() => {
      setRaffleNumber(`WB-${Math.floor(1000 + Math.random() * 9000)}`);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsDrawingRaffle(false);
        soundFx.playFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }, 100);
  };

  const triggerGrandConfetti = () => {
    soundFx.playFanfare();
    confetti({
      particleCount: 180,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#10b981', '#fbbf24', '#f43f5e', '#a855f7', '#0284c7'],
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <PartyPopper className="w-3.5 h-3.5 text-blue-400" />
          SESSION 09 • THE FLOOR IS YOURS — GRAND FINALE
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-amber-200">
          Picnic Fun Arena & Celebration
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-xl mx-auto">
          Hosts Mr. Rifat & Mr. Ratul invite everyone to celebrate, play games, and enjoy the party!
        </p>
      </div>

      {/* DUAL HOSTS POD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Host */}
        <div className="lg:col-span-3 flex flex-col items-center justify-end">
          <div className="w-full flex flex-col items-center relative py-2">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <Avatar3D
              presenter={rifat}
              outfitTheme={globalOutfit === 'formal' ? 'festive' : globalOutfit}
              action="celebrating"
              size="stage"
              showSpeechBubble={false}
              onOutfitChange={(theme) => onPresenterOutfitChange?.(rifat.id, theme)}
            />
          </div>
        </div>

        {/* Center: Interactive Picnic Fun Games */}
        <div className="lg:col-span-6 space-y-4">
          {/* Game Switcher Tabs */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md justify-center gap-2 text-xs">
            <button
              onClick={() => {
                setActiveGame('wheel');
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeGame === 'wheel' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              Spin the Fortune Wheel
            </button>
            <button
              onClick={() => {
                setActiveGame('raffle');
                soundFx.playClick();
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeGame === 'raffle' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              Lucky Raffle Draw
            </button>
          </div>

          {/* GAME 1: SPIN THE FORTUNE WHEEL */}
          {activeGame === 'wheel' && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/90 to-[#050A18] border border-white/10 shadow-2xl flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-2">
                {/* Pointer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-6 h-6 bg-rose-500 clip-path-triangle rotate-180 drop-shadow-md text-white flex items-center justify-center font-bold text-xs">
                  ▼
                </div>

                {/* Animated Rotating Wheel */}
                <div
                  className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-transform ease-out overflow-hidden relative"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transitionDuration: isSpinning ? '3s' : '0s',
                    background: 'conic-gradient(#3b82f6 0% 12.5%, #06b6d4 12.5% 25%, #6366f1 25% 37.5%, #ec4899 37.5% 50%, #f43f5e 50% 62.5%, #f59e0b 62.5% 75%, #10b981 75% 87.5%, #8b5cf6 87.5% 100%)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#050A18] border-2 border-amber-400 flex items-center justify-center text-amber-300 font-black text-xs shadow-xl z-10">
                      WB
                    </div>
                  </div>
                </div>
              </div>

              {/* Prize Result */}
              {wonPrize && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 font-extrabold text-sm sm:text-base shadow-lg flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5 text-amber-400" />
                  You Won: {wonPrize}!
                </motion.div>
              )}

              <button
                onClick={spinTheWheel}
                disabled={isSpinning}
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isSpinning ? 'Spinning the Wheel...' : 'Spin the Wheel!'}
              </button>
            </div>
          )}

          {/* GAME 2: LUCKY RAFFLE DRAW */}
          {activeGame === 'raffle' && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/90 to-[#050A18] border border-white/10 shadow-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3">
                <Gift className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold text-white mb-1">Annual Picnic Lucky Raffle</h4>
              <p className="text-xs text-slate-400 mb-4 max-w-sm">
                Enter all registered ticket IDs for the grand surprise tech hamper giveaway.
              </p>

              <div className="w-full max-w-xs p-5 rounded-2xl bg-[#050A18] border-2 border-dashed border-blue-500/40 flex flex-col items-center justify-center my-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Lucky Ticket Number
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-blue-400 tracking-wider">
                  {raffleNumber || 'WB-????'}
                </div>
              </div>

              <button
                onClick={drawRaffle}
                disabled={isDrawingRaffle}
                className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-black text-sm shadow-xl flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isDrawingRaffle ? 'Drawing Winner...' : 'Draw Lucky Ticket!'}
              </button>
            </div>
          )}

          {/* Grand Confetti Cannon Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={triggerGrandConfetti}
              className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Group Photo Confetti Shower!
            </button>
          </div>
        </div>

        {/* Right Host */}
        <div className="lg:col-span-3 flex flex-col items-center justify-end">
          <div className="w-full flex flex-col items-center relative py-2">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <Avatar3D
              presenter={ratul}
              outfitTheme={globalOutfit === 'formal' ? 'festive' : globalOutfit}
              action="dancing"
              size="stage"
              showSpeechBubble={false}
              onOutfitChange={(theme) => onPresenterOutfitChange?.(ratul.id, theme)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
