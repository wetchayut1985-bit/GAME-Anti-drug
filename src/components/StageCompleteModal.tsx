import React, { useEffect } from 'react';
import { Star, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface StageCompleteModalProps {
  stageId: number;
  stageTitle: string;
  stageScore: number;
  stars: number;
  onNextStage: () => void;
}

export const StageCompleteModal: React.FC<StageCompleteModalProps> = ({
  stageId,
  stageTitle,
  stageScore,
  stars,
  onNextStage,
}) => {
  useEffect(() => {
    sound.playVictory();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-amber-400/40 text-center flex flex-col items-center gap-5 relative overflow-hidden">
        {/* Glow backdrop effect */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/30">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            ภารกิจสำเร็จ!
          </span>
          <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white mt-1">
            ผ่าน{stageTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            คุณตัดสินใจได้อย่างยอดเยี่ยม ช่วยปกป้องตนเองและเพื่อน ๆ
          </p>
        </div>

        {/* Stars Animation */}
        <div className="flex items-center gap-3 my-2">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= stars;
            return (
              <div
                key={starIdx}
                className={`transition-all transform ${
                  isEarned ? 'scale-110' : 'opacity-30 grayscale'
                }`}
              >
                <Star
                  className={`w-10 h-10 ${
                    isEarned
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                      : 'text-slate-400'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Score Earned */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">คะแนนในด่านนี้: </span>
          <span className="text-lg font-display font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            +{stageScore} คะแนน
          </span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNextStage();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-heading font-bold text-base shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
        >
          <span>ลุยด่านถัดไป!</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
