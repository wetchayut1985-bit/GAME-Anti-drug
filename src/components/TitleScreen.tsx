import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Shield, Sparkles, HelpCircle, Star, Users, Check, BookOpen, User, ShoppingBag, Coins, Wand2, Dices } from 'lucide-react';
import { CHARACTERS, Character, STAGES } from '../data/gameContent';
import { CharacterCustomization } from '../data/characterCustomization';
import { UserProfile } from '../utils/userProfileStorage';
import { AnimatedBackground } from './AnimatedBackground';
import { HeroAvatarRenderer } from './HeroAvatarRenderer';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  selectedCharacter: Character;
  customization: CharacterCustomization;
  profile: UserProfile;
  onSelectCharacter: (char: Character) => void;
  onStartGame: (playerName: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
  onOpenCustomizer: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedCharacter,
  customization,
  profile,
  onSelectCharacter,
  onStartGame,
  isMuted,
  onToggleMute,
  onOpenProfile,
  onOpenShop,
  onOpenCustomizer,
}) => {
  const [playerName, setPlayerName] = useState(customization.nickname || profile.nickname || '');
  const [showRules, setShowRules] = useState(false);

  const handleStart = () => {
    sound.playClick();
    sound.playHeroPower();
    sound.startBgm();
    onStartGame(playerName.trim() || customization.nickname || selectedCharacter.nickname);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      {/* Animated Moving Background with Parallax and Floating Particles */}
      <AnimatedBackground scene="mascots" />

      {/* Top Floating Controls */}
      <header className="relative z-10 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto w-full">
        {/* Campaign Badge */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs text-slate-300 shadow-md">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>โครงการเยาวชนไทย หัวใจสีขาว ปลอดยาเสพติด</span>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Customizer Button */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 backdrop-blur-md border border-purple-500/40 text-purple-200 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-102"
          >
            <Wand2 className="w-4 h-4 text-purple-400" />
            <span>ปรับแต่งตัวละคร</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <User className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">โปรไฟล์</span>
          </button>

          {/* Shop Button */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">{profile.heroCoins} เหรียญ</span>
          </button>

          {/* Rules Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowRules(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">กติกา</span>
          </button>

          {/* Audio Mute Button */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Hero Title & Centerpiece */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-2 w-full flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold mb-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>เกมออนไลน์ 2 มิติ เพื่อรณรงค์ต่อต้านยาเสพติด</span>
        </div>

        {/* Title Lockup */}
        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-300 drop-shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
          ภารกิจพิชิตยาเสพติด
        </h1>
        <div className="text-lg sm:text-2xl font-display font-extrabold tracking-wider text-slate-300 mt-0.5 uppercase">
          Drug-Free Hero Adventure
        </div>

        {/* Interactive Floating Hero Preview & Customizer Trigger */}
        <div className="mt-4 mb-3 flex flex-col sm:flex-row items-center gap-4 bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl max-w-xl w-full">
          {/* Levitating Avatar */}
          <div className="shrink-0 flex items-center justify-center">
            <HeroAvatarRenderer
              customization={customization}
              customUrl={profile.customAvatarUrl}
              size="floating"
            />
          </div>

          <div className="text-left flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                ตัวละครที่คุณเลือก
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {customization.gender === 'boy' ? 'ฮีโร่ชาย 👦' : 'ฮีโร่หญิง 👧'}
              </span>
            </div>

            <div className="text-base sm:text-lg font-heading font-bold text-white">
              {customization.nickname || 'ฮีโร่ผู้พิทักษ์'}
            </div>

            <p className="text-xs text-slate-400">
              ผ้าคลุม: {customization.capeColor} · อุปกรณ์: {customization.accessory}
            </p>

            <button
              onClick={onOpenCustomizer}
              className="mt-2 py-1.5 px-3.5 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>ปรับแต่งเพศ เสื้อผ้า และหน้าตา</span>
            </button>
          </div>
        </div>

        {/* Start Game Form Card */}
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col gap-3">
          <div className="text-left flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-400">
              ชื่อที่จะปรากฏในเกมและเกียรติบัตร:
            </label>
            <span className="text-[11px] text-amber-400 font-semibold">
              เลเวล {Math.floor(profile.totalScoreEver / 100) + 1}
            </span>
          </div>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={`เช่น ${customization.nickname} (เว้นว่างได้)`}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <button
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 hover:from-amber-500 hover:via-emerald-500 hover:to-sky-500 text-slate-950 font-heading font-black text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all hover:scale-102 cursor-pointer active:scale-98"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>เริ่มภารกิจฮีโร่ (5 ด่าน)</span>
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 p-3 text-center text-xs text-slate-500">
        <span>© ๒๕๖๙ ภารกิจพิชิตยาเสพติด (Drug-Free Hero) · เพื่อการศึกษาและการรณรงค์ในโรงเรียน</span>
      </footer>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-800 shadow-2xl my-8 relative">
            <button
              onClick={() => setShowRules(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 text-amber-400 mb-2">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-heading font-bold text-white">
                กติกาและภารกิจทั้ง 5 ด่าน
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              ผู้เล่นจะต้องพิชิตทั้ง 5 ภารกิจเพื่อสะสมดาว เก็บเหรียญ และรับเหรียญฮีโร่ต้านยาเสพติด:
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-left flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 font-display font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {stage.id}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-200">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> สะสมได้สูงสุด 15 ดาว
              </span>
              <button
                onClick={() => setShowRules(false)}
                className="py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium cursor-pointer"
              >
                เข้าใจแล้ว พร้อมลุย!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
