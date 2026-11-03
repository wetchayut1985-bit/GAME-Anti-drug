import React, { useState, useEffect } from 'react';
import { MessageSquareWarning, ShieldAlert, CheckCircle, ArrowRight, Sparkles, UserCheck, HeartHandshake } from 'lucide-react';
import { REFUSAL_SCENARIOS, RefusalScenario } from '../data/gameContent';
import { sound } from '../utils/audio';

interface StageThreeRefusalProps {
  onComplete: (score: number, stars: number) => void;
  onUpdateScore: (points: number) => void;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  hasKongphopPerk?: boolean;
}

export const StageThreeRefusal: React.FC<StageThreeRefusalProps> = ({
  onComplete,
  onUpdateScore,
  setTimeLeft,
  hasKongphopPerk = false,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [confidence, setConfidence] = useState(60);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isStepSubmitted, setIsStepSubmitted] = useState(false);
  const [stageScore, setStageScore] = useState(0);
  const [totalEffectiveChoices, setTotalEffectiveChoices] = useState(0);
  const [stageTimer, setStageTimer] = useState(60);

  const scenario: RefusalScenario = REFUSAL_SCENARIOS[scenarioIndex];
  const currentStep = scenario.steps[stepIndex];

  // Timer
  useEffect(() => {
    setTimeLeft(stageTimer);
    const timer = setInterval(() => {
      setStageTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishStage(totalEffectiveChoices, stageScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [totalEffectiveChoices, stageScore]);

  const handleSelectChoice = (idx: number) => {
    if (isStepSubmitted) return;
    sound.playClick();
    setSelectedChoiceIdx(idx);
    setIsStepSubmitted(true);

    const choice = currentStep.choices[idx];
    if (choice.isEffective) {
      sound.playHeroPower();
      const points = 10;
      setStageScore((prev) => prev + points);
      setTotalEffectiveChoices((prev) => prev + 1);
      setConfidence((prev) => Math.min(100, prev + choice.confidenceDelta));
      onUpdateScore(points);
    } else {
      sound.playWrong();
      setConfidence((prev) => Math.max(10, prev + choice.confidenceDelta));
    }
  };

  const handleNextStep = () => {
    sound.playClick();
    setSelectedChoiceIdx(null);
    setIsStepSubmitted(false);

    if (stepIndex + 1 < scenario.steps.length) {
      setStepIndex((prev) => prev + 1);
    } else if (scenarioIndex + 1 < REFUSAL_SCENARIOS.length) {
      setScenarioIndex((prev) => prev + 1);
      setStepIndex(0);
      setConfidence(60);
    } else {
      finishStage(totalEffectiveChoices, stageScore);
    }
  };

  const finishStage = (effective: number, score: number) => {
    let stars = 1;
    // Total steps across all scenarios = 3 + 3 = 6
    if (effective >= 5) stars = 3;
    else if (effective >= 3) stars = 2;
    onComplete(score, stars);
  };

  const choiceResult = selectedChoiceIdx !== null ? currentStep.choices[selectedChoiceIdx] : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 font-bold">
              <MessageSquareWarning className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                ด่านที่ 3: ฝึกทักษะการปฏิเสธเมื่อถูกชวน
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                สถานการณ์ที่ {scenarioIndex + 1}/{REFUSAL_SCENARIOS.length} · {currentStep.stepTitle}
              </p>
            </div>
          </div>

          {/* Confidence / Safety Meter */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              พลังความมั่นใจ & ความปลอดภัย:
            </span>
            <div className="w-24 sm:w-32 bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  confidence >= 70
                    ? 'bg-emerald-500'
                    : confidence >= 40
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs font-display font-bold tabular-nums text-slate-900 dark:text-white">
              {confidence}%
            </span>
          </div>
        </div>

        {hasKongphopPerk && (
          <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 mt-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
            <span>พลังพิเศษก้องภพ: มองหาคำตอบที่ "สบตา ไม่ลังเล เสนอทางเลือกใหม่" เพื่อคะแนนสูงสุด!</span>
          </div>
        )}
      </div>

      {/* Opponent Dialogue Bubble & Situation */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-amber-200/50 dark:border-slate-700 shadow-md">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
          📍 บริบทเหตุการณ์:
        </div>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium mb-4">
          {scenario.situation}
        </p>

        {/* Speech Bubble */}
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start gap-3 relative">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-0.5">
              {scenario.opponent} พูดว่า:
            </div>
            <div className="text-base sm:text-lg font-heading font-semibold text-slate-900 dark:text-slate-100 italic">
              {scenario.opponentQuote}
            </div>
          </div>
        </div>
      </div>

      {/* Step Prompt & Choices */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
          <UserCheck className="w-4 h-4" />
          <span>{currentStep.stepPrompt}</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentStep.choices.map((choice, idx) => {
            const isSelected = selectedChoiceIdx === idx;

            let btnClass =
              'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-600';

            if (isStepSubmitted) {
              if (choice.isEffective) {
                btnClass =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/30';
              } else if (isSelected && !choice.isEffective) {
                btnClass =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/30';
              } else {
                btnClass = 'opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                disabled={isStepSubmitted}
                onClick={() => handleSelectChoice(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base transition-all flex items-start gap-3 cursor-pointer ${btnClass}`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1 font-medium">{choice.text}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {isStepSubmitted && choiceResult && (
          <div
            className={`p-4 rounded-xl border mt-2 transition-all ${
              choiceResult.isEffective
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {choiceResult.isEffective ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div
                  className={`text-sm font-heading font-bold ${
                    choiceResult.isEffective
                      ? 'text-emerald-900 dark:text-emerald-300'
                      : 'text-amber-900 dark:text-amber-300'
                  }`}
                >
                  {choiceResult.isEffective
                    ? 'การปฏิเสธที่ยอดเยี่ยม! (+10 คะแนน)'
                    : 'ทบทวนกลยุทธ์ฮีโร่'}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {choiceResult.feedback}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-semibold text-sm flex items-center gap-2 shadow-md transition-all hover:translate-x-0.5 cursor-pointer"
              >
                <span>ขั้นตอนถัดไป</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3-Step Refusal Skill Badge Footer */}
      <div className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-around gap-2 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
          <HeartHandshake className="w-4 h-4 text-emerald-500" /> สูตร 3 สเต็ปฮีโร่:
        </span>
        <span className={stepIndex === 0 ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}>
          1. ปฏิเสธหนักแน่นสบตา
        </span>
        <span>→</span>
        <span className={stepIndex === 1 ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}>
          2. ให้เหตุผลหรือบอกผลกระทบ
        </span>
        <span>→</span>
        <span className={stepIndex === 2 ? 'font-bold text-indigo-600 dark:text-indigo-400' : ''}>
          3. ชวนทำสิ่งอื่นหรือเดินผละออก
        </span>
      </div>
    </div>
  );
};
