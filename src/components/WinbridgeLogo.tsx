import React from 'react';

interface WinbridgeLogoProps {
  className?: string;
  customUrl?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const WinbridgeLogo: React.FC<WinbridgeLogoProps> = ({
  className = '',
  customUrl,
  showTagline = false,
  size = 'md',
}) => {
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt="Winbridge Tech Logo"
        className={`object-contain ${className}`}
      />
    );
  }

  // Size variations
  const sizeStyles = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-24',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Vector SVG of Winbridge Tech Logo matching uploaded branding */}
      <svg
        viewBox="0 0 460 130"
        className={`${sizeStyles[size]} w-auto drop-shadow-[0_2px_12px_rgba(37,155,92,0.25)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="winbridge-logo-group">
          {/* WIN - Dark Teal (#1A6B85) */}
          <text
            x="5"
            y="76"
            fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            fontSize="82"
            letterSpacing="-2px"
            fill="#1A6B85"
          >
            WIN
          </text>

          {/* BRIDGE - Vibrant Green (#259B5C) */}
          <text
            x="165"
            y="76"
            fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            fontSize="82"
            letterSpacing="-1.5px"
            fill="#259B5C"
          >
            BRIDGE
          </text>

          {/* TECH - Dark Teal (#1A6B85) */}
          <text
            x="320"
            y="120"
            fontFamily="'Space Grotesk', 'Outfit', sans-serif"
            fontWeight="800"
            fontSize="42"
            letterSpacing="5px"
            fill="#1A6B85"
          >
            TECH
          </text>

          {/* Vertical Teal Brand Stripe on Right */}
          <rect x="444" y="6" width="10" height="118" rx="2" fill="#1A6B85" />
        </g>
      </svg>

      {showTagline && (
        <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-widest text-emerald-400/90 border-l border-slate-700 pl-3">
          Annual Picnic 2026
        </span>
      )}
    </div>
  );
};
