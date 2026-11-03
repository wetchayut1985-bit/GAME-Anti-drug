import React, { useState, useEffect } from 'react';
import { HeartHandshake, CheckCircle2, MapPin, Building2, Trees, Radio, Music, Sparkles, Award } from 'lucide-react';
import { COMMUNITY_HOTSPOTS, CommunityHotspot } from '../data/gameContent';
import { ASSET_IMAGES } from '../assets/assetPaths';
import { sound } from '../utils/audio';

interface StageFiveCommunityProps {
  onComplete: (score: number, stars: number) => void;
  onUpdateScore: (points: number) => void;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  hasMintPerk?: boolean;
}

export const StageFiveCommunity: React.FC<StageFiveCommunityProps> = ({
  onComplete,
  onUpdateScore,
  setTimeLeft,
  hasMintPerk = false,
}) => {
  const [activeSpotId, setActiveSpotId] = useState<number>(1);
  const [completedSpots, setCompletedSpots] = useState<number[]>([]);
  const [stageScore, setStageScore] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [stageTimer, setStageTimer] = useState(80);

  // Timer
  useEffect(() => {
    setTimeLeft(stageTimer);
    const timer = setInterval(() => {
      setStageTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishStage(completedSpots.length, stageScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [completedSpots.length, stageScore]);

  const currentSpot: CommunityHotspot =
    COMMUNITY_HOTSPOTS.find((s) => s.id === activeSpotId) || COMMUNITY_HOTSPOTS[0];

  const handleSelectAction = (idx: number) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedChoiceIdx(idx);
    setIsAnswered(true);

    const choice = currentSpot.actionChoices[idx];
    if (choice.isCorrect) {
      sound.playHeroPower();
      const points = choice.points + (hasMintPerk ? 5 : 0);
      setStageScore((prev) => prev + points);
      onUpdateScore(points);
      setCompletedSpots((prev) => (prev.includes(currentSpot.id) ? prev : [...prev, currentSpot.id]));
    } else {
      sound.playWrong();
    }
  };

  const handleNextSpot = () => {
    sound.playClick();
    setSelectedChoiceIdx(null);
    setIsAnswered(false);

    // Find next uncompleted spot
    const remaining = COMMUNITY_HOTSPOTS.filter((s) => !completedSpots.includes(s.id) && s.id !== currentSpot.id);
    if (remaining.length > 0) {
      setActiveSpotId(remaining[0].id);
    } else {
      // All completed!
      finishStage(completedSpots.length + 1, stageScore);
    }
  };

  const finishStage = (completedCount: number, score: number) => {
    let stars = 1;
    if (completedCount >= 4) stars = 3;
    else if (completedCount >= 2) stars = 2;
    onComplete(score, stars);
  };

  const chosenChoice = selectedChoiceIdx !== null ? currentSpot.actionChoices[selectedChoiceIdx] : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 font-bold">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                ด่านที่ 5: ภารกิจสร้างชุมชนปลอดยาเสพติด
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ฟื้นฟู 4 พื้นที่สำคัญในชุมชน ({completedSpots.length}/4 พื้นที่สำเร็จ)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>พลังชุมชนเข้มแข็ง {completedSpots.length * 25}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(completedSpots.length / COMMUNITY_HOTSPOTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Community Map Interactive Grid */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-900">
        <img
          src={ASSET_IMAGES.parkScene}
          alt="Community Map"
          className="w-full h-48 sm:h-64 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-4 sm:p-6 flex flex-col justify-end">
          <div className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>แผนที่ภารกิจชุมชนฮีโร่ (เลือกจุดที่ต้องการลงมือทำ)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {COMMUNITY_HOTSPOTS.map((spot) => {
              const isCompleted = completedSpots.includes(spot.id);
              const isActive = spot.id === activeSpotId;

              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveSpotId(spot.id);
                    setSelectedChoiceIdx(null);
                    setIsAnswered(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-102 ring-2 ring-white/50'
                      : isCompleted
                      ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/50'
                      : 'bg-slate-900/80 text-slate-200 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{spot.zone}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] leading-tight line-clamp-1">{spot.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Hotspot Mission Details */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-5">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 mb-1">
            <Building2 className="w-4 h-4" />
            <span>ภารกิจ ณ: {currentSpot.name}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
            ⚠️ ปัญหาที่พบ: {currentSpot.problem}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            🎯 เป้าหมายฮีโร่: {currentSpot.mission}
          </p>
        </div>

        {/* Action Choices */}
        <div className="grid grid-cols-1 gap-3.5">
          {currentSpot.actionChoices.map((choice, idx) => {
            const isSelected = selectedChoiceIdx === idx;

            let btnStyle =
              'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-600';

            if (isAnswered) {
              if (choice.isCorrect) {
                btnStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
              } else if (isSelected && !choice.isCorrect) {
                btnStyle =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
              } else {
                btnStyle = 'opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectAction(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border text-sm sm:text-base transition-all flex items-start gap-3.5 cursor-pointer ${btnStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-xs mt-0.5 ${
                    isSelected
                      ? choice.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                      : 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 font-medium leading-relaxed">{choice.title}</div>
              </button>
            );
          })}
        </div>

        {/* Action Feedback */}
        {isAnswered && chosenChoice && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all animate-in fade-in duration-300 ${
              chosenChoice.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {chosenChoice.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div
                  className={`text-sm font-heading font-bold ${
                    chosenChoice.isCorrect
                      ? 'text-emerald-900 dark:text-emerald-200'
                      : 'text-rose-900 dark:text-rose-200'
                  }`}
                >
                  {chosenChoice.isCorrect
                    ? 'ภารกิจสำเร็จ! ชุมชนปลอดภัยขึ้น (+25 คะแนน)'
                    : 'ยังไม่ใช่การแก้ปัญหาที่ปลอดภัย'}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {chosenChoice.impact}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNextSpot}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-heading font-semibold text-sm flex items-center gap-2 shadow-lg shadow-teal-600/30 transition-all hover:translate-x-0.5 cursor-pointer"
              >
                <span>
                  {completedSpots.length >= 4 ? 'ดูผลการปฏิบัติภารกิจทั้งหมด!' : 'ไปพื้นที่ถัดไป'}
                </span>
                <Award className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
