import React from 'react';
import { Volume2, VolumeX, Home, Award, Star, Clock } from 'lucide-react';
import { Character, STAGES } from '../data/gameContent';

interface StageNavHeaderProps {
  character: Character;
  currentStageId: number;
  score: number;
  stars: number[];
  timeLeft: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onExitToMenu: () => void;
  onOpenMentor: () => void;
}

export const StageNavHeader: React.FC<StageNavHeaderProps> = ({
  character,
  currentStageId,
  score,
  stars,
  timeLeft,
  isMuted,
  onToggleMute,
  onExitToMenu,
  onOpenMentor,
}) => {
  const currentStage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];
  const totalStars = stars.reduce((a, b) => a + b, 0);

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 px-4 py-2.5 sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Character Info & Exit */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitToMenu}
            title="กลับสู่หน้าหลัก"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${character.color} flex items-center justify-center font-heading font-bold text-sm shadow-md ring-2 ring-white/20`}>
              {character.nickname.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold leading-tight flex items-center gap-1.5">
                <span>{character.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {character.role.split(' ')[0]}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                ด่าน {currentStageId}/5: {currentStage.subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Stage Progress Tracker */}
        <div className="flex items-center gap-1.5">
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
                {/* Mini star indicator */}
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

        {/* Right: Metrics & Actions */}
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs font-display font-semibold">
            <Clock className={`w-3.5 h-3.5 ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-sky-400'}`} />
            <span className={`tabular-nums ${timeLeft <= 10 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
              {timeLeft}s
            </span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-xs font-display font-semibold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{totalStars}/15</span>
          </div>

          {/* Score */}
          <div className="hidden md:flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 text-xs font-display font-semibold text-emerald-300">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tabular-nums">{score} คะแนน</span>
          </div>

          {/* AI Mentor Button */}
          <button
            onClick={onOpenMentor}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-sm shadow-indigo-600/30"
            title="ปรึกษาพี่ฮีโร่"
          >
            <span>💬 พี่ฮีโร่</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
