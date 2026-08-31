import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutfitTheme, HonorableGuest } from '../../types';
import { Avatar3D } from '../Avatar3D';
import {
  Sparkles,
  Heart,
  Crown,
  Star,
  Users,
  Music,
  ArrowRight,
  ArrowLeft,
  PartyPopper,
  Camera,
  Check,
  Flame,
  Award,
  Flower2,
  Calendar,
  Volume2,
} from 'lucide-react';
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
  // Step 1: 'kickoff' (Welcome & Event Kickoff - Guests HIDDEN)
  // Step 2: 'honorable_guests' (Hosts thank & honor the special guests with photos & names)
  const [currentStep, setCurrentStep] = useState<'kickoff' | 'honorable_guests'>('kickoff');
  const [activeHost, setActiveHost] = useState<'both' | 'rifat' | 'ratul'>('both');
  const [ovationCount, setOvationCount] = useState(0);
  const [blessingsCount, setBlessingsCount] = useState(0);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [photoInputUrl, setPhotoInputUrl] = useState('');

  // Honorable Guests Data with local state for custom photo/name updates
  const [guests, setGuests] = useState<HonorableGuest[]>(() => {
    if (slide.honorableGuests && slide.honorableGuests.length > 0) {
      return slide.honorableGuests;
    }
    return [
      {
        id: 'father_md',
        name: 'Alhaj Md. Fakhruddin Hasan',
        relation: 'Respected Father of Managing Director',
        title: 'Special Honorable Guest',
        badge: 'Foundational Pillar & Values Guide',
        quote: 'Integrity, honest hard work, and steadfast dedication are the true currency of lasting success.',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        blessingPoints: [
          'Foundational inspiration & ethical guide for MD Fakhrul Hasan',
          'Pillar of perseverance, honesty, and family values',
          'Enduring prayers and blessings for Winbridge Tech growth',
        ],
        avatarConfig: {
          gender: 'male',
          skinTone: '#dfa675',
          hairColor: '#e2e8f0',
          hairStyle: 'short',
          facialHair: 'beard',
          glasses: true,
          attire: 'royal-sherwani',
        },
      },
      {
        id: 'father_chairman',
        name: 'Alhaj Khalid Noor',
        relation: 'Respected Father of Chairman',
        title: 'Special Honorable Guest',
        badge: 'Guiding Light of Wisdom & Ethics',
        quote: 'May Winbridge continuously thrive in unity, wisdom, and noble service to innovation and society.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
        blessingPoints: [
          'Guiding mentor & wisdom inspiration for Chairman Hasib Khalid Bin Noor',
          'Beacon of visionary patience, noble ethics, and unity',
          'Warmest prayers and heartfelt blessings for the entire team',
        ],
        avatarConfig: {
          gender: 'male',
          skinTone: '#e2a76f',
          hairColor: '#cbd5e1',
          hairStyle: 'short',
          facialHair: 'beard',
          glasses: false,
          attire: 'royal-sherwani',
        },
      },
    ];
  });

  const rifat = slide.presenters.find((p) => p.id === 'rifat') || slide.presenters[0];
  const ratul = slide.presenters.find((p) => p.id === 'ratul') || slide.presenters[1];

  // Advance to Step 2: Unveil & Thank Honorable Guests
  const handleProceedToHonorableGuests = () => {
    setCurrentStep('honorable_guests');
    soundFx.playFanfare();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f59e0b', '#38bdf8', '#a855f7'],
    });
  };

  // Standing Ovation Ceremony
  const handleStandingOvation = () => {
    setOvationCount((prev) => prev + 1);
    soundFx.playFanfare();
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8', '#ec4899'],
    });
  };

  // Heartfelt Prayers / Du'a
  const handleOfferBlessings = () => {
    setBlessingsCount((prev) => prev + 1);
    soundFx.playMagicPortal();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#34d399', '#6ee7b7', '#fef08a', '#93c5fd'],
    });
  };

  // Update Guest Photo URL
  const handleSavePhotoUrl = (guestId: string) => {
    if (photoInputUrl.trim()) {
      setGuests((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, photoUrl: photoInputUrl.trim() } : g))
      );
    }
    setEditingGuestId(null);
    setPhotoInputUrl('');
    soundFx.playClick();
  };

  // Custom speech bubbles based on active step
  const getRifatSpeech = () => {
    if (currentStep === 'kickoff') {
      return '🎉 Welcome Winbridge family to Annual Picnic 2026! Today we celebrate our unstoppable journey, unity, and togetherness!';
    }
    return '👑 With deep respect and heartfelt gratitude, we welcome our Special Honorable Guests: The beloved fathers of our MD and Chairman!';
  };

  const getRatulSpeech = () => {
    if (currentStep === 'kickoff') {
      return '✨ Get ready for an electrifying day with departmental spotlights, award reveals, grand website launch, and unforgettable picnic games!';
    }
    return '💐 A standing ovation to our respected fathers! Your foundational wisdom, prayers, and noble values guide Winbridge Tech forward!';
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* TOP HEADER & STEP INDICATOR */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            SESSION 01 • OPENING CEREMONY
          </motion.div>
        </div>

        <motion.h1
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200 tracking-tight"
        >
          {currentStep === 'kickoff'
            ? 'Winbridge Tech Annual Picnic 2026'
            : 'Royal Tribute to Special Honorable Guests'}
        </motion.h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
          {currentStep === 'kickoff'
            ? slide.subtitle
            : 'Extending our deepest respect, gratitude, and heartfelt prayers to the respected fathers of our MD and Chairman.'}
        </p>

        {/* STEPPER PILLS */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setCurrentStep('kickoff');
              soundFx.playClick();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              currentStep === 'kickoff'
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] ring-1 ring-blue-400'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            <span>🎪 Step 1: Welcome & Kickoff</span>
          </button>

          <span className="text-slate-500 text-xs">➔</span>

          <button
            onClick={() => {
              setCurrentStep('honorable_guests');
              soundFx.playFanfare();
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              currentStep === 'honorable_guests'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-1 ring-amber-300 font-extrabold'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400/50'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Step 2: Honorable Guests Tribute</span>
            {currentStep === 'kickoff' && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* 3D HOSTS STAGE & CENTER CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
        {/* Left Host: Mr. Rifat - Standing Tall on Stage (Left Flank) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-end">
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full flex flex-col items-center relative py-2"
          >
            {/* Ambient Spotlight Glow behind Host */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

            <Avatar3D
              presenter={rifat}
              outfitTheme={globalOutfit}
              action={currentStep === 'honorable_guests' ? 'celebrating' : 'speaking'}
              size="stage"
              showSpeechBubble={false}
              onOutfitChange={(theme) => onPresenterOutfitChange?.(rifat.id, theme)}
            />

            {/* Floating Speech Dialogue Pill */}
            {(activeHost === 'both' || activeHost === 'rifat') && (
              <motion.div
                key={`rifat-${currentStep}`}
                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`mt-2 p-3 rounded-2xl text-xs font-medium border shadow-xl backdrop-blur-md max-w-xs text-center ${
                  currentStep === 'honorable_guests'
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-blue-900/60 border-blue-400/40 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                }`}
              >
                <p className="leading-relaxed font-semibold">{getRifatSpeech()}</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* CENTER STAGE CONTENT */}
        <div className="lg:col-span-6 space-y-4">
          <AnimatePresence mode="wait">
            {/* ---------------------------------------------------- */}
            {/* STEP 1: WELCOME & EVENT KICKOFF (Guests HIDDEN) */}
            {/* ---------------------------------------------------- */}
            {currentStep === 'kickoff' && (
              <motion.div
                key="step1-kickoff"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Event Highlights & Itinerary Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-900/30 via-[#0a1026]/90 to-[#050A18] border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <h3 className="text-base sm:text-lg font-black text-white">
                        Annual Picnic 2026 Program Itinerary
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold border border-blue-400/30">
                      LIVE CEREMONY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {[
                      { num: '01', title: 'Executive Speeches', sub: 'MD, Chairman & Leadership', icon: '👑' },
                      { num: '02', title: 'Department Spotlights', sub: 'Preservation, Commercial & R&D', icon: '📊' },
                      { num: '03', title: 'Star Awards & Honors', sub: 'Top Performers & Retained Pillars', icon: '⭐' },
                      { num: '04', title: 'Grand Website Launch', sub: 'Unveiling Next-Gen Portal & DJ', icon: '🚀' },
                    ].map((item) => (
                      <div
                        key={item.num}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/40 transition-colors flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-base shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{item.title}</p>
                          <p className="text-[10px] text-slate-400">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PROCEED TO HONORABLE GUESTS STEP CALLOUT BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedToHonorableGuests}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-between transition-all cursor-pointer border-2 border-amber-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center text-lg shadow-inner">
                        👑
                      </div>
                      <div className="text-left">
                        <span className="block text-xs uppercase tracking-wider text-slate-900 font-extrabold opacity-90">
                          Next Ceremonial Step
                        </span>
                        <span className="text-sm sm:text-base font-black">
                          Introduce & Thank Special Honorable Guests
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-xs bg-slate-950/10 px-3 py-1.5 rounded-xl group-hover:translate-x-1 transition-transform">
                      <span>Unveil</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ---------------------------------------------------- */}
            {/* STEP 2: SPECIAL HONORABLE GUESTS GALLERY (With Picture & Name) */}
            {/* ---------------------------------------------------- */}
            {currentStep === 'honorable_guests' && (
              <motion.div
                key="step2-guests"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Royal Gallery Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-amber-400/40 text-center flex items-center justify-between">
                  <div className="flex items-center gap-2 text-left">
                    <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-black text-amber-200">
                        Honoring the Respected Fathers of MD & Chairman
                      </h3>
                      <p className="text-[11px] text-amber-300/80">
                        With deep reverence, Winbridge Tech presents our highest tribute.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStep('kickoff');
                      soundFx.playClick();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                </div>

                {/* 2 HONORABLE GUEST PORTRAIT CARDS WITH PHOTOS AND NAMES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guests.map((guest, idx) => (
                    <motion.div
                      key={guest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="p-5 rounded-3xl bg-gradient-to-b from-[#0e1630] via-[#080d21] to-[#040817] border-2 border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-center relative overflow-hidden flex flex-col justify-between group hover:border-amber-300 transition-all"
                    >
                      {/* Gold Halo Glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div>
                        {/* VIP Ribbon Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase tracking-widest mb-3">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>{guest.badge || 'Special Honorable Guest'}</span>
                        </div>

                        {/* GUEST PORTRAIT PHOTO WITH GOLDEN ORNAMENTAL FRAME */}
                        <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-3">
                          {/* Animated Golden Radiance Ring */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 animate-spin -z-10 blur-[2px] opacity-75" style={{ animationDuration: '8s' }} />

                          {/* Inner Photo Container */}
                          <div className="w-full h-full rounded-full p-1.5 bg-gradient-to-b from-amber-300 via-amber-600 to-yellow-200 shadow-[0_0_25px_rgba(245,158,11,0.6)]">
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 relative border-2 border-[#050A18]">
                              <img
                                src={guest.photoUrl}
                                alt={guest.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  // Graceful fallback to dignified placeholder portrait
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80`;
                                }}
                              />
                            </div>
                          </div>

                          {/* Floral Rosette / Garland Badge */}
                          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xl border-2 border-amber-100">
                            💐
                          </div>
                        </div>

                        {/* GUEST NAME & RELATIONSHIP */}
                        <h4 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                          {guest.name}
                        </h4>
                        <div className="text-xs font-bold text-amber-300/90 mt-0.5 mb-2">
                          {guest.relation}
                        </div>

                        {/* Quote & Guidance */}
                        {guest.quote && (
                          <div className="p-3 rounded-2xl bg-white/5 border border-amber-500/20 text-left mb-3">
                            <p className="text-[11px] text-amber-100/90 italic font-medium leading-relaxed">
                              "{guest.quote}"
                            </p>
                          </div>
                        )}

                        {/* Blessing Points */}
                        {guest.blessingPoints && (
                          <ul className="text-left space-y-1 text-[10px] text-slate-300 mb-3">
                            {guest.blessingPoints.map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-400 font-bold">✦</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Photo Customizer Trigger / Edit Mode */}
                      <div className="pt-2 border-t border-white/10">
                        {editingGuestId === guest.id ? (
                          <div className="space-y-2">
                            <input
                              type="url"
                              value={photoInputUrl}
                              onChange={(e) => setPhotoInputUrl(e.target.value)}
                              placeholder="Paste custom photo URL..."
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-amber-400/50 text-white text-[11px] placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSavePhotoUrl(guest.id)}
                                className="flex-1 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] transition-colors"
                              >
                                Save Photo
                              </button>
                              <button
                                onClick={() => setEditingGuestId(null)}
                                className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingGuestId(guest.id);
                              setPhotoInputUrl(guest.photoUrl || '');
                            }}
                            className="w-full py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-amber-300/80 hover:text-amber-200 font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Camera className="w-3 h-3" />
                            <span>Change Photo / URL</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CEREMONIAL TRIBUTE & GRATITUDE ACTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleStandingOvation}
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer border border-amber-200"
                  >
                    <Flower2 className="w-4 h-4 fill-slate-950" />
                    <span>Floral Bouquets & Ovation {ovationCount > 0 && `(${ovationCount})`}</span>
                  </button>

                  <button
                    onClick={handleOfferBlessings}
                    className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer border border-emerald-400/40"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Offer Du'a & Prayers {blessingsCount > 0 && `(${blessingsCount})`}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Host Mic Switcher */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl justify-center text-xs gap-1">
            <button
              onClick={() => {
                setActiveHost('both');
                soundFx.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeHost === 'both'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Both Hosts Mic
            </button>
            <button
              onClick={() => {
                setActiveHost('rifat');
                soundFx.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeHost === 'rifat'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mr. Rifat Only
            </button>
            <button
              onClick={() => {
                setActiveHost('ratul');
                soundFx.playClick();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeHost === 'ratul'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mr. Ratul Only
            </button>
          </div>
        </div>

        {/* Right Host: Mr. Ratul - Standing Tall on Stage (Right Flank) */}
        <div className="lg:col-span-3 flex flex-col items-center justify-end">
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full flex flex-col items-center relative py-2"
          >
            {/* Ambient Spotlight Glow behind Host */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

            <Avatar3D
              presenter={ratul}
              outfitTheme={globalOutfit}
              action={currentStep === 'honorable_guests' ? 'waving' : 'celebrating'}
              size="stage"
              showSpeechBubble={false}
              onOutfitChange={(theme) => onPresenterOutfitChange?.(ratul.id, theme)}
            />

            {/* Floating Speech Dialogue Pill */}
            {(activeHost === 'both' || activeHost === 'ratul') && (
              <motion.div
                key={`ratul-${currentStep}`}
                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`mt-2 p-3 rounded-2xl text-xs font-medium border shadow-xl backdrop-blur-md max-w-xs text-center ${
                  currentStep === 'honorable_guests'
                    ? 'bg-blue-500/20 border-blue-400/40 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : 'bg-indigo-900/60 border-indigo-400/40 text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                }`}
              >
                <p className="leading-relaxed font-semibold">{getRatulSpeech()}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Program Agenda / Sequence Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
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
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors flex items-start gap-2.5"
            >
              <div className="w-7 h-7 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
                {item.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
