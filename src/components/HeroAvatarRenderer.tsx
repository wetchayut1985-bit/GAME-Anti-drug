import React from 'react';
import { Star, Glasses, Award, Headphones, Sparkles } from 'lucide-react';
import { CharacterCustomization, CAPE_COLORS } from '../data/characterCustomization';
import { ASSET_IMAGES } from '../assets/assetPaths';

interface HeroAvatarRendererProps {
  customization: CharacterCustomization;
  size?: 'sm' | 'md' | 'lg' | 'floating';
  customUrl?: string | null;
  speechText?: string | null;
  className?: string;
}

export const HeroAvatarRenderer: React.FC<HeroAvatarRendererProps> = ({
  customization,
  size = 'md',
  customUrl = null,
  speechText = null,
  className = '',
}) => {
  const currentCape = CAPE_COLORS.find((c) => c.id === customization.capeColor) || CAPE_COLORS[0];

  const baseImage =
    customUrl ||
    (customization.gender === 'boy' ? ASSET_IMAGES.avatarBoy : ASSET_IMAGES.avatarGirl);

  // Size configurations
  let containerDimensions = 'w-16 h-16';
  let speechPosition = '-top-10 -right-2';

  if (size === 'sm') {
    containerDimensions = 'w-9 h-9';
  } else if (size === 'md') {
    containerDimensions = 'w-20 h-20';
  } else if (size === 'lg') {
    containerDimensions = 'w-48 h-48 sm:w-56 sm:h-56';
  } else if (size === 'floating') {
    containerDimensions = 'w-28 h-28 sm:w-36 sm:h-36';
    speechPosition = '-top-12 -left-4 sm:-left-8';
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Dynamic Animated Speech Bubble */}
      {speechText && (
        <div
          className={`absolute ${speechPosition} z-20 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white px-3 py-1.5 rounded-2xl shadow-xl border-2 border-amber-400 text-xs sm:text-sm font-heading font-bold whitespace-nowrap animate-in fade-in zoom-in-90 duration-200 pointer-events-none flex items-center gap-1.5`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{speechText}</span>
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white dark:bg-slate-900 border-r-2 border-b-2 border-amber-400 transform rotate-45" />
        </div>
      )}

      {/* Cape Aura & Ring Glow */}
      <div
        className={`absolute inset-0 rounded-3xl ${currentCape.bg} opacity-20 blur-xl animate-aura pointer-events-none`}
      />

      {/* Main Avatar Container */}
      <div
        className={`relative ${containerDimensions} rounded-3xl overflow-hidden border-3 ${currentCape.ring} shadow-xl ${
          size === 'floating' ? 'animate-hero-float' : ''
        } bg-slate-900 transition-all duration-300`}
      >
        {/* Base Character Illustration */}
        <img
          src={baseImage}
          alt={customization.nickname}
          className="w-full h-full object-cover select-none"
        />

        {/* Dynamic Cape Color Corner Ribbon */}
        <div
          className={`absolute top-0 right-0 w-8 h-8 sm:w-10 sm:h-10 ${currentCape.bg} shadow-md flex items-center justify-center transform rotate-45 translate-x-3 -translate-y-3 sm:translate-x-4 sm:-translate-y-4`}
        >
          <Sparkles className="w-3 h-3 text-white transform -rotate-45" />
        </div>

        {/* Accessory Overlay Badges */}
        {customization.accessory === 'glasses' && (
          <div className="absolute top-2 left-2 bg-blue-600/90 text-white p-1 rounded-lg shadow-md border border-blue-300">
            <Glasses className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        )}

        {customization.accessory === 'star_pin' && (
          <div className="absolute top-2 left-2 bg-amber-500/90 text-slate-950 p-1 rounded-lg shadow-md border border-amber-300">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-slate-950" />
          </div>
        )}

        {customization.accessory === 'armband' && (
          <div className="absolute top-2 left-2 bg-rose-600/90 text-white p-1 rounded-lg shadow-md border border-rose-300">
            <Award className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        )}

        {customization.accessory === 'headphones' && (
          <div className="absolute top-2 left-2 bg-purple-600/90 text-white p-1 rounded-lg shadow-md border border-purple-300">
            <Headphones className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        )}

        {/* Bottom Hero Tag */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent py-1 px-2 text-center">
          <span className="text-[10px] sm:text-xs font-heading font-bold text-amber-300 truncate block drop-shadow">
            {customization.nickname}
          </span>
        </div>
      </div>
    </div>
  );
};
