import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Presenter, OutfitTheme } from '../types';
import { Sparkles, Shirt, PartyPopper, Briefcase, Volume2, Smile, Eye } from 'lucide-react';

interface Avatar3DProps {
  presenter: Presenter;
  outfitTheme?: OutfitTheme;
  action?: 'speaking' | 'waving' | 'clapping' | 'celebrating' | 'thumbsup' | 'dancing';
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'tall' | 'stage';
  mode?: 'fullbody' | 'bust';
  showSpeechBubble?: boolean;
  onOutfitChange?: (theme: OutfitTheme) => void;
  interactive?: boolean;
  side?: 'left' | 'right' | 'center';
}

export const Avatar3D: React.FC<Avatar3DProps> = ({
  presenter,
  outfitTheme = 'formal',
  action = 'speaking',
  size = 'tall',
  mode = 'fullbody',
  showSpeechBubble = false,
  onOutfitChange,
  interactive = true,
  side = 'center',
}) => {
  const [currentAction, setCurrentAction] = useState(action);
  const [currentOutfit, setCurrentOutfit] = useState<OutfitTheme>(outfitTheme);
  const [isHovered, setIsHovered] = useState(false);
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
  const outfitData = avatarConfig?.themeOutfit?.[currentOutfit] as any || {};

  // Sizing definitions - Full Body Responsive Scale
  const sizeMap = {
    sm: { container: 'w-28 h-48', svg: 'w-24 h-44', scale: 0.7 },
    md: { container: 'w-44 h-72 sm:h-80', svg: 'w-40 h-68 sm:h-76', scale: 0.9 },
    lg: { container: 'w-56 sm:w-64 h-88 sm:h-96', svg: 'w-52 sm:w-60 h-84 sm:h-92', scale: 1.1 },
    hero: { container: 'w-64 sm:w-72 md:w-80 h-96 sm:h-[460px]', svg: 'w-60 sm:w-68 md:w-76 h-[380px] sm:h-[440px]', scale: 1.25 },
    tall: { container: 'w-56 sm:w-64 md:w-72 lg:w-80 h-[380px] sm:h-[460px] md:h-[520px] lg:h-[580px] xl:h-[620px]', svg: 'w-full h-full max-h-[580px]', scale: 1.35 },
    stage: { container: 'w-full max-w-[340px] h-[380px] sm:h-[480px] md:h-[540px] lg:h-[620px] xl:h-[680px]', svg: 'w-full h-full max-h-[660px]', scale: 1.45 },
  };

  const currentSizeConfig = sizeMap[size] || sizeMap.tall;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotY(Math.max(-22, Math.min(22, (x / (rect.width / 2)) * 20)));
    setRotX(Math.max(-18, Math.min(18, -(y / (rect.height / 2)) * 16)));
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setIsHovered(false);
  };

  // Outfit specific colors
  let topColor = '#1e293b';
  let topColorDark = '#090d16';
  let innerColor = '#ffffff';
  let accentColor = '#10b981';
  let pantsColor = '#1e293b';
  let shoesColor = '#0f172a';

  if (currentOutfit === 'formal') {
    if (presenter.id === 'ratul') {
      topColor = outfitData?.suitColor || '#d8caa8'; // Sand / Beige blazer
      topColorDark = '#988762';
      innerColor = outfitData?.shirtColor || '#1e293b'; // Charcoal black turtleneck
      accentColor = outfitData?.tieColor || '#d97706';
      pantsColor = '#1e293b';
      shoesColor = '#09090b';
    } else {
      topColor = outfitData?.suitColor || outfitData?.formal?.suitColor || (presenter.id === 'rifat' ? '#1e3a8a' : '#312e81');
      topColorDark = presenter.id === 'rifat' ? '#0f172a' : '#111827';
      innerColor = outfitData?.shirtColor || outfitData?.formal?.shirtColor || '#ffffff';
      accentColor = outfitData?.tieColor || outfitData?.formal?.tieColor || (presenter.id === 'rifat' ? '#38bdf8' : '#f59e0b');
      pantsColor = presenter.id === 'rifat' ? '#0f172a' : '#18181b';
      shoesColor = '#09090b';
    }
  } else if (currentOutfit === 'casual') {
    topColor = outfitData?.topColor || outfitData?.casual?.topColor || (presenter.id === 'rifat' ? '#0284c7' : '#0284c7');
    topColorDark = '#082f49';
    innerColor = outfitData?.bottomColor || outfitData?.casual?.bottomColor || '#1e293b';
    accentColor = '#f59e0b';
    pantsColor = '#1e293b';
    shoesColor = '#f8fafc'; // Pristine white sneakers
  } else if (currentOutfit === 'festive') {
    topColor = outfitData?.costumeColor || outfitData?.festive?.costumeColor || (presenter.id === 'rifat' ? '#059669' : '#d97706');
    topColorDark = '#064e3b';
    innerColor = outfitData?.accentColor || outfitData?.festive?.accentColor || '#fbbf24';
    accentColor = '#ec4899';
    pantsColor = '#0f172a';
    shoesColor = '#b45309';
  }

  // Aura colors for 3D stage glow
  const auraGlow =
    presenter.id === 'rifat'
      ? 'rgba(59, 130, 246, 0.6)'
      : presenter.id === 'ratul'
      ? 'rgba(217, 119, 6, 0.55)'
      : 'rgba(99, 102, 241, 0.6)';

  return (
    <div className="relative flex flex-col items-center select-none group w-full h-full justify-end">
      {/* 3D Stage Stand Area */}
      <motion.div
        className={`${currentSizeConfig.container} relative flex flex-col items-center justify-end overflow-visible`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotX,
          rotateY: rotY,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        {/* 3D Floor Pedestal / Glowing Stage Disc beneath the host */}
        <div className="absolute -bottom-4 w-[85%] sm:w-[90%] h-14 pointer-events-none flex items-center justify-center">
          {/* Outer Ambient Stage Glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-80 animate-pulse transition-all duration-700"
            style={{
              background: `radial-gradient(ellipse at center, ${auraGlow} 0%, rgba(0,0,0,0) 72%)`,
            }}
          />

          {/* 3D Elliptical Stage Riser Rings */}
          <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
            <defs>
              <linearGradient id={`pedestalGrad-${presenter.id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={presenter.id === 'rifat' ? '#1d4ed8' : '#6366f1'} stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor={presenter.id === 'rifat' ? '#1e40af' : '#4338ca'} stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Stage Base Shadow */}
            <ellipse cx="100" cy="38" rx="88" ry="18" fill="rgba(0, 0, 0, 0.7)" />
            {/* Outer LED Ring */}
            <ellipse cx="100" cy="32" rx="82" ry="16" fill="none" stroke={`url(#pedestalGrad-${presenter.id})`} strokeWidth="3" strokeDasharray="6 4" opacity="0.9" />
            {/* Inner Glowing Disc */}
            <ellipse cx="100" cy="32" rx="66" ry="12" fill={presenter.id === 'rifat' ? 'rgba(30, 58, 138, 0.4)' : 'rgba(49, 46, 129, 0.4)'} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            {/* Center Spotlight Target */}
            <ellipse cx="100" cy="32" rx="42" ry="7" fill={presenter.id === 'rifat' ? 'rgba(56, 189, 248, 0.5)' : 'rgba(168, 85, 247, 0.5)'} />
          </svg>
        </div>

        {/* 3D Full-Body Animated Host Rig */}
        <motion.div
          animate={
            currentAction === 'speaking'
              ? { y: [0, -6, 0], rotate: [0, 0.6, -0.6, 0] }
              : currentAction === 'waving'
              ? { y: [0, -8, 0], rotate: side === 'left' ? [-1, 2, -1] : [1, -2, 1] }
              : currentAction === 'celebrating'
              ? { y: [0, -14, 0], scale: [1, 1.03, 1] }
              : currentAction === 'dancing'
              ? { y: [0, -10, 0], rotate: [-3, 3, -3], x: [-4, 4, -4] }
              : currentAction === 'clapping'
              ? { y: [0, -4, 0], scale: [1, 1.02, 1] }
              : { y: [0, -3, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: currentAction === 'dancing' ? 1.3 : currentAction === 'speaking' ? 2.8 : 2.2,
            ease: 'easeInOut',
          }}
          className={`${currentSizeConfig.svg} relative drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)] flex items-end justify-center`}
        >
          <svg
            viewBox="0 0 240 500"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax meet"
          >
            <defs>
              {/* Lighting Shaders & Gradients */}
              <radialGradient id={`skinGlow-${presenter.id}`} cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
              </radialGradient>

              <linearGradient id={`suitGrad-${presenter.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={topColor} />
                <stop offset="70%" stopColor={topColorDark} />
                <stop offset="100%" stopColor="#050811" />
              </linearGradient>

              <linearGradient id={`pantsGrad-${presenter.id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0a0f1d" />
                <stop offset="40%" stopColor={pantsColor} />
                <stop offset="80%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#050811" />
              </linearGradient>

              <linearGradient id={`goldShine-${presenter.id}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="40%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id={`micGrad-${presenter.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              <linearGradient id={`leatherShine-${presenter.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="30%" stopColor={shoesColor} />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* ---------------------------------------------------- */}
            {/* 1. FEET & SHOES (Full Body Standing Tall) */}
            {/* ---------------------------------------------------- */}
            <g id="host-shoes">
              {/* Ground Contact Shadow */}
              <ellipse cx="88" cy="468" rx="26" ry="7" fill="rgba(0,0,0,0.6)" />
              <ellipse cx="152" cy="468" rx="26" ry="7" fill="rgba(0,0,0,0.6)" />

              {/* Left Shoe */}
              <g id="shoe-left">
                <path
                  d="M 68 450 Q 85 442 108 450 L 112 466 Q 88 472 65 466 Q 64 458 68 450 Z"
                  fill={`url(#leatherShine-${presenter.id})`}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
                {/* Shoe Sole & Gloss Tip */}
                <path d="M 65 464 Q 88 470 112 464 L 111 467 Q 88 473 64 467 Z" fill="#000000" />
                {currentOutfit === 'casual' ? (
                  // White Sneaker Stripe
                  <path d="M 72 454 Q 90 448 106 454" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  // Oxford Leather Toe Cap Highlight
                  <path d="M 94 452 Q 106 454 109 462" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
                )}
              </g>

              {/* Right Shoe */}
              <g id="shoe-right">
                <path
                  d="M 132 450 Q 155 442 172 450 L 176 466 Q 152 472 128 466 Q 128 458 132 450 Z"
                  fill={`url(#leatherShine-${presenter.id})`}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
                {/* Shoe Sole & Gloss Tip */}
                <path d="M 128 464 Q 152 470 176 464 L 175 467 Q 152 473 127 467 Z" fill="#000000" />
                {currentOutfit === 'casual' ? (
                  <path d="M 134 454 Q 150 448 168 454" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  <path d="M 154 452 Q 166 454 169 462" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
                )}
              </g>
            </g>

            {/* ---------------------------------------------------- */}
            {/* 2. LEGS & TAILORED TROUSERS */}
            {/* ---------------------------------------------------- */}
            <g id="host-legs">
              {/* Left Leg */}
              <path
                d="M 78 285 L 68 452 L 108 452 L 112 288 Z"
                fill={`url(#pantsGrad-${presenter.id})`}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              {/* Left Leg Crease Line */}
              <line x1="88" y1="290" x2="88" y2="448" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Right Leg */}
              <path
                d="M 128 288 L 132 452 L 172 452 L 162 285 Z"
                fill={`url(#pantsGrad-${presenter.id})`}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              {/* Right Leg Crease Line */}
              <line x1="152" y1="290" x2="152" y2="448" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Crotch & Inseam Shading */}
              <path d="M 112 288 Q 120 325 128 288 Z" fill="#050811" />
            </g>

            {/* ---------------------------------------------------- */}
            {/* 3. BELT & WAIST */}
            {/* ---------------------------------------------------- */}
            <g id="host-belt">
              <rect x="74" y="278" width="92" height="10" rx="2" fill="#090d16" />
              {/* Gold / Chrome Metallic Buckle */}
              <rect x="110" y="276" width="20" height="14" rx="2" fill={`url(#goldShine-${presenter.id})`} stroke="#000" strokeWidth="0.5" />
              <rect x="114" y="279" width="12" height="8" rx="1" fill="#090d16" />
            </g>

            {/* ---------------------------------------------------- */}
            {/* 4. UPPER BODY / TORSO / SUIT BLAZER / OUTFIT */}
            {/* ---------------------------------------------------- */}
            <g id="host-torso">
              {/* Base Tailored Suit Coat Silhouette */}
              <path
                d="M 52 165 C 45 200, 48 250, 68 288 L 172 288 C 192 250, 195 200, 188 165 C 160 145, 80 145, 52 165 Z"
                fill={`url(#suitGrad-${presenter.id})`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />

              {/* Outfit Variations */}
              {currentOutfit === 'formal' && (
                <g id="formal-jacket-details">
                  {presenter.id === 'ratul' ? (
                    // Mr. Ratul: Signature Sand/Beige Blazer with Charcoal Ribbed Turtleneck
                    <g id="ratul-formal-attire">
                      {/* Charcoal Knitted Turtleneck Base */}
                      <polygon points="96,145 144,145 120,225" fill="#1e293b" />
                      <line x1="108" y1="150" x2="108" y2="215" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <line x1="116" y1="150" x2="116" y2="222" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <line x1="124" y1="150" x2="124" y2="222" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                      <line x1="132" y1="150" x2="132" y2="215" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                      {/* Tailored Sand/Beige Blazer Lapels (Left & Right Notch) */}
                      <path d="M 66 155 L 112 245 L 86 245 Z" fill={topColor} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                      <path d="M 174 155 L 128 245 L 154 245 Z" fill={topColor} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

                      {/* Chest Pocket Welt */}
                      <rect x="74" y="195" width="22" height="4" rx="1" fill="#beae87" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />

                      {/* Host VIP Gold Lapel Pin */}
                      <circle cx="76" cy="175" r="3.5" fill={`url(#goldShine-${presenter.id})`} />
                      <polygon points="76,172 77,174 80,175 78,177 78,179 76,178 74,179 74,177 72,175 75,174" fill="#ffffff" />

                      {/* Suit Jacket Front Buttons */}
                      <circle cx="120" cy="250" r="2.5" fill="#beae87" stroke="#786644" strokeWidth="0.8" />
                      <circle cx="120" cy="270" r="2.5" fill="#beae87" stroke="#786644" strokeWidth="0.8" />
                    </g>
                  ) : (
                    // Classic Suit & Tie (Mr. Rifat / Keynote speakers)
                    <g id="classic-suit-attire">
                      {/* Crisp White Shirt V-Neck */}
                      <polygon points="100,150 140,150 120,215" fill={innerColor} />

                      {/* Formal Windsor Tie with Gold Bar */}
                      <polygon
                        points="114,155 126,155 129,235 120,248 111,235"
                        fill={accentColor}
                        stroke="#000"
                        strokeWidth="0.5"
                      />
                      {/* Gold Tie Clip */}
                      <line x1="113" y1="195" x2="127" y2="195" stroke={`url(#goldShine-${presenter.id})`} strokeWidth="2.5" />

                      {/* Tailored Suit Lapels (Left & Right) */}
                      <path d="M 68 158 L 108 235 L 88 235 Z" fill={topColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                      <path d="M 172 158 L 132 235 L 152 235 Z" fill={topColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                      {/* Chest Pocket & Gold Pocket Square */}
                      <rect x="74" y="195" width="22" height="4" rx="1" fill="#090d16" />
                      <polygon points="78,195 86,182 92,195" fill={`url(#goldShine-${presenter.id})`} />

                      {/* Winbridge Gold Lapel Pin */}
                      <circle cx="78" cy="175" r="3.5" fill={`url(#goldShine-${presenter.id})`} />

                      {/* Suit Jacket Front Buttons */}
                      <circle cx="120" cy="245" r="2.5" fill="#000000" stroke={`url(#goldShine-${presenter.id})`} strokeWidth="0.8" />
                      <circle cx="120" cy="265" r="2.5" fill="#000000" stroke={`url(#goldShine-${presenter.id})`} strokeWidth="0.8" />
                    </g>
                  )}
                </g>
              )}

              {currentOutfit === 'casual' && (
                <g id="casual-polo-details">
                  {/* Polo Collar */}
                  <path d="M 96 150 L 120 185 L 144 150 Z" fill="#082f49" opacity="0.6" />
                  <polygon points="102,150 138,150 120,185" fill={innerColor} />
                  <circle cx="120" cy="165" r="2.5" fill="#f8fafc" />
                  <circle cx="120" cy="176" r="2.5" fill="#f8fafc" />

                  {/* Winbridge Shield Emblem on Left Chest */}
                  <rect x="72" y="190" width="20" height="16" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <text x="76" y="202" fontSize="9" fontWeight="900" fill="#ffffff">WB</text>

                  {/* Sporty Athletic Side Stripes */}
                  <path d="M 52 178 L 66 285" stroke="rgba(56,189,248,0.5)" strokeWidth="3.5" />
                  <path d="M 188 178 L 174 285" stroke="rgba(56,189,248,0.5)" strokeWidth="3.5" />
                </g>
              )}

              {currentOutfit === 'festive' && (
                <g id="festive-gala-details">
                  {/* Mandarin Royal Collar */}
                  <rect x="104" y="148" width="32" height="12" rx="3" fill={`url(#goldShine-${presenter.id})`} />

                  {/* Central Gold Brocade Placket */}
                  <rect x="114" y="160" width="12" height="125" fill={`url(#goldShine-${presenter.id})`} />
                  <circle cx="120" cy="175" r="3" fill="#dc2626" />
                  <circle cx="120" cy="198" r="3" fill="#dc2626" />
                  <circle cx="120" cy="221" r="3" fill="#dc2626" />
                  <circle cx="120" cy="244" r="3" fill="#dc2626" />
                  <circle cx="120" cy="267" r="3" fill="#dc2626" />

                  {/* Royal Floral Garland / Lei */}
                  <path
                    d="M 66 160 Q 120 250 174 160"
                    stroke="#fbbf24"
                    strokeWidth="8"
                    strokeDasharray="4 8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              )}
            </g>

            {/* ---------------------------------------------------- */}
            {/* 5. ARMS & HANDS (Microphones & Keynote Gestures) */}
            {/* ---------------------------------------------------- */}
            <g id="host-arms">
              {/* LEFT ARM */}
              {side === 'left' || presenter.id === 'rifat' ? (
                // Mr. Rifat holds the Golden Dynamic Stage Microphone to speak
                <g id="rifat-holding-mic">
                  {/* Upper Arm */}
                  <path d="M 52 165 Q 32 210 50 245" stroke={`url(#suitGrad-${presenter.id})`} strokeWidth="22" strokeLinecap="round" fill="none" />
                  {/* Forearm bent toward chest holding mic */}
                  <path d="M 50 245 L 105 210" stroke={`url(#suitGrad-${presenter.id})`} strokeWidth="18" strokeLinecap="round" fill="none" />
                  {/* White Shirt Cuff */}
                  <circle cx="103" cy="212" r="9" fill={innerColor} />
                  {/* Hand gripping mic */}
                  <circle cx="106" cy="210" r="8" fill={avatarConfig.skinTone} />

                  {/* Wireless Stage Microphone */}
                  <g id="stage-microphone">
                    {/* Mic Handle */}
                    <line x1="102" y1="228" x2="114" y2="192" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
                    {/* Blue LED Power Status Ring on Mic */}
                    <circle cx="105" cy="218" r="4" fill="#38bdf8" />
                    {/* Golden Mesh Capsule Head */}
                    <circle cx="116" cy="186" r="7.5" fill={`url(#micGrad-${presenter.id})`} stroke="#d97706" strokeWidth="1" />
                    {/* Audio Soundwave Pulse from Mic */}
                    {currentAction === 'speaking' && (
                      <circle cx="116" cy="186" r="13" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7">
                        <animate attributeName="r" values="8;18;24" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.9;0.4;0" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                </g>
              ) : (
                // Natural Relaxed / Gesturing Left Arm
                <g id="left-arm-default">
                  <path d="M 52 165 Q 36 215 44 265" stroke={`url(#suitGrad-${presenter.id})`} strokeWidth="20" strokeLinecap="round" fill="none" />
                  <circle cx="44" cy="265" r="9" fill={innerColor} />
                  <circle cx="45" cy="272" r="8" fill={avatarConfig.skinTone} />
                </g>
              )}

              {/* RIGHT ARM */}
              {side === 'right' || presenter.id === 'ratul' ? (
                // Mr. Ratul Gesturing / Holding Cue Card & Mic
                <g id="ratul-holding-cuecard">
                  {/* Upper Arm */}
                  <path d="M 188 165 Q 208 210 190 245" stroke={`url(#suitGrad-${presenter.id})`} strokeWidth="22" strokeLinecap="round" fill="none" />
                  {/* Forearm bent holding VIP agenda card / mic */}
                  <path d="M 190 245 L 138 215" stroke={`url(#suitGrad-${presenter.id})`} strokeWidth="18" strokeLinecap="round" fill="none" />
                  {/* Cuff */}
                  <circle cx="140" cy="217" r="9" fill={innerColor} />

                  {/* Silver Executive Wristwatch on Ratul */}
                  <g id="ratul-wristwatch">
                    <rect x="141" y="210" width="8" height="14" rx="2" fill="#94a3b8" stroke="#334155" strokeWidth="0.8" />
                    <circle cx="145" cy="217" r="4.5" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <circle cx="145" cy="217" r="1.5" fill="#ffffff" />
                  </g>

                  {/* Hand */}
                  <circle cx="136" cy="215" r="8" fill={avatarConfig.skinTone} />

                  {/* VIP Leather Presentation Cue-Card */}
                  <rect
                    x="122"
                    y="190"
                    width="26"
                    height="32"
                    rx="3"
                    fill="#0f172a"
                    stroke={`url(#goldShine-${presenter.id})`}
                    strokeWidth="1.5"
                    transform="rotate(-15 135 206)"
                  />
                  <rect
                    x="126"
                    y="195"
                    width="18"
                    height="2"
                    fill="#38bdf8"
                    transform="rotate(-15 135 206)"
                  />
                  <rect
                    x="126"
                    y="200"
                    width="14"
                    height="2"
                    fill="#fef08a"
                    transform="rotate(-15 135 206)"
                  />

                  {/* Animated Waving / Cheer Gestures */}
                  {currentAction === 'waving' && (
                    <g transform="translate(195, 160)">
                      <circle cx="0" cy="0" r="9" fill={avatarConfig.skinTone} />
                      <text x="-6" y="5" fontSize="16">👋</text>
                    </g>
                  )}
                </g>
              ) : (
                // Natural Right Arm with Stage Gesture
                <g id="right-arm-gesture">
                  <path d="M 188 165 Q 204 215 196 265" stroke={`url(#suitGrad-${presenter.id})`} strokeWidth="20" strokeLinecap="round" fill="none" />
                  <circle cx="196" cy="265" r="9" fill={innerColor} />
                  <circle cx="195" cy="272" r="8" fill={avatarConfig.skinTone} />
                </g>
              )}

              {/* Action Overlays: Thumbs Up / Celebrating */}
              {currentAction === 'celebrating' && (
                <g id="celebrate-fx">
                  <text x="25" y="170" fontSize="24">🎉</text>
                  <text x="185" y="170" fontSize="24">🏆</text>
                </g>
              )}
              {currentAction === 'thumbsup' && (
                <g id="thumbsup-fx">
                  <text x={side === 'left' ? '190' : '25'} y="180" fontSize="26">👍</text>
                </g>
              )}
            </g>

            {/* ---------------------------------------------------- */}
            {/* 6. NECK */}
            {/* ---------------------------------------------------- */}
            <g id="host-neck">
              <rect x="106" y="122" width="28" height="28" rx="4" fill={avatarConfig.skinTone} />
              <rect x="106" y="122" width="28" height="28" rx="4" fill={`url(#skinGlow-${presenter.id})`} />
              {presenter.id === 'ratul' && currentOutfit === 'formal' && (
                // Knitted Charcoal High-Neck Turtleneck Collar
                <g id="turtleneck-collar">
                  <rect x="102" y="130" width="36" height="18" rx="4" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                  <line x1="109" y1="130" x2="109" y2="148" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="116" y1="130" x2="116" y2="148" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="123" y1="130" x2="123" y2="148" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  <line x1="130" y1="130" x2="130" y2="148" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </g>
              )}
            </g>

            {/* ---------------------------------------------------- */}
            {/* 7. HEAD & EXPRESSIVE FACE */}
            {/* ---------------------------------------------------- */}
            <g id="host-head">
              {/* Ears */}
              <circle cx="78" cy="94" r="11" fill={avatarConfig.skinTone} />
              <circle cx="162" cy="94" r="11" fill={avatarConfig.skinTone} />
              <circle cx="78" cy="94" r="6" fill="#000000" opacity="0.12" />
              <circle cx="162" cy="94" r="6" fill="#000000" opacity="0.12" />

              {/* Head Base */}
              <rect
                x="82"
                y="50"
                width="76"
                height="84"
                rx="34"
                fill={avatarConfig.skinTone}
                stroke="rgba(0,0,0,0.12)"
                strokeWidth="1"
              />
              <rect
                x="82"
                y="50"
                width="76"
                height="84"
                rx="34"
                fill={`url(#skinGlow-${presenter.id})`}
              />

              {/* HAIR STYLES */}
              {(avatarConfig.hairStyle === 'ratul-wavy' || presenter.id === 'ratul') ? (
                // Mr. Ratul's signature voluminous wavy black hair with soft side curls
                <g id="ratul-signature-wavy-hair">
                  {/* Back/Side Curl Clusters framing temples and neck */}
                  <path d="M 74 88 C 68 76, 70 58, 80 50 C 74 65, 76 80, 74 88 Z" fill="#090d16" />
                  <circle cx="74" cy="74" r="8" fill="#0f172a" />
                  <circle cx="72" cy="86" r="7" fill="#090d16" />
                  <circle cx="75" cy="98" r="6" fill="#1e2433" />

                  <path d="M 166 88 C 172 76, 170 58, 160 50 C 166 65, 164 80, 166 88 Z" fill="#090d16" />
                  <circle cx="166" cy="74" r="8" fill="#0f172a" />
                  <circle cx="168" cy="86" r="7" fill="#090d16" />
                  <circle cx="165" cy="98" r="6" fill="#1e2433" />

                  {/* Main Wavy Crown Volume swept back on top */}
                  <path
                    d="M 76 66 C 72 30, 95 18, 120 18 C 145 18, 168 30, 164 66 C 156 46, 142 36, 120 36 C 98 36, 84 46, 76 66 Z"
                    fill="#090d16"
                  />
                  <path
                    d="M 86 48 C 100 32, 140 32, 154 48 C 144 38, 132 35, 120 35 C 108 35, 96 38, 86 48 Z"
                    fill="#1e2433"
                  />
                  {/* Subtle Wave Crest Highlights */}
                  <path d="M 96 38 Q 108 30 120 38" stroke="#334155" strokeWidth="1.5" fill="none" opacity="0.6" />
                  <path d="M 120 38 Q 132 30 144 38" stroke="#334155" strokeWidth="1.5" fill="none" opacity="0.6" />
                </g>
              ) : avatarConfig.hairStyle === 'stylish' ? (
                <path
                  d="M 78 68 C 75 34, 110 22, 160 34 C 168 50, 165 70, 160 72 C 150 48, 95 48, 80 72 Z"
                  fill={avatarConfig.hairColor}
                />
              ) : avatarConfig.hairStyle === 'short' ? (
                <path
                  d="M 80 66 C 80 38, 160 38, 160 66 C 150 54, 90 54, 80 66 Z"
                  fill={avatarConfig.hairColor}
                />
              ) : avatarConfig.hairStyle === 'fade' ? (
                <path
                  d="M 82 64 C 85 34, 155 34, 158 64 C 145 50, 95 50, 82 64 Z"
                  fill={avatarConfig.hairColor}
                />
              ) : avatarConfig.hairStyle === 'curly' ? (
                <g fill={avatarConfig.hairColor}>
                  <circle cx="90" cy="48" r="14" />
                  <circle cx="110" cy="40" r="15" />
                  <circle cx="130" cy="40" r="15" />
                  <circle cx="150" cy="48" r="14" />
                  <circle cx="82" cy="60" r="10" />
                  <circle cx="158" cy="60" r="10" />
                </g>
              ) : null}

              {/* EYEBROWS */}
              <path d="M 92 78 Q 104 73 113 77" stroke={avatarConfig.hairColor} strokeWidth="3.8" strokeLinecap="round" fill="none" />
              <path d="M 127 77 Q 136 73 148 78" stroke={avatarConfig.hairColor} strokeWidth="3.8" strokeLinecap="round" fill="none" />

              {/* EYES */}
              {avatarConfig.sunglasses || (currentOutfit === 'festive' && avatarConfig.themeOutfit.festive.headwear === 'sunglasses-cool') ? (
                // VIP / Picnic Sunglasses
                <g id="avatar-sunglasses">
                  <rect x="88" y="80" width="28" height="18" rx="6" fill="#090d16" stroke={`url(#goldShine-${presenter.id})`} strokeWidth="1.5" />
                  <rect x="124" y="80" width="28" height="18" rx="6" fill="#090d16" stroke={`url(#goldShine-${presenter.id})`} strokeWidth="1.5" />
                  <path d="M 116 86 L 124 86" stroke={`url(#goldShine-${presenter.id})`} strokeWidth="2" />
                  <line x1="92" y1="84" x2="108" y2="94" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <line x1="128" y1="84" x2="144" y2="94" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                </g>
              ) : (
                // Expressive Eyes with 3D Specular Highlight & Eyelid Crease
                <g id="avatar-eyes">
                  {/* Double Eyelid Fold Line for Ratul / Realistic Hosts */}
                  <path d="M 94 82 Q 102 78 110 82" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  <path d="M 130 82 Q 138 78 146 82" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

                  <ellipse cx="102" cy="88" rx="7.5" ry="8" fill="#ffffff" />
                  <ellipse cx="138" cy="88" rx="7.5" ry="8" fill="#ffffff" />
                  {/* Iris */}
                  <circle cx="103" cy="88" r="4.8" fill="#1e293b" />
                  <circle cx="137" cy="88" r="4.8" fill="#1e293b" />
                  {/* Pupil */}
                  <circle cx="103" cy="88" r="2.4" fill="#000000" />
                  <circle cx="137" cy="88" r="2.4" fill="#000000" />
                  {/* Specular Sparkle */}
                  <circle cx="101" cy="86" r="1.8" fill="#ffffff" />
                  <circle cx="135" cy="86" r="1.8" fill="#ffffff" />
                </g>
              )}

              {/* GLASSES (If configured) */}
              {avatarConfig.glasses && !avatarConfig.sunglasses && (
                <g id="avatar-glasses">
                  <rect x="91" y="80" width="22" height="17" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
                  <rect x="127" y="80" width="22" height="17" rx="5" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.9" />
                  <line x1="113" y1="87" x2="127" y2="87" stroke="#38bdf8" strokeWidth="2" />
                </g>
              )}

              {/* NOSE */}
              <path d="M 118 92 Q 120 102 124 102" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* FACIAL HAIR */}
              {(avatarConfig.facialHair === 'ratul-beard' || presenter.id === 'ratul') ? (
                // Mr. Ratul's signature manicured full beard connecting with mustache & soul patch
                <g id="ratul-full-groomed-beard">
                  {/* Full Jawline & Chin Beard Contour */}
                  <path
                    d="M 82 92 
                       C 82 124, 98 135, 120 135 
                       C 142 135, 158 124, 158 92 
                       C 152 118, 138 127, 120 127 
                       C 102 127, 88 118, 82 92 Z"
                    fill="#090d16"
                  />
                  <path
                    d="M 86 96 
                       C 86 122, 100 131, 120 131 
                       C 140 131, 154 122, 154 96 
                       C 148 116, 136 124, 120 124 
                       C 104 124, 92 116, 86 96 Z"
                    fill="#1e2433"
                    opacity="0.85"
                  />

                  {/* Connected Mustache */}
                  <path d="M 104 106 Q 120 102 136 106 Q 120 112 104 106 Z" fill="#090d16" />
                  
                  {/* Soul Patch */}
                  <polygon points="117,114 123,114 121,123 119,123" fill="#090d16" />

                  {/* Stubble Texture along cheeks */}
                  <path d="M 88 98 Q 104 115 112 117" stroke="#090d16" strokeWidth="2" strokeDasharray="1.5 2" opacity="0.5" fill="none" />
                  <path d="M 152 98 Q 136 115 128 117" stroke="#090d16" strokeWidth="2" strokeDasharray="1.5 2" opacity="0.5" fill="none" />
                </g>
              ) : avatarConfig.facialHair === 'beard' ? (
                <path
                  d="M 88 100 C 88 132, 152 132, 152 100 C 142 125, 98 125, 88 100 Z"
                  fill={avatarConfig.hairColor}
                  opacity="0.9"
                />
              ) : avatarConfig.facialHair === 'mustache' ? (
                <path
                  d="M 106 108 Q 120 104 134 108 Q 120 114 106 108 Z"
                  fill={avatarConfig.hairColor}
                />
              ) : avatarConfig.facialHair === 'stubble' ? (
                <path
                  d="M 96 110 Q 120 130 144 110"
                  stroke={avatarConfig.hairColor}
                  strokeWidth="4"
                  strokeDasharray="2 3"
                  opacity="0.55"
                  fill="none"
                />
              ) : null}

              {/* MOUTH (Animated Lip-Sync) */}
              {currentAction === 'speaking' ? (
                <ellipse cx="120" cy="114" rx="8" ry="5" fill="#7f1d1d" stroke="#be123c" strokeWidth="1">
                  <animate attributeName="ry" values="3;7;2;6;3" dur="0.6s" repeatCount="indefinite" />
                </ellipse>
              ) : currentAction === 'celebrating' || currentAction === 'dancing' ? (
                <path d="M 108 110 Q 120 124 132 110 Z" fill="#991b1b" stroke="#f43f5e" strokeWidth="1" />
              ) : (
                <path d="M 110 112 Q 120 120 130 112" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              )}

              {/* CHEEK BLUSH */}
              <circle cx="92" cy="102" r="5" fill="#f43f5e" opacity="0.25" />
              <circle cx="148" cy="102" r="5" fill="#f43f5e" opacity="0.25" />

              {/* FESTIVE HAT (If selected) */}
              {currentOutfit === 'festive' && avatarConfig.themeOutfit.festive.headwear === 'picnic-hat' && (
                <g id="picnic-hat">
                  <ellipse cx="120" cy="46" rx="46" ry="12" fill="#d97706" />
                  <path d="M 90 46 Q 120 8 150 46 Z" fill="#f59e0b" />
                  <rect x="94" y="40" width="52" height="6" fill="#10b981" />
                </g>
              )}
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* 3D Presenter Podium Base Nameplate & Controls */}
      <div className="mt-3 text-center flex flex-col items-center z-10">
        <div className="px-3.5 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-lg flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              presenter.id === 'rifat' ? 'bg-blue-400 animate-pulse' : 'bg-indigo-400 animate-pulse'
            }`}
          />
          <h4 className="font-extrabold text-xs sm:text-sm text-white tracking-wide flex items-center gap-1">
            {presenter.name}
            {currentOutfit === 'formal' && <Briefcase className="w-3 h-3 text-emerald-400" />}
            {currentOutfit === 'casual' && <Shirt className="w-3 h-3 text-cyan-400" />}
            {currentOutfit === 'festive' && <PartyPopper className="w-3 h-3 text-amber-400" />}
          </h4>
        </div>
        <p className="text-[11px] text-blue-300/90 font-semibold mt-0.5">{presenter.designation}</p>

        {/* Interactive Outfit Theme Switcher Pill */}
        {interactive && onOutfitChange && (
          <div className="mt-2 inline-flex items-center p-0.5 rounded-full bg-slate-950/80 border border-slate-700/60 backdrop-blur-md shadow-inner text-[10px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentOutfit('formal');
                onOutfitChange('formal');
              }}
              className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                currentOutfit === 'formal'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Formal Corporate Attire"
            >
              <Briefcase className="w-2.5 h-2.5" />
              Formal
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentOutfit('casual');
                onOutfitChange('casual');
              }}
              className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                currentOutfit === 'casual'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Casual Picnic Polo & Sneakers"
            >
              <Shirt className="w-2.5 h-2.5" />
              Casual
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentOutfit('festive');
                onOutfitChange('festive');
              }}
              className={`px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                currentOutfit === 'festive'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Festive Gala Kurta & Lei"
            >
              <PartyPopper className="w-2.5 h-2.5" />
              Festive
            </button>
          </div>
        )}

        {/* Action Pose Quick Buttons (Interactive avatar play on hover/focus) */}
        {interactive && (
          <div className="mt-1 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity text-[9px] text-slate-400">
            <button
              onClick={() => setCurrentAction('speaking')}
              className={`px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 ${currentAction === 'speaking' ? 'text-blue-400 font-bold' : ''}`}
            >
              🎤 Speak
            </button>
            <button
              onClick={() => setCurrentAction('waving')}
              className={`px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 ${currentAction === 'waving' ? 'text-amber-400 font-bold' : ''}`}
            >
              👋 Wave
            </button>
            <button
              onClick={() => setCurrentAction('celebrating')}
              className={`px-1.5 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 ${currentAction === 'celebrating' ? 'text-rose-400 font-bold' : ''}`}
            >
              🎉 Cheer
            </button>
          </div>
        )}
      </div>

      {/* Optional Speech Bubble Floating with pointer */}
      {showSpeechBubble && presenter.speechQuote && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-2 max-w-xs p-3 rounded-2xl bg-slate-950/90 border border-blue-500/40 backdrop-blur-md shadow-2xl text-xs text-slate-200 relative text-left"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-slate-950 border-t border-l border-blue-500/40 rotate-45" />
          <div className="flex items-start gap-2 relative z-10">
            <Volume2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="italic leading-relaxed">"{presenter.speechQuote}"</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
