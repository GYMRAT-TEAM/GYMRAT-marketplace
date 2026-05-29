import React from 'react';
import './GymRatBadge.css';

const GymRatBadge = ({ size = 20, className = "", showRibbons = false, variant = "premium" }) => {
  // Styles for different variants
  const variantStyles = {
    premium: {
      fill: 'url(#premiumSealGradient)',
      stroke: 'url(#goldGradient)',
      check: '#ffffff',
      shadow: 'rgba(255, 215, 0, 0.3)'
    },
    admin: {
      fill: '#150205', // Very dark deep red
      stroke: '#730c1e', // GymRat Red
      check: '#ffffff',
      shadow: 'rgba(115, 12, 30, 0.4)'
    },
    superadmin: {
      fill: '#0f0204',
      stroke: '#ff4d4d', // Bright Red
      check: '#ffffff',
      shadow: 'rgba(255, 77, 77, 0.5)'
    },
    verified: { // Matches the uploaded image exactly
      fill: '#1B1B1F', // Dark gray
      stroke: '#8ba2b5', // Light blue/grey
      check: '#ffffff',
      shadow: 'rgba(139, 162, 181, 0.2)'
    }
  };

  const currentStyle = variantStyles[variant] || variantStyles.premium;

  if (showRibbons) {
    return (
      <div 
        className={`gymrat-premium-badge ${className}`} 
        style={{ 
          width: size, 
          height: size * 1.2,
          filter: `drop-shadow(0 0 5px ${currentStyle.shadow})`
        }}
        title={`${variant.toUpperCase()} Member`}
      >
        <svg 
          viewBox="0 0 24 30" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="badge-svg"
        >
          {/* Ribbon Tails */}
          <path 
            d="M8 18L6 26L10 24L12 26V18" 
            fill="url(#ribbonGradient)" 
            className="ribbon-tail left"
          />
          <path 
            d="M16 18L18 26L14 24L12 26V18" 
            fill="url(#ribbonGradient)" 
            className="ribbon-tail right"
          />

          {/* Scalloped Seal (Wavy Circle) */}
          <path 
            d="M12 2C10.5 2 9.5 3 8.5 3.5C7.5 4 6.5 4 5.5 4.5C4.5 5 4 6 3.5 7C3 8 2.5 9 2.5 10.5C2.5 12 3 13 3.5 14C4 15 4.5 16 5.5 16.5C6.5 17 7.5 17 8.5 17.5C9.5 18 10.5 19 12 19C13.5 19 14.5 18 15.5 17.5C16.5 17 17.5 17 18.5 16.5C19.5 16 20 15 20.5 14C21 13 21.5 12 21.5 10.5C21.5 9 21 8 20.5 7C20 6 19.5 5 18.5 4.5C17.5 4 16.5 4 15.5 3.5C14.5 3 13.5 2 12 2Z" 
            fill={currentStyle.fill} 
            stroke={currentStyle.stroke}
            strokeWidth="0.8"
            className="seal-body"
          />

          {/* Inner Circle Border */}
          <circle 
            cx="12" 
            cy="10.5" 
            r="6.5" 
            stroke={currentStyle.stroke} 
            strokeWidth="0.5" 
            opacity="0.6"
          />
          
          {/* Checkmark */}
          <path 
            d="M8.5 10.5L11 13L15.5 8.5" 
            stroke={currentStyle.check} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="checkmark"
          />
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="premiumSealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#800000" />
              <stop offset="100%" stopColor="#4a0000" />
            </linearGradient>

            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a52a2a" />
              <stop offset="100%" stopColor="#5c1a1a" />
            </linearGradient>

            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFFACD" />
              <stop offset="100%" stopColor="#DAA520" />
            </linearGradient>
            
            <filter id="glow">
               <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
               <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
          </defs>
        </svg>
        <div className="badge-glow-red"></div>
      </div>
    );
  }

  // Symmetrical verified style matching user's reference image
  return (
    <div 
      className={`gymrat-premium-badge ${className}`} 
      style={{ 
        width: size, 
        height: size,
        filter: `drop-shadow(0 0 4px ${currentStyle.shadow})`
      }}
      title={`${variant.toUpperCase()} Verified`}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="badge-svg"
      >
        {/* Scalloped Symmetrical Seal Body (12 points) */}
        <path 
          d="M22 12c0-1.43-.88-2.67-2.19-3.21.13-.37.19-.77.19-1.18 0-1.99-1.62-3.61-3.61-3.61-.41 0-.81.06-1.18.19C14.92 2.88 13.57 2 12 2s-2.92.88-3.46 2.19c-.37-.13-.77-.19-1.18-.19-1.99 0-3.61 1.62-3.61 3.61 0 .41.06.81.19 1.18C2.88 9.33 2 10.68 2 12s.88 2.67 2.19 3.21c-.13.37-.19.77-.19 1.18 0 1.99 1.62 3.61 3.61 3.61.41 0 .81-.06 1.18-.19C9.08 21.12 10.43 22 12 22s2.92-.88 3.46-2.19c.37.13.77.19 1.18.19 1.99 0 3.61-1.62 3.61-3.61 0-.41-.06-.81-.19-1.18 1.31-.54 2.19-1.78 2.19-3.21z"
          fill={currentStyle.fill} 
          stroke={currentStyle.stroke}
          strokeWidth="1.2"
          className="seal-body"
        />

        {/* Checkmark */}
        <path 
          d="M8.5 12.5L11 15L16 10" 
          stroke={currentStyle.check} 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="checkmark"
        />

        {/* Definitions for Gradients */}
        <defs>
          <linearGradient id="premiumSealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#800000" />
            <stop offset="100%" stopColor="#4a0000" />
          </linearGradient>

          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFFACD" />
            <stop offset="100%" stopColor="#DAA520" />
          </linearGradient>

          <filter id="glow">
             <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
             <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default GymRatBadge;
