import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutfitTheme, StageEnvironment, Presenter } from '../types';
import { X, Settings, Image, Sparkles, Shirt, Palette, Check, RefreshCw } from 'lucide-react';
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
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'presenters' | 'logo'>('themes');
  const [logoInput, setLogoInput] = useState(customLogoUrl || '');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Presentation & 3D Stage Studio</h3>
              <p className="text-xs text-slate-400">
                Configure outfit themes, 3D stage lighting, company assets, and customize presenters.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6 text-xs font-bold">
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'themes' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" />
              Stage & Outfit Themes
            </button>
            <button
              onClick={() => setActiveTab('presenters')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'presenters' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shirt className="w-4 h-4" />
              Presenter Outfits
            </button>
            <button
              onClick={() => setActiveTab('logo')}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'logo' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Image className="w-4 h-4" />
              Company Logo & Branding
            </button>
          </div>

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
                            ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-emerald-400">{theme.badge}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
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
                    { id: 'oasis', label: 'Picnic Oasis', color: 'from-emerald-600 to-teal-800' },
                    { id: 'gala', label: 'Golden Gala', color: 'from-amber-600 to-yellow-800' },
                    { id: 'cyber', label: 'Cyber Arena', color: 'from-cyan-600 to-purple-800' },
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
                            ? 'bg-slate-800 border-emerald-400 ring-2 ring-emerald-400/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
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
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-white">{p.name}</h5>
                      <p className="text-[11px] text-emerald-400">{p.designation}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.department}</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
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
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      onUpdateLogoUrl(logoInput);
                      soundFx.playClick();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                  >
                    Save Logo
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
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
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
            >
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
