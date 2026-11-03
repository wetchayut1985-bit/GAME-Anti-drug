import React from 'react';
import { Volume2, VolumeX, Home, Award, Star, Clock, ShoppingBag, User, Coins } from 'lucide-react';
import { Character, STAGES } from '../data/gameContent';
import { UserProfile } from '../utils/userProfileStorage';
import { ASSET_IMAGES } from '../assets/assetPaths';

interface StageNavHeaderProps {
  character: Character;
  profile: UserProfile;
  currentStageId: number;
  score: number;
  stars: number[];
  timeLeft: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onExitToMenu: () => void;
  onOpenMentor: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
}

export const StageNavHeader: React.FC<StageNavHeaderProps> = ({
  character,
  profile,
  currentStageId,
  score,
  stars,
  timeLeft,
  isMuted,
  onToggleMute,
  onExitToMenu,
  onOpenMentor,
  onOpenProfile,
  onOpenShop,
}) => {
  const currentStage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];
  const totalStars = stars.reduce((a, b) => a + b, 0);

  const renderAvatarThumb = () => {
    if (profile.avatarType === 'custom' && profile.customAvatarUrl) {
      return (
        <img
          src={profile.customAvatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      );
    }
    if (profile.avatarPreset === 'boy') {
      return (
        <img
          src={ASSET_IMAGES.avatarBoy}
          alt="Avatar Boy"
          className="w-full h-full object-cover"
        />
      );
    }
    if (profile.avatarPreset === 'girl') {
      return (
        <img
          src={ASSET_IMAGES.avatarGirl}
          alt="Avatar Girl"
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <div className={`w-full h-full bg-gradient-to-tr ${character.color} flex items-center justify-center font-bold text-xs text-white`}>
        {profile.nickname.charAt(0) || character.nickname.charAt(0)}
      </div>
    );
  };

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 px-3 sm:px-4 py-2.5 sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Home + Character/Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onExitToMenu}
            title="กลับสู่หน้าหลัก"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Clickable Profile Badge */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-all cursor-pointer text-left"
            title="ดูและแก้ไขโปรไฟล์นักเรียนฮีโร่"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-400/50 shrink-0 bg-slate-700">
              {renderAvatarThumb()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold leading-tight flex items-center gap-1">
                <span className="truncate max-w-[100px]">{profile.nickname || character.name}</span>
              </div>
              <div className="text-[10px] text-amber-300 truncate max-w-[100px]">
                {profile.school || character.role.split(' ')[0]}
              </div>
            </div>
          </button>
        </div>

        {/* Center: Stage Progress Tracker */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {STAGES.map((s) => {
            const isCompleted = s.id < currentStageId;
            const isCurrent = s.id === currentStageId;
            const stageStars = stars[s.id - 1] || 0;

            return (
              <div
                key={s.id}
                className={`flex flex-col items-center transition-all ${
                  isCurrent ? 'scale-110 font-bold' : 'opacity-80'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-display font-bold border ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30'
                      : isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {s.id}
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3].map((starNum) => (
                    <span
                      key={starNum}
                      className={`text-[8px] leading-none ${
                        starNum <= stageStars ? 'text-amber-400' : 'text-slate-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Coins, Shop, Timer, Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Shop Button with Coins */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="ร้านค้าฮีโร่"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="tabular-nums font-display">{profile.heroCoins}</span>
          </button>

          {/* Timer */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1.5 rounded-xl border border-slate-700/80 text-xs font-display font-semibold">
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-sky-400'}`} />
            <span className={`tabular-nums ${timeLeft <= 10 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
              {timeLeft}s
            </span>
          </div>

          {/* Stars */}
          <div className="hidden md:flex items-center gap-1 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20 text-xs font-display font-semibold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{totalStars}/15</span>
          </div>

          {/* AI Mentor Button */}
          <button
            onClick={onOpenMentor}
            className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium items-center gap-1 transition-colors cursor-pointer shadow-sm"
            title="ปรึกษาพี่ฮีโร่"
          >
            <span>💬 พี่ฮีโร่</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
