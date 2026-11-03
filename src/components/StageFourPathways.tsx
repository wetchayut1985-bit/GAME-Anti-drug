import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, CheckCircle2, AlertOctagon, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { LIFE_EVENTS, LifeEvent } from '../data/gameContent';
import { sound } from '../utils/audio';

interface StageFourPathwaysProps {
  onComplete: (score: number, stars: number) => void;
  onUpdateScore: (points: number) => void;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

export const StageFourPathways: React.FC<StageFourPathwaysProps> = ({
  onComplete,
  onUpdateScore,
  setTimeLeft,
}) => {
  const [eventIndex, setEventIndex] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isDecided, setIsDecided] = useState(false);
  const [stageScore, setStageScore] = useState(0);
  const [heroChoicesCount, setHeroChoicesCount] = useState(0);
  const [lifePower, setLifePower] = useState(70);
  const [stageTimer, setStageTimer] = useState(60);

  const currentEvent: LifeEvent = LIFE_EVENTS[eventIndex];

  // Timer
  useEffect(() => {
    setTimeLeft(stageTimer);
    const timer = setInterval(() => {
      setStageTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishStage(heroChoicesCount, stageScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [heroChoicesCount, stageScore]);

  const handleChoose = (idx: number) => {
    if (isDecided) return;
    sound.playClick();
    setSelectedOptionIdx(idx);
    setIsDecided(true);

    const chosen = currentEvent.options[idx];
    if (chosen.isHeroPath) {
      sound.playCorrect();
      setStageScore((prev) => prev + chosen.points);
      setHeroChoicesCount((prev) => prev + 1);
      setLifePower((prev) => Math.min(100, prev + 15));
      onUpdateScore(chosen.points);
    } else {
      sound.playWrong();
      setLifePower((prev) => Math.max(20, prev - 25));
    }
  };

  const handleNextEvent = () => {
    sound.playClick();
    setSelectedOptionIdx(null);
    setIsDecided(false);

    if (eventIndex + 1 < LIFE_EVENTS.length) {
      setEventIndex((prev) => prev + 1);
    } else {
      finishStage(heroChoicesCount, stageScore);
    }
  };

  const finishStage = (count: number, score: number) => {
    let stars = 1;
    if (count >= 4) stars = 3;
    else if (count >= 2) stars = 2;
    onComplete(score, stars);
  };

  const chosenOutcome = selectedOptionIdx !== null ? currentEvent.options[selectedOptionIdx] : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-bold">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                ด่านที่ 4: ทางแยกชีวิต ห่างไกลยาเสพติด
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                จุดตัดชีวิตที่ {eventIndex + 1} จาก {LIFE_EVENTS.length} สถานการณ์
              </p>
            </div>
          </div>

          {/* Life Power Gauge */}
          <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              พลังชีวิตฮีโร่:
            </span>
            <div className="w-24 sm:w-28 bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${lifePower}%` }}
              />
            </div>
            <span className="text-xs font-display font-bold tabular-nums text-slate-900 dark:text-white">
              {lifePower}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((eventIndex + 1) / LIFE_EVENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Life Crossroads Situation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>สถานการณ์ทางแยกชีวิต</span>
          </div>
          <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white leading-snug">
            {currentEvent.situation}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {currentEvent.context}
          </p>
        </div>

        {/* Decision Pathways */}
        <div className="grid grid-cols-1 gap-4">
          {currentEvent.options.map((opt, idx) => {
            const isSelected = selectedOptionIdx === idx;

            let cardStyle =
              'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-600';

            if (isDecided) {
              if (opt.isHeroPath) {
                cardStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
              } else if (isSelected && !opt.isHeroPath) {
                cardStyle =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
              } else {
                cardStyle = 'opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                disabled={isDecided}
                onClick={() => handleChoose(idx)}
                className={`w-full text-left p-5 rounded-2xl border text-sm sm:text-base transition-all flex items-start gap-4 cursor-pointer ${cardStyle}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-sm ${
                    isSelected
                      ? opt.isHeroPath
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold leading-relaxed">{opt.text}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Outcome Card */}
        {isDecided && chosenOutcome && (
          <div
            className={`p-5 rounded-2xl border transition-all animate-in fade-in duration-300 ${
              chosenOutcome.isHeroPath
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {chosenOutcome.isHeroPath ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4
                    className={`text-base font-heading font-bold ${
                      chosenOutcome.isHeroPath
                        ? 'text-emerald-900 dark:text-emerald-200'
                        : 'text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    {chosenOutcome.outcomeTitle}
                  </h4>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      chosenOutcome.isHeroPath
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                    }`}
                  >
                    {chosenOutcome.statBoost}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {chosenOutcome.outcomeDetail}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNextEvent}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-heading font-semibold text-sm flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:translate-x-0.5 cursor-pointer"
              >
                <span>{eventIndex + 1 < LIFE_EVENTS.length ? 'ทางแยกถัดไป' : 'สรุปผลด่านที่ 4'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
