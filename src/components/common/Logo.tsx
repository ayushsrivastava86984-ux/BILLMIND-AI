import React from 'react';
import { useApp } from '../../context/AppContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showAiBadge?: boolean;
  clickable?: boolean;
  className?: string;
  variant?: 'auto' | 'light' | 'dark'; // override if needed
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showAiBadge = true,
  clickable = true,
  className = '',
  variant = 'auto',
}) => {
  const { user, navigateTo, resolvedTheme } = useApp();

  const isLight = variant === 'light' || (variant === 'auto' && resolvedTheme === 'light');

  const handleClick = (e: React.MouseEvent) => {
    if (!clickable) return;
    e.preventDefault();
    if (user) {
      navigateTo('dashboard');
    } else {
      navigateTo('landing');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!clickable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (user) {
        navigateTo('dashboard');
      } else {
        navigateTo('landing');
      }
    }
  };

  // Size specifications
  const iconDimensions = {
    sm: 'w-7 h-7 min-w-[28px]',
    md: 'w-9 h-9 min-w-[36px]',
    lg: 'w-12 h-12 min-w-[48px]',
  }[size];

  const svgDimensions = {
    sm: 18,
    md: 22,
    lg: 28,
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  const badgeSizes = {
    sm: 'text-[9px] px-1 py-0.2',
    md: 'text-[10px] px-1.5 py-0.5',
    lg: 'text-xs px-2 py-0.5',
  }[size];

  return (
    <div
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      title={clickable ? (user ? 'Go to Dashboard' : 'Go to Home') : undefined}
      className={`inline-flex items-center space-x-2.5 select-none ${
        clickable ? 'cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-500/40 rounded-xl p-0.5' : ''
      } ${className}`}
    >
      {/* Brand Icon Badge */}
      <div
        className={`${iconDimensions} rounded-xl relative flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 ${
          clickable ? 'group-hover:scale-105' : ''
        }`}
        style={{
          background: isLight
            ? 'linear-gradient(135deg, #1E3A8A 0%, #172554 100%)'
            : 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          border: isLight ? '1px solid rgba(30, 58, 138, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: isLight
            ? '0 4px 12px -2px rgba(30, 58, 138, 0.25)'
            : '0 4px 14px -2px rgba(15, 23, 42, 0.6), 0 0 10px rgba(59, 130, 246, 0.15)',
        }}
      >
        {/* Subtle interior glow */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 25%, rgba(96, 165, 250, 0.35) 0%, transparent 70%)',
          }}
        />

        {/* Vector SVG Icon combining Indian Rupee (₹) & Intelligent AI Circuit node */}
        <svg
          width={svgDimensions}
          height={svgDimensions}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          {/* Top Rupee Crossbar 1 */}
          <path
            d="M8 8.5H23"
            stroke="#93C5FD"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Top Rupee Crossbar 2 */}
          <path
            d="M8 13.5H19"
            stroke="#60A5FA"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Rupee Upper Curve */}
          <path
            d="M13.5 13.5C18 13.5 19.5 11 19.5 8.5"
            stroke="#60A5FA"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Rupee Stem */}
          <path
            d="M13.5 8.5V17"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Rupee Diagonal Leg extending into dynamic growth trajectory */}
          <path
            d="M13 16.5L22 25"
            stroke="#22C55E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* AI Sparkle / Neural Node at upper right */}
          <circle cx="23" cy="8.5" r="2" fill="#22C55E" />
          <circle cx="22" cy="25" r="2.2" fill="#4ADE80" />
        </svg>
      </div>

      {/* Wordmark and AI Tag */}
      <div className="flex flex-col text-left leading-none">
        <div className="flex items-center space-x-1.5">
          <span
            className={`font-bold tracking-tight transition-colors ${textSizes}`}
            style={{
              color: isLight ? '#0F172A' : '#F8FAFC',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            BillMind
          </span>

          {showAiBadge && (
            <span
              className={`font-bold rounded tracking-wide uppercase transition-colors ${badgeSizes}`}
              style={{
                backgroundColor: isLight ? 'rgba(37, 99, 235, 0.1)' : 'rgba(59, 130, 246, 0.2)',
                color: isLight ? '#1D4ED8' : '#93C5FD',
                border: isLight
                  ? '1px solid rgba(37, 99, 235, 0.25)'
                  : '1px solid rgba(96, 165, 250, 0.35)',
              }}
            >
              AI
            </span>
          )}
        </div>

        {showSubtitle && (
          <p
            className={`text-[10px] tracking-wide mt-1 transition-colors ${
              size === 'sm' ? 'hidden' : 'hidden sm:block'
            }`}
            style={{
              color: isLight ? '#64748B' : '#94A3B8',
            }}
          >
            Smart Indian Business Invoicing
          </p>
        )}
      </div>
    </div>
  );
};
