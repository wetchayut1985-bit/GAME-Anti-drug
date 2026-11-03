import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, ArrowLeft, ArrowRight, Check, X, Sparkles, Layers } from 'lucide-react';
import { BEHAVIOR_ITEMS, BehaviorItem } from '../data/gameContent';
import { sound } from '../utils/audio';

interface StageTwoSortingProps {
  onComplete: (score: number, stars: number) => void;
  onUpdateScore: (points: number) => void;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

export const StageTwoSorting: React.FC<StageTwoSortingProps> = ({
  onComplete,
  onUpdateScore,
  setTimeLeft,
}) => {
  const [items] = useState<BehaviorItem[]>(BEHAVIOR_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [stageScore, setStageScore] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{
    isCorrect: boolean;
    item: BehaviorItem;
    chosen: 'safe' | 'risk';
  } | null>(null);
  const [streak, setStreak] = useState(0);
  const [timeLeftLocal, setTimeLeftLocal] = useState(60);

  // Sync timer
  useEffect(() => {
    setTimeLeft(timeLeftLocal);
    const timer = setInterval(() => {
      setTimeLeftLocal((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishStage(correctCount, stageScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [correctCount, stageScore]);

  // Keyboard shortcut listener (Left Arrow = Safe, Right Arrow = Risk)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex >= items.length) return;
      if (e.key === 'ArrowLeft') {
        handleCategorize('safe');
      } else if (e.key === 'ArrowRight') {
        handleCategorize('risk');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items]);

  const handleCategorize = (chosen: 'safe' | 'risk') => {
    if (currentIndex >= items.length) return;
    const currentItem = items[currentIndex];
    const isCorrect = chosen === currentItem.category;

    if (isCorrect) {
      sound.playCorrect();
      const streakBonus = streak * 2;
      const earned = 10 + streakBonus;
      setStageScore((prev) => prev + earned);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      onUpdateScore(earned);
    } else {
      sound.playWrong();
      setStreak(0);
    }

    setLastFeedback({
      isCorrect,
      item: currentItem,
      chosen,
    });

    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);

    if (nextIdx >= items.length) {
      finishStage(isCorrect ? correctCount + 1 : correctCount, isCorrect ? stageScore + 10 : stageScore);
    }
  };

  const finishStage = (finalCorrect: number, finalScore: number) => {
    let stars = 1;
    if (finalCorrect >= 7) stars = 3;
    else if (finalCorrect >= 5) stars = 2;
    onComplete(finalScore, stars);
  };

  const currentItem = items[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                ด่านที่ 2: แยกแยะพฤติกรรมเสี่ยงและเหมาะสม
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                สถานการณ์ที่ {Math.min(currentIndex + 1, items.length)} จาก {items.length} รายการ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {streak > 1 && (
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                <Sparkles className="w-3.5 h-3.5" />
                คอมโบ {streak}x!
              </span>
            )}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              ถูกต้อง {correctCount}/{items.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Sorting Arena */}
      {currentItem ? (
        <div className="flex flex-col gap-6">
          {/* Active Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border-2 border-slate-200 dark:border-slate-800 text-center relative overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" />
              <span>พิจารณาสถานการณ์นี้แล้วเลือกหมวดหมู่</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 dark:text-white mb-3">
              "{currentItem.title}"
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-2">
              {currentItem.description}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              ใช้ปุ่มกดด้านล่าง หรือกดลูกศรคีย์บอร์ด ⬅️ หรือ ➡️
            </p>
          </div>

          {/* Action Choice Buttons (Safe vs Risk) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Safe Button */}
            <button
              onClick={() => handleCategorize('safe')}
              className="p-5 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border-2 border-emerald-500/50 hover:border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-base sm:text-lg font-heading font-bold">
                พฤติกรรมเหมาะสม & ปลอดภัย
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> หรือกดลูกศรซ้าย
              </span>
            </button>

            {/* Risk Button */}
            <button
              onClick={() => handleCategorize('risk')}
              className="p-5 sm:p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border-2 border-rose-500/50 hover:border-rose-500 text-rose-900 dark:text-rose-100 shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="text-base sm:text-lg font-heading font-bold">
                พฤติกรรมเสี่ยงอันตราย
              </span>
              <span className="text-xs text-rose-700 dark:text-rose-300 flex items-center gap-1">
                หรือกดลูกศรขวา <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Immediate Educational Feedback of Last Item */}
      {lastFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all animate-in fade-in duration-200 ${
            lastFeedback.isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
          }`}
        >
          <div
            className={`p-2 rounded-lg text-white shrink-0 ${
              lastFeedback.isCorrect ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          >
            {lastFeedback.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </div>
          <div className="text-xs sm:text-sm space-y-1">
            <div className="font-heading font-bold text-slate-900 dark:text-white">
              {lastFeedback.isCorrect
                ? 'ถูกต้อง! คุณแยกแยะได้แม่นยำ (+10 คะแนน)'
                : 'ข้อควรระวัง: คำตอบที่ถูกต้องคือ ' +
                  (lastFeedback.item.category === 'safe'
                    ? 'พฤติกรรมเหมาะสม & ปลอดภัย'
                    : 'พฤติกรรมเสี่ยงอันตราย')}
            </div>
            <p className="text-slate-600 dark:text-slate-300">{lastFeedback.item.tip}</p>
          </div>
        </div>
      )}
    </div>
  );
};
