import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Presenter, OutfitTheme } from '../types';
import { Sparkles, Shirt, PartyPopper, Briefcase, Volume2, Smile, Eye } from 'lucide-react';

interface Avatar3DProps {
  presenter: Presenter;
  outfitTheme?: OutfitTheme;
  action?: 'speaking' | 'waving' | 'clapping' | 'celebrating' | 'thumbsup' | 'dancing';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSpeechBubble?: boolean;
  onOutfitChange?: (theme: OutfitTheme) => void;
  interactive?: boolean;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({
  presenter,
  outfitTheme = 'formal',
  action = 'speaking',
  size = 'md',
  showSpeechBubble = false,
  onOutfitChange,
  interactive = true,
}) => {
  const [currentAction, setCurrentAction] = useState(action);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitTheme>(outfitTheme);
  const [isRotating, setIsRotating] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  // Sync if prop changes
  React.useEffect(() => {
    setCurrentOutfit(outfitTheme);
  }, [outfitTheme]);

  React.useEffect(() => {
    setCurrentAction(action);
  }, [action]);

  const { avatarConfig } = presenter;
  const outfitData = avatarConfig.themeOutfit[currentOutfit];

  // Sizing definitions
  const sizeMap = {
    sm: { container: 'w-28 h-36', svg: 'w-24 h-32', scale: 0.7 },
    md: { container: 'w-44 h-56', svg: 'w-40 h-52', scale: 0.95 },
    lg: { container: 'w-64 h-80', svg: 'w-56 h-72', scale: 1.2 },
    hero: { container: 'w-72 sm:w-88 h-96 sm:h-110', svg: 'w-64 sm:w-80 h-84 sm:h-100', scale: 1.45 },
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotY(Math.max(-20, Math.min(20, (x / (rect.width / 2)) * 18)));
    setRotX(Math.max(-15, Math.min(15, -(y / (rect.height / 2)) * 14)));
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setIsRotating(false);
  };

  // Outfit specific colors
  let topColor = '#1e293b';
  let innerColor = '#ffffff';
  let accentColor = '#10b981';

  if (currentOutfit === 'formal') {
    topColor = outfitData.formal?.suitColor || '#1e293b';
    innerColor = outfitData.formal?.shirtColor || '#ffffff';
    accentColor = outfitData.formal?.tieColor || '#10b981';
  } else if (currentOutfit === 'casual') {
    topColor = outfitData.casual?.topColor || '#0284c7';
    innerColor = outfitData.casual?.bottomColor || '#1e293b';
    accentColor = '#f59e0b';
  } else if (currentOutfit === 'festive') {
    topColor = outfitData.festive?.costumeColor || '#059669';
    innerColor = outfitData.festive?.accentColor || '#fbbf24';
    accentColor = '#ec4899';
  }

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Interactive 3D Card wrapper */}
      <motion.div
        className={`${sizeMap[size].container} relative flex items-center justify-center`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotX,
          rotateY: rotY,
          scale: isRotating ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      >
        {/* Ambient Stage Pedestal Glow under avatar */}
        <div
          className="absolute -bottom-2 w-3/4 h-8 rounded-full blur-md opacity-70 transition-all duration-500"
          style={{
            background:
              currentOutfit === 'formal'
                ? 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(2,132,199,0) 70%)'
                : currentOutfit === 'casual'
                ? 'radial-gradient(circle, rgba(56,189,248,0.6) 0%, rgba(14,165,233,0) 70%)'
                : 'radial-gradient(circle, rgba(245,158,11,0.7) 0%, rgba(236,72,153,0) 70%)',
          }}
        />

        {/* 3D Animated Cartoon Avatar Rig (Vector Rendered with Depth Lighting) */}
        <motion.div
          animate={
            currentAction === 'speaking'
              ? { y: [0, -4, 0], rotate: [0, 1, -1, 0] }
              : currentAction === 'waving'
              ? { y: [0, -6, 0], rotate: [-2, 3, -2] }
              : currentAction === 'celebrating'
              ? { y: [0, -14, 0], scale: [1, 1.04, 1] }
              : currentAction === 'dancing'
              ? { y: [0, -8, 0], rotate: [-4, 4, -4], x: [-3, 3, -3] }
              : currentAction === 'clapping'
              ? { y: [0, -3, 0], scale: [1, 1.02, 1] }
              : { y: 0 }
          }
          transition={{
            repeat: Infinity,
            duration: currentAction === 'dancing' ? 1.4 : currentAction === 'speaking' ? 2.5 : 1.8,
            ease: 'easeInOut',
          }}
          className={`${sizeMap[size].svg} relative drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]`}
        >
          <svg
            viewBox="0 0 200 240"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Lighting Shaders */}
              <radialGradient id={`skinGlow-${presenter.id}`} cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
              </radialGradient>
              <linearGradient id={`suitGrad-${presenter.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={topColor} />
                <stop offset="100%" stopColor="#0a0f1d" />
              </linearGradient>
              <linearGradient id={`goldShine-${presenter.id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* BODY / TORSO / OUTFIT */}
            <g id="avatar-body">
              {/* Base Shoulders & Coat/Shirt */}
              <path
                d="M 40 170 Q 100 150 160 170 L 175 235 Q 100 245 25 235 Z"
                fill={`url(#suitGrad-${presenter.id})`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />

              {/* Outfit Themes Details */}
              {currentOutfit === 'formal' && (
                <g id="formal-outfit">
                  {/* White Shirt Collar & V */}
                  <polygon points="85,160 115,160 100,200" fill={innerColor} />
                  {/* Formal Tie */}
                  <polygon
                    points="95,165 105,165 108,215 100,225 92,215"
                    fill={accentColor}
                    stroke="#000"
                    strokeWidth="0.5"
                  />
                  {/* Suit Lapels */}
                  <path d="M 65 165 L 90 215 L 75 215 Z" fill={topColor} opacity="0.9" />
                  <path d="M 135 165 L 110 215 L 125 215 Z" fill={topColor} opacity="0.9" />
                  {/* Pocket Square / Badge */}
                  <rect x="58" y="190" width="16" height="5" rx="1" fill={`url(#goldShine-${presenter.id})`} />
                </g>
              )}

              {currentOutfit === 'casual' && (
                <g id="casual-outfit">
                  {/* Casual Polo Collar */}
                  <path d="M 80 160 L 100 185 L 120 160 Z" fill="#0f172a" opacity="0.4" />
                  <circle cx="100" cy="172" r="2.5" fill="#f8fafc" />
                  <circle cx="100" cy="180" r="2.5" fill="#f8fafc" />
                  {/* Winbridge Mini Pocket Badge */}
                  <rect x="60" y="185" width="16" height="12" rx="2" fill="#10b981" />
                  <text x="63" y="194" fontSize="7" fontWeight="bold" fill="#ffffff">WB</text>
                  {/* Sports Stripes */}
                  <path d="M 38 178 L 48 232" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                  <path d="M 162 178 L 152 232" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
                </g>
              )}

              {currentOutfit === 'festive' && (
                <g id="festive-outfit">
                  {/* Festive Tropical / Kurta Gala Pattern */}
                  <path d="M 85 160 L 100 195 L 115 160 Z" fill={innerColor} />
                  {/* Gold Gala Trim */}
                  <path d="M 100 160 L 100 235" stroke={`url(#goldShine-${presenter.id})`} strokeWidth="3" />
                  {/* Picnic Pattern Dots / Stars */}
                  <circle cx="70" cy="185" r="3" fill="#fef08a" opacity="0.8" />
                  <circle cx="130" cy="185" r="3" fill="#fef08a" opacity="0.8" />
                  <circle cx="55" cy="210" r="3.5" fill="#38bdf8" opacity="0.8" />
                  <circle cx="145" cy="210" r="3.5" fill="#38bdf8" opacity="0.8" />
                  <circle cx="80" cy="220" r="2.5" fill="#f43f5e" opacity="0.8" />
                  <circle cx="120" cy="220" r="2.5" fill="#f43f5e" opacity="0.8" />
                  {/* Festive Lei / Party Ribbon */}
                  <path
                    d="M 55 165 Q 100 215 145 165"
                    stroke="#fbbf24"
                    strokeWidth="6"
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              )}
            </g>

            {/* NECK */}
            <g id="avatar-neck">
              <rect x="86" y="130" width="28" height="28" rx="4" fill={avatarConfig.skinTone} />
              <rect x="86" y="130" width="28" height="28" rx="4" fill={`url(#skinGlow-${presenter.id})`} />
            </g>

            {/* HEAD / FACE */}
            <g id="avatar-head">
              {/* Ears */}
              <circle cx="58" cy="98" r="11" fill={avatarConfig.skinTone} />
              <circle cx="142" cy="98" r="11" fill={avatarConfig.skinTone} />
              <circle cx="58" cy="98" r="6" fill="#000000" opacity="0.1" />
              <circle cx="142" cy="98" r="6" fill="#000000" opacity="0.1" />

              {/* Head Base */}
              <rect
                x="62"
                y="55"
                width="76"
                height="84"
                rx="34"
                fill={avatarConfig.skinTone}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="1"
              />
              <rect
                x="62"
                y="55"
                width="76"
                height="84"
                rx="34"
                fill={`url(#skinGlow-${presenter.id})`}
              />

              {/* HAIR STYLES */}
              {avatarConfig.hairStyle === 'stylish' && (
                <path
                  d="M 58 72 C 55 40, 90 28, 140 40 C 148 55, 145 74, 140 76 C 130 52, 75 52, 60 76 Z"
                  fill={avatarConfig.hairColor}
                />
              )}
              {avatarConfig.hairStyle === 'short' && (
                <path
                  d="M 60 70 C 60 42, 140 42, 140 70 C 130 58, 70 58, 60 70 Z"
                  fill={avatarConfig.hairColor}
                />
              )}
              {avatarConfig.hairStyle === 'fade' && (
                <path
                  d="M 62 68 C 65 38, 135 38, 138 68 C 125 54, 75 54, 62 68 Z"
                  fill={avatarConfig.hairColor}
                />
              )}
              {avatarConfig.hairStyle === 'curly' && (
                <g fill={avatarConfig.hairColor}>
                  <circle cx="70" cy="52" r="14" />
                  <circle cx="90" cy="45" r="15" />
                  <circle cx="110" cy="45" r="15" />
                  <circle cx="130" cy="52" r="14" />
                  <circle cx="62" cy="65" r="10" />
                  <circle cx="138" cy="65" r="10" />
                </g>
              )}

              {/* EYEBROWS */}
              <path d="M 72 82 Q 84 78 92 82" stroke={avatarConfig.hairColor} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 108 82 Q 116 78 128 82" stroke={avatarConfig.hairColor} strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* EYES */}
              {avatarConfig.sunglasses || (currentOutfit === 'festive' && avatarConfig.themeOutfit.festive.headwear === 'sunglasses-cool') ? (
                // Cool Picnic / Festive Sunglasses
                <g id="avatar-sunglasses">
                  <rect x="68" y="84" width="28" height="18" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                  <rect x="104" y="84" width="28" height="18" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                  <path d="M 96 90 L 104 90" stroke="#f59e0b" strokeWidth="2" />
                  <line x1="72" y1="88" x2="88" y2="98" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <line x1="108" y1="88" x2="124" y2="98" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </g>
              ) : (
                // Expressive Cartoon Eyes
                <g id="avatar-eyes">
                  <ellipse cx="82" cy="92" rx="7" ry="8" fill="#ffffff" />
                  <ellipse cx="118" cy="92" rx="7" ry="8" fill="#ffffff" />
                  {/* Iris */}
                  <circle cx="83" cy="92" r="4.5" fill="#1e293b" />
                  <circle cx="117" cy="92" r="4.5" fill="#1e293b" />
                  {/* Eye Sparkle */}
                  <circle cx="81" cy="90" r="1.8" fill="#ffffff" />
                  <circle cx="115" cy="90" r="1.8" fill="#ffffff" />
                </g>
              )}

              {/* GLASSES (If configured) */}
              {avatarConfig.glasses && !avatarConfig.sunglasses && (
                <g id="avatar-glasses">
                  <rect x="71" y="84" width="22" height="17" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.85" />
                  <rect x="107" y="84" width="22" height="17" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.85" />
                  <line x1="93" y1="91" x2="107" y2="91" stroke="#38bdf8" strokeWidth="2" />
                </g>
              )}

              {/* NOSE */}
              <path d="M 98 96 Q 100 106 104 106" stroke="rgba(0,0,0,0.25)" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* FACIAL HAIR */}
              {avatarConfig.facialHair === 'beard' && (
                <path
                  d="M 68 105 C 68 138, 132 138, 132 105 C 122 130, 78 130, 68 105 Z"
                  fill={avatarConfig.hairColor}
                  opacity="0.85"
                />
              )}
              {avatarConfig.facialHair === 'mustache' && (
                <path
                  d="M 86 112 Q 100 108 114 112 Q 100 118 86 112 Z"
                  fill={avatarConfig.hairColor}
                />
              )}
              {avatarConfig.facialHair === 'stubble' && (
                <path
                  d="M 76 114 Q 100 135 124 114"
                  stroke={avatarConfig.hairColor}
                  strokeWidth="4"
                  strokeDasharray="2 3"
                  opacity="0.5"
                  fill="none"
                />
              )}

              {/* MOUTH (Animated when speaking) */}
              {currentAction === 'speaking' ? (
                <ellipse cx="100" cy="118" rx="8" ry="5" fill="#7f1d1d" stroke="#be123c" strokeWidth="1">
                  <animate attributeName="ry" values="4;7;2;6;4" dur="0.8s" repeatCount="indefinite" />
                </ellipse>
              ) : currentAction === 'celebrating' || currentAction === 'dancing' ? (
                <path d="M 88 114 Q 100 128 112 114 Z" fill="#991b1b" stroke="#f43f5e" strokeWidth="1" />
              ) : (
                <path d="M 90 116 Q 100 124 110 116" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              )}

              {/* CHEEK BLUSH */}
              <circle cx="72" cy="106" r="5" fill="#f43f5e" opacity="0.25" />
              <circle cx="128" cy="106" r="5" fill="#f43f5e" opacity="0.25" />

              {/* FESTIVE PICNIC HAT (If selected in festive theme) */}
              {currentOutfit === 'festive' && avatarConfig.themeOutfit.festive.headwear === 'picnic-hat' && (
                <g id="picnic-hat">
                  <ellipse cx="100" cy="50" rx="46" ry="12" fill="#d97706" />
                  <path d="M 70 50 Q 100 10 130 50 Z" fill="#f59e0b" />
                  <rect x="74" y="44" width="52" height="6" fill="#10b981" />
                </g>
              )}
            </g>

            {/* ANIMATED HANDS / GESTURES */}
            {currentAction === 'waving' && (
              <g id="hand-wave">
                <circle cx="165" cy="130" r="12" fill={avatarConfig.skinTone}>
                  <animate attributeName="cy" values="130;115;130" dur="0.6s" repeatCount="indefinite" />
                </circle>
                <text x="156" y="136" fontSize="16">👋</text>
              </g>
            )}

            {currentAction === 'celebrating' && (
              <g id="hand-celebrate">
                <text x="25" y="130" fontSize="20">🎉</text>
                <text x="155" y="130" fontSize="20">🏆</text>
              </g>
            )}

            {currentAction === 'thumbsup' && (
              <g id="hand-thumbsup">
                <text x="155" y="145" fontSize="22">👍</text>
              </g>
            )}
          </svg>
        </motion.div>
      </motion.div>

      {/* Presenter Nameplate & Outfit Switcher */}
      <div className="mt-2 text-center flex flex-col items-center">
        <h4 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-1.5 drop-shadow-sm">
          {presenter.name}
          {currentOutfit === 'formal' && <Briefcase className="w-3.5 h-3.5 text-emerald-400" />}
          {currentOutfit === 'casual' && <Shirt className="w-3.5 h-3.5 text-cyan-400" />}
          {currentOutfit === 'festive' && <PartyPopper className="w-3.5 h-3.5 text-amber-400" />}
        </h4>
        <p className="text-xs text-emerald-300/90 font-medium">{presenter.designation}</p>

        {/* Interactive Outfit Theme Switcher Pill */}
        {interactive && onOutfitChange && (
          <div className="mt-2.5 inline-flex items-center p-0.5 rounded-full bg-slate-900/80 border border-slate-700/70 backdrop-blur-md shadow-inner text-[11px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentOutfit('formal');
                onOutfitChange('formal');
              }}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                currentOutfit === 'formal'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Formal Corporate Attire"
            >
              <Briefcase className="w-3 h-3" />
              Formal
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentOutfit('casual');
                onOutfitChange('casual');
              }}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                currentOutfit === 'casual'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Casual Picnic Polo & Gear"
            >
              <Shirt className="w-3 h-3" />
              Casual
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentOutfit('festive');
                onOutfitChange('festive');
              }}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                currentOutfit === 'festive'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Festive Gala & Picnic Costumes"
            >
              <PartyPopper className="w-3 h-3" />
              Festive
            </button>
          </div>
        )}

        {/* Action Pose Quick Buttons (Interactive avatar play) */}
        {interactive && (
          <div className="mt-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400">
            <button
              onClick={() => setCurrentAction('speaking')}
              className={`px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 ${currentAction === 'speaking' ? 'text-emerald-400 font-bold' : ''}`}
            >
              🎤 Speak
            </button>
            <button
              onClick={() => setCurrentAction('waving')}
              className={`px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 ${currentAction === 'waving' ? 'text-amber-400 font-bold' : ''}`}
            >
              👋 Wave
            </button>
            <button
              onClick={() => setCurrentAction('celebrating')}
              className={`px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 ${currentAction === 'celebrating' ? 'text-rose-400 font-bold' : ''}`}
            >
              🎉 Cheer
            </button>
            <button
              onClick={() => setCurrentAction('dancing')}
              className={`px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 ${currentAction === 'dancing' ? 'text-purple-400 font-bold' : ''}`}
            >
              🕺 Dance
            </button>
          </div>
        )}
      </div>

      {/* Optional Speech Bubble */}
      {showSpeechBubble && presenter.speechQuote && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-3 max-w-sm p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-md shadow-2xl text-xs text-slate-200 relative text-left"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-t border-l border-emerald-500/40 rotate-45" />
          <div className="flex items-start gap-2 relative z-10">
            <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="italic leading-relaxed">"{presenter.speechQuote}"</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
