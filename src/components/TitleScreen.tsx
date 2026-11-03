import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Shield, Sparkles, HelpCircle, Star, Users, Check, BookOpen, User, ShoppingBag, Coins, School } from 'lucide-react';
import { CHARACTERS, Character, STAGES } from '../data/gameContent';
import { UserProfile } from '../utils/userProfileStorage';
import { ASSET_IMAGES } from '../assets/assetPaths';
import { sound } from '../utils/audio';

interface TitleScreenProps {
  selectedCharacter: Character;
  profile: UserProfile;
  onSelectCharacter: (char: Character) => void;
  onStartGame: (playerName: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedCharacter,
  profile,
  onSelectCharacter,
  onStartGame,
  isMuted,
  onToggleMute,
  onOpenProfile,
  onOpenShop,
}) => {
  const [playerName, setPlayerName] = useState(profile.nickname || '');
  const [showRules, setShowRules] = useState(false);

  const handleStart = () => {
    sound.playClick();
    sound.playHeroPower();
    sound.startBgm();
    onStartGame(playerName.trim() || profile.nickname || selectedCharacter.nickname);
  };

  const renderProfileAvatar = () => {
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
      <div className={`w-full h-full bg-gradient-to-tr ${selectedCharacter.color} flex items-center justify-center font-bold text-xs text-white`}>
        {profile.nickname.charAt(0) || 'ฮ'}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      {/* Background Hero Mascot Illustration with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSET_IMAGES.heroMascots}
          alt="Drug-Free Heroes"
          className="w-full h-full object-cover object-top opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      </div>

      {/* Top Floating Controls */}
      <header className="relative z-10 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 max-w-6xl mx-auto w-full">
        {/* White School Campaign Badge */}
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs text-slate-300">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>โครงการเยาวชนไทย หัวใจสีขาว ปลอดยาเสพติด</span>
        </div>

        {/* Top Right Quick Actions: Profile, Shop, Rules, Audio */}
        <div className="flex items-center gap-2">
          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-amber-400">
              {renderProfileAvatar()}
            </div>
            <span>โปรไฟล์</span>
          </button>

          {/* Shop Button with Coins */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">{profile.heroCoins} เหรียญ</span>
          </button>

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
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-3 w-full flex flex-col items-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold mb-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>เกมออนไลน์ 2 มิติ เพื่อรณรงค์ต่อต้านยาเสพติด</span>
        </div>

        {/* Game Title Lockup */}
        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-sky-300 drop-shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
          ภารกิจพิชิตยาเสพติด
        </h1>
        <div className="text-xl sm:text-2xl font-display font-extrabold tracking-wider text-slate-300 mt-0.5 uppercase">
          Drug-Free Hero Adventure
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
          รับบทเป็นฮีโร่ปกป้องเพื่อนและชุมชนจากยาเสพติด ฝึกทักษะการปฏิเสธอย่างมั่นใจ
          สะสมแต้มแลกซื้อไอเทมในร้านค้า และบันทึกบัตรประจำตัวฮีโร่
        </p>

        {/* Character Selection Carousel */}
        <div className="w-full mt-5 max-w-4xl">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span>เลือกตัวละครฮีโร่ของคุณ</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHARACTERS.map((char) => {
              const isSelected = char.id === selectedCharacter.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectCharacter(char);
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400 shadow-xl shadow-amber-400/20 scale-102 ring-2 ring-amber-400/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div>
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${char.color} flex items-center justify-center text-white font-heading font-extrabold text-xl shadow-md mb-2.5`}
                    >
                      {char.nickname.charAt(0)}
                    </div>
                    <div className="font-heading font-bold text-sm sm:text-base text-white">
                      {char.name}
                    </div>
                    <div className="text-[11px] text-amber-300 font-medium line-clamp-1">
                      {char.role}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                    <span className="font-semibold text-emerald-400">สกิล: </span>
                    {char.perk}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Player Name & Action Cluster */}
        <div className="mt-5 w-full max-w-md bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl flex flex-col gap-3">
          <div className="text-left flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              ชื่อฮีโร่ของคุณ (แก้ไขในโปรไฟล์ได้):
            </span>
            <button
              onClick={onOpenProfile}
              className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <User className="w-3 h-3" />
              <span>แก้ไขประวัติ</span>
            </button>
          </div>

          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={`เช่น ${profile.nickname || selectedCharacter.nickname} (เว้นว่างได้)`}
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
