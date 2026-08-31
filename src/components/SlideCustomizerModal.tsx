import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutfitTheme, StageEnvironment, HostTransitionType, TransitionSpeed } from '../types';
import { X, Settings, Image, Sparkles, Shirt, Palette, Check, Wand2, Play, Gauge, FastForward } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface SlideCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideData[];
  onUpdateSlides: (newSlides: SlideData[]) => void;
  globalOutfit: OutfitTheme;
  onUpdateGlobalOutfit: (outfit: OutfitTheme) => void;
  currentEnv: StageEnvironment;
  onUpdateEnv: (env: StageEnvironment) => void;
  customLogoUrl?: string;
  onUpdateLogoUrl: (url: string) => void;
  hostTransitionType: HostTransitionType;
  onUpdateHostTransition: (type: HostTransitionType) => void;
  onTestHostTransition?: (type: HostTransitionType) => void;
  transitionSpeed?: TransitionSpeed;
  onUpdateTransitionSpeed?: (speed: TransitionSpeed) => void;
}

export const SlideCustomizerModal: React.FC<SlideCustomizerModalProps> = ({
  isOpen,
  onClose,
  slides,
  onUpdateSlides,
  globalOutfit,
  onUpdateGlobalOutfit,
  currentEnv,
  onUpdateEnv,
  customLogoUrl,
  onUpdateLogoUrl,
  hostTransitionType,
  onUpdateHostTransition,
  onTestHostTransition,
  transitionSpeed = 'cinematic',
  onUpdateTransitionSpeed,
}) => {
  const [activeTab, setActiveTab] = useState<'transitions' | 'themes' | 'presenters' | 'logo'>('transitions');
  const [logoInput, setLogoInput] = useState(customLogoUrl || '');

  if (!isOpen) return null;

  const HOST_ACTIVITIES: { id: HostTransitionType; label: string; icon: string; desc: string; soundDesc: string }[] = [
    {
      id: 'auto',
      label: 'Surprise Auto-Cycle Mix',
      icon: '🔀',
      desc: 'Hosts alternate exciting activities on every single slide change!',
      soundDesc: 'Dynamic procedural soundscapes for each action',
    },
    {
      id: 'curtains',
      label: 'Velvet Theater Drapes',
      icon: '🎭',
      desc: 'Mr. Rifat & Mr. Ratul pull heavy golden rope pulleys closing and opening royal drapes.',
      soundDesc: 'Fabric whoosh + heavy rope pulley friction',
    },
    {
      id: 'shutter',
      label: 'Industrial Cyber Shutter',
      icon: '🪟',
      desc: 'Hosts pull emergency mechanical levers & steam valves slamming down high-tech blast shutters.',
      soundDesc: 'Hydraulic roll down + heavy metallic clank',
    },
    {
      id: 'watersplash',
      label: 'Picnic Water Splash Wave',
      icon: '🌊',
      desc: 'Hosts blast neon super-soakers & splash ocean buckets to wash away the screen.',
      soundDesc: 'Oceanic wave rush + bubbly water blips',
    },
    {
      id: 'magic',
      label: 'Cosmic Magic Portal',
      icon: '🪄',
      desc: 'Hosts cast stardust spells with glowing crystal wands into a dimensional galaxy rift.',
      soundDesc: 'Shimmering celestial arpeggios & resonating chime',
    },
    {
      id: 'squeegee',
      label: 'Squeegee Glass Wash',
      icon: '🧽',
      desc: 'Hosts run across the screen wiping soap bubbles into a crystal clean view.',
      soundDesc: 'Funny rubber squeak + window spray',
    },
    {
      id: 'confetti',
      label: 'Dual Confetti Cannons',
      icon: '🎉',
      desc: 'Hosts count down 3-2-1 and fire celebratory golden party cannons.',
      soundDesc: 'Loud party explosion pop + celebration sparkle',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050A18]/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-blue-900/20 via-[#0a1026]/95 to-[#050A18] border border-white/10 shadow-2xl p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Presentation & 3D Stage Studio</h3>
              <p className="text-xs text-slate-400">
                Configure host slide transition activities, avatar outfits, lighting, and company branding.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-6 text-xs font-bold gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('transitions')}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'transitions' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              Host Slide Activities
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'themes' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4 text-blue-300" />
              Stage & Outfits
            </button>
            <button
              onClick={() => setActiveTab('presenters')}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'presenters' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shirt className="w-4 h-4 text-cyan-300" />
              Presenters
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'logo' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Image className="w-4 h-4 text-emerald-300" />
              Branding
            </button>
          </div>

          {/* TAB 0: HOST SLIDE TRANSITION ACTIVITIES */}
          {activeTab === 'transitions' && (
            <div className="space-y-5">
              {/* Transition Speed / Pacing Selector */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    Transition Speed & Showcase Pacing
                  </label>
                  <span className="text-[11px] text-amber-300 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {transitionSpeed === 'cinematic' ? '🎬 Cinematic (3.0s — Clear & Detailed)' : transitionSpeed === 'normal' ? '⚡ Balanced (2.3s)' : '🚀 Brisk (1.5s)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Controls how long the stage stunt stays on screen so the audience can clearly view the host stunts, props, speech bubbles, and slide titles.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {[
                    { id: 'cinematic', label: '🎬 Cinematic', sub: '3.0s • Full stunt showcase & dialog', badge: 'Recommended' },
                    { id: 'normal', label: '⚡ Balanced', sub: '2.3s • Standard presentation pace', badge: 'Standard' },
                    { id: 'brisk', label: '🚀 Brisk', sub: '1.5s • Quick fast slide change', badge: 'Fast' },
                  ].map((spd) => {
                    const isSelected = transitionSpeed === spd.id;
                    return (
                      <button
                        key={spd.id}
                        onClick={() => {
                          if (onUpdateTransitionSpeed) {
                            onUpdateTransitionSpeed(spd.id as TransitionSpeed);
                            soundFx.playClick();
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400'
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{spd.label}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                            {spd.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-300">{spd.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Host Avatar Slide Transition Actions
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hosts Mr. Rifat & Mr. Ratul perform these live animated stunts whenever you change slides.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HOST_ACTIVITIES.map((act) => {
                  const isSelected = hostTransitionType === act.id;
                  return (
                    <div
                      key={act.id}
                      onClick={() => {
                        onUpdateHostTransition(act.id);
                        soundFx.playClick();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-400/80 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{act.icon}</span>
                            <h5 className="font-bold text-white text-sm">{act.label}</h5>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">{act.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-blue-300 font-mono">🔊 {act.soundDesc}</span>
                        {onTestHostTransition && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTestHostTransition(act.id);
                            }}
                            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Preview this transition now"
                          >
                            <Play className="w-2.5 h-2.5" /> Test
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 1: THEMES & STAGE */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Global Outfit Theme Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                  Global Avatar Outfit Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'formal', label: 'Formal Attire', desc: 'Corporate suits, ties & blazers', badge: '👔 Executive' },
                    { id: 'casual', label: 'Casual Wear', desc: 'Winbridge polo shirts & smart sneakers', badge: '👕 Picnic Vibe' },
                    { id: 'festive', label: 'Seasonal Festive', desc: 'Tropical shirts, party hats & leis', badge: '🌺 Gala Carnival' },
                  ].map((theme) => {
                    const isSelected = globalOutfit === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          onUpdateGlobalOutfit(theme.id as OutfitTheme);
                          soundFx.playClick();
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-400'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-blue-400">{theme.badge}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                        </div>
                        <h4 className="font-bold text-white text-sm">{theme.label}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">{theme.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3D Stage Environment Lighting */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                  3D Stage Atmospheric Environment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'oasis', label: 'Picnic Oasis', color: 'from-blue-600 to-teal-800' },
                    { id: 'gala', label: 'Golden Gala', color: 'from-amber-600 to-yellow-800' },
                    { id: 'cyber', label: 'Cyber Arena', color: 'from-cyan-600 to-indigo-800' },
                    { id: 'sunset', label: 'Sunset Resort', color: 'from-rose-600 to-amber-800' },
                  ].map((env) => {
                    const isSelected = currentEnv === env.id;
                    return (
                      <button
                        key={env.id}
                        onClick={() => {
                          onUpdateEnv(env.id as StageEnvironment);
                          soundFx.playClick();
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-blue-400 ring-2 ring-blue-400/40'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-full h-8 rounded-xl bg-gradient-to-r ${env.color} mb-2`} />
                        <h5 className="font-bold text-xs text-white">{env.label}</h5>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRESENTERS LIST & CUSTOMIZATION */}
          {activeTab === 'presenters' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Individual presenters can have personalized speech notes, avatar rigging, and custom outfits.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {slides.flatMap((s) => s.presenters).map((p, idx) => (
                  <div
                    key={`${p.id}-${idx}`}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-white">{p.name}</h5>
                      <p className="text-[11px] text-blue-400">{p.designation}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.department}</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
                      3D Rigged
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COMPANY LOGO */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Custom Logo URL / Asset Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logoInput}
                    onChange={(e) => setLogoInput(e.target.value)}
                    placeholder="e.g. /assets/winbridge.png or https://example.com/logo.png"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      onUpdateLogoUrl(logoInput);
                      soundFx.playClick();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Save Logo
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-slate-300">Default Built-in Branding:</p>
                <p>
                  The app is loaded with the official vector replica of the uploaded Winbridge Tech logo matching colors (Teal #1A6B85 and Green #259B5C).
                </p>
              </div>
            </div>
          )}

          {/* Done button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-lg"
            >
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
