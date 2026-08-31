import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutfitTheme, StageEnvironment, HostTransitionType, TransitionSpeed } from '../types';
import { ALL_PRESENTERS } from '../data/presentationData';
import { X, Settings, Image, Sparkles, Shirt, Palette, Check, Wand2, Play, Gauge, FastForward, Upload, Camera, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import {
  useCustomPhotos,
  saveStoredImage,
  removeStoredImage,
  processAndOptimizeImage,
} from '../utils/imageStorage';

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
  const customPhotos = useCustomPhotos();
  const [logoInput, setLogoInput] = useState(customPhotos['company_logo'] || customLogoUrl || '');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const presenterFileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const logoFileRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePresenterPhotoUpload = async (presenterId: string, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingId(presenterId);
    try {
      const optimized = await processAndOptimizeImage(file);
      await saveStoredImage(presenterId, optimized);
      showToast('Photo Saved & Persisted to Storage!');
      soundFx.playFanfare();
    } catch (err) {
      console.error('Error saving photo:', err);
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemovePresenterPhoto = async (presenterId: string) => {
    await removeStoredImage(presenterId);
    showToast('Photo Reset to Default');
    soundFx.playClick();
  };

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingId('company_logo');
    try {
      const optimized = await processAndOptimizeImage(file, 800, 0.95);
      await saveStoredImage('company_logo', optimized);
      onUpdateLogoUrl(optimized);
      setLogoInput(optimized);
      showToast('Company Logo Saved Permanently!');
      soundFx.playFanfare();
    } catch (err) {
      console.error('Error saving logo:', err);
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemoveLogo = async () => {
    await removeStoredImage('company_logo');
    onUpdateLogoUrl('');
    setLogoInput('');
    showToast('Reset to Default Vector Logo');
    soundFx.playClick();
  };

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
                Manage presenter official portraits and avatar rigging. Uploaded photos are stored permanently in browser storage.
              </p>

              {toastMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* Deduplicated unique presenters list */}
              {(() => {
                const uniquePresentersMap = new Map<string, any>();
                
                // Add all presenters from ALL_PRESENTERS dictionary
                Object.values(ALL_PRESENTERS).forEach((p) => {
                  uniquePresentersMap.set(p.id, p);
                });

                // Also collect from slides
                slides.forEach((s) => {
                  s.presenters.forEach((p) => {
                    if (!uniquePresentersMap.has(p.id)) {
                      uniquePresentersMap.set(p.id, p);
                    }
                  });
                });
                const presentersList = Array.from(uniquePresentersMap.values());

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {presentersList.map((p) => {
                      const customPhoto = customPhotos[p.id];
                      const isUploading = uploadingId === p.id;

                      return (
                        <div
                          key={p.id}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handlePresenterPhotoUpload(p.id, e.dataTransfer.files[0]);
                            }
                          }}
                          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            {/* Photo / Avatar thumbnail */}
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-amber-400/40 shrink-0">
                              <img
                                src={customPhoto || p.photoUrl || (p.id === 'fakhrul' ? '/images/md_fakhrul_hasan.svg' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80')}
                                alt={p.name}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/images/md_fakhrul_hasan.svg';
                                }}
                              />
                              {customPhoto && (
                                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-bl-md" title="Custom Photo Active" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-xs text-white truncate">{p.name}</h5>
                              <p className="text-[11px] text-amber-300 truncate">{p.designation}</p>
                              <p className="text-[10px] text-slate-400 truncate">{p.department}</p>
                            </div>
                          </div>

                          {/* Action controls */}
                          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                            <input
                              type="file"
                              ref={(el) => {
                                presenterFileRefs.current[p.id] = el;
                              }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handlePresenterPhotoUpload(p.id, e.target.files[0]);
                                }
                              }}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              onClick={() => presenterFileRefs.current[p.id]?.click()}
                              disabled={isUploading}
                              className="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-[11px] text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Saving...</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3 h-3" />
                                  <span>{customPhoto ? 'Change' : 'Upload Photo'}</span>
                                </>
                              )}
                            </button>

                            {customPhoto && (
                              <button
                                onClick={() => handleRemovePresenterPhoto(p.id)}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 transition-colors cursor-pointer"
                                title="Reset to Default"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: COMPANY LOGO */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Upload your company logo or provide a custom URL. Stored permanently across all sessions.
              </p>

              {toastMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{toastMsg}</span>
                </div>
              )}

              {/* Logo Drag and Drop & Upload Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleLogoUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="p-6 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 hover:border-blue-400 flex flex-col items-center justify-center text-center transition-all group"
              >
                <input
                  type="file"
                  ref={logoFileRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleLogoUpload(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />

                {/* Current Logo Preview */}
                <div className="w-24 h-24 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-center p-2 mb-3 overflow-hidden shadow-inner">
                  {customPhotos['company_logo'] || customLogoUrl ? (
                    <img
                      src={customPhotos['company_logo'] || customLogoUrl}
                      alt="Company Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="font-black text-xs text-teal-400">WINBRIDGE</div>
                      <div className="text-[8px] text-emerald-400 font-bold">TECH</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => logoFileRef.current?.click()}
                    disabled={uploadingId === 'company_logo'}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {uploadingId === 'company_logo' ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Logo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Logo File</span>
                      </>
                    )}
                  </button>

                  {(customPhotos['company_logo'] || customLogoUrl) && (
                    <button
                      onClick={handleRemoveLogo}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Drag & drop PNG, JPG, or SVG file here or click to browse.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Or paste Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logoInput}
                    onChange={(e) => setLogoInput(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={async () => {
                      if (logoInput.trim()) {
                        await saveStoredImage('company_logo', logoInput.trim());
                        onUpdateLogoUrl(logoInput.trim());
                        showToast('Logo URL Saved & Persisted!');
                      }
                      soundFx.playClick();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Save URL
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Default Built-in Branding:</p>
                <p>
                  The app includes the official vector insignia of Winbridge Tech with authentic Teal (#1A6B85) & Green (#259B5C) color branding.
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
