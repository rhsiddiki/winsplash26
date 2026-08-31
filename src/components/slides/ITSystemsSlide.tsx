import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { SlideData, OutfitTheme } from '../../types';
import { SpeakerStagePod } from '../SpeakerStagePod';
import { WinbridgeLogo } from '../WinbridgeLogo';
import { Server, Rocket, Globe, Sparkles, Terminal, Shield, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface ITSystemsSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const ITSystemsSlide: React.FC<ITSystemsSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'weblaunch'>('weblaunch');
  const [isLaunched, setIsLaunched] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState<number | null>(null);

  const presenter = slide.presenters[0];

  const handleLaunch = () => {
    soundFx.playDrumRoll(2.5);
    setLaunchCountdown(3);

    const t1 = setTimeout(() => {
      setLaunchCountdown(2);
      soundFx.playLaunchCountdownBeep(false);
    }, 800);

    const t2 = setTimeout(() => {
      setLaunchCountdown(1);
      soundFx.playLaunchCountdownBeep(false);
    }, 1600);

    const t3 = setTimeout(() => {
      setLaunchCountdown(null);
      setIsLaunched(true);
      soundFx.playLaunchCountdownBeep(true);
      soundFx.playFanfare();

      // Massive Celebration Confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#10b981', '#0284c7', '#fbbf24', '#a855f7'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.6 },
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
        });
      }, 400);
    }, 2400);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Server className="w-3.5 h-3.5 text-blue-400" />
          SESSION 08 • IT, SYSTEMS & DIGITAL TRANSFORMATION
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200">
          IT & Systems Department
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          {slide.subtitle}
        </p>
      </div>

      {/* Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 px-3 font-mono">
            Incharge: Rabiul Haque Siddiki Anik
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('projects');
              soundFx.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Dev & Research Projects
          </button>

          <button
            onClick={() => {
              setActiveTab('weblaunch');
              soundFx.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'weblaunch'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'bg-white/5 text-blue-300 hover:bg-white/10'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            New Website Launch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Presenter Stage Pod with Picture Upload & Avatar Switcher */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <SpeakerStagePod
            presenter={presenter}
            globalOutfit={globalOutfit}
            onPresenterOutfitChange={onPresenterOutfitChange}
            defaultMode="photo"
          />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'weblaunch' ? (
            /* BRAND NEW WEBSITE LAUNCH EXPERIENCE */
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-950/40 via-[#0a1026]/90 to-[#050A18] border-2 border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.2)] relative overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  <Rocket className="w-3.5 h-3.5" />
                  Official Digital Portal Premiere
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
                  Winbridge Tech Official Website Launch
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mb-6">
                  Unveiling the next-generation digital gateway for Winbridge Tech Ltd: high-speed, interactive, and crafted for global enterprise scale.
                </p>

                {/* Launch Button / Countdown */}
                {!isLaunched ? (
                  <div className="my-4">
                    {launchCountdown !== null ? (
                      <motion.div
                        key={launchCountdown}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.3, opacity: 1 }}
                        className="text-7xl font-black text-blue-400 animate-pulse my-4"
                      >
                        {launchCountdown}
                      </motion.div>
                    ) : (
                      <button
                        onClick={handleLaunch}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-base sm:text-lg shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto cursor-pointer"
                      >
                        <Rocket className="w-6 h-6 animate-bounce" />
                        Initiate Official Live Launch!
                      </button>
                    )}
                  </div>
                ) : (
                  /* LIVE LAUNCHED INTERACTIVE WEBSITE PREVIEW FRAME */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 18 }}
                    className="w-full rounded-2xl bg-[#050A18] border border-blue-500/40 shadow-2xl overflow-hidden text-left my-2"
                  >
                    {/* Browser Chrome Header */}
                    <div className="px-4 py-2.5 bg-[#0a1026] border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-blue-500/80" />
                        <span className="ml-3 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-blue-400" />
                          https://winbridgetech.com (Live)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
                        STATUS: ONLINE
                      </span>
                    </div>

                    {/* Website Hero Preview */}
                    <div className="p-6 sm:p-8 bg-gradient-to-br from-[#050A18] via-[#0a1026] to-blue-950/40 space-y-6">
                      <div className="flex items-center justify-between">
                        <WinbridgeLogo size="sm" showTagline={true} />
                        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-300">
                          <span className="hover:text-blue-400 cursor-pointer">Solutions</span>
                          <span className="hover:text-blue-400 cursor-pointer">Preservation</span>
                          <span className="hover:text-blue-400 cursor-pointer">Careers</span>
                          <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold">Contact</span>
                        </div>
                      </div>

                      <div className="space-y-3 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                          <Sparkles className="w-3 h-3" />
                          Next-Gen Enterprise Engineering
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                          Empowering Global Businesses with Secure, High-Performance Tech Solutions.
                        </h4>
                        <p className="text-xs text-slate-300">
                          Specialized in large-scale data preservation, cloud architecture, and intelligent automated workflows.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => soundFx.playFanfare()}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Cheer the Launch
                        </button>
                        <button
                          onClick={() => setIsLaunched(false)}
                          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Replay Launch
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            /* DEV & RESEARCH PROJECTS SHOWCASE */
            <div className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {slide.metrics?.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors shadow-lg flex flex-col justify-between"
                  >
                    <span className="text-xs font-medium text-slate-400 line-clamp-1">{metric.label}</span>
                    <div className="text-2xl font-black text-white my-1">{metric.value}</div>
                    <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {metric.change}
                    </span>
                  </div>
                ))}
              </div>

              {/* Projects list */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  Development & Systems Breakthroughs
                </h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <h5 className="font-bold text-white text-sm">Distributed File Indexing Engine</h5>
                    <p className="text-xs text-slate-300">
                      High-concurrency streaming storage subsystem capable of real-time search across millions of records.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <h5 className="font-bold text-white text-sm">Automated Security & Access Gate</h5>
                    <p className="text-xs text-slate-300">
                      Biometric integration, zero-trust token authentication, and multi-factor compliance enforcement.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <h5 className="font-bold text-white text-sm">CI/CD Pipeline Speed Optimization</h5>
                    <p className="text-xs text-slate-300">
                      Reduced deployment turnaround to under 4.2 minutes with automated regression testing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
