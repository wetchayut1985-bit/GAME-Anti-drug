import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, Sparkles, BookOpen, Glasses, Coins } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/gameContent';
import { sound } from '../utils/audio';

interface StageOneQuizProps {
  onComplete: (score: number, stars: number) => void;
  onUpdateScore: (points: number) => void;
  onEarnCoins?: (amount: number) => void;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  hasPerkExtraTime?: boolean;
  hasCutChoicePowerup?: boolean;
}

export const StageOneQuiz: React.FC<StageOneQuizProps> = ({
  onComplete,
  onUpdateScore,
  onEarnCoins,
  setTimeLeft,
  hasPerkExtraTime = false,
  hasCutChoicePowerup = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [stageScore, setStageScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [eliminatedOption, setEliminatedOption] = useState<number | null>(null);

  const initialTime = (hasPerkExtraTime ? 25 : 20) + (hasCutChoicePowerup ? 5 : 0);
  const [questionTimer, setQuestionTimer] = useState(initialTime);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  // If player has cut-choice powerup, eliminate one wrong option on question mount
  useEffect(() => {
    if (hasCutChoicePowerup) {
      const wrongOptions = [0, 1, 2, 3].filter((idx) => idx !== currentQ.correctIndex);
      const chosenWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setEliminatedOption(chosenWrong);
    } else {
      setEliminatedOption(null);
    }
  }, [currentIndex, hasCutChoicePowerup, currentQ.correctIndex]);

  // Sync global timer for HUD
  useEffect(() => {
    setTimeLeft(questionTimer);
  }, [questionTimer, setTimeLeft]);

  // Question countdown
  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOption(-1);
    sound.playWrong();
    setStreak(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || idx === eliminatedOption) return;
    sound.playClick();
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      sound.playCorrect();
      const speedBonus = Math.floor(questionTimer / 4);
      const streakBonus = streak * 2;
      const earned = 10 + speedBonus + streakBonus;

      setStageScore((prev) => prev + earned);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      onUpdateScore(earned);

      // Earn +5 coins per correct answer!
      if (onEarnCoins) {
        onEarnCoins(5);
      }
    } else {
      sound.playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setQuestionTimer(initialTime);
    } else {
      let stars = 1;
      if (correctCount >= 5) stars = 3;
      else if (correctCount >= 3) stars = 2;

      onComplete(stageScore, stars);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Top Banner / Question Progress */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
                ด่านที่ 1: คลังความรู้ต้านยาเสพติด
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                คำถามข้อที่ {currentIndex + 1} จาก {QUIZ_QUESTIONS.length} ข้อ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {hasCutChoicePowerup && (
              <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                <Glasses className="w-3.5 h-3.5" />
                <span>แว่นสแกนปัญญาทำงาน</span>
              </span>
            )}
            {streak > 1 && (
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                <Sparkles className="w-3.5 h-3.5" />
                คอมโบ {streak}x!
              </span>
            )}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              ถูกต้อง {correctCount}/{QUIZ_QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-display font-bold flex items-center justify-center text-sm shadow-md">
            Q{currentIndex + 1}
          </span>
          <h3 className="text-lg sm:text-xl font-heading font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;
            const isEliminated = idx === eliminatedOption;

            let btnStyle =
              'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700';

            if (isEliminated) {
              btnStyle =
                'opacity-30 bg-slate-100 dark:bg-slate-800/20 line-through text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed';
            } else if (isAnswered) {
              if (isCorrect) {
                btnStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
              } else if (isSelected && !isCorrect) {
                btnStyle =
                  'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30';
              } else {
                btnStyle = 'opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered || isEliminated}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isEliminated && (
                  <span className="text-[11px] text-blue-500 font-semibold shrink-0">
                    (ตัดชอยส์ผิดโดยแว่นสแกน)
                  </span>
                )}

                {isAnswered && (
                  <span className="shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    ) : null}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Fact Box */}
        {isAnswered && (
          <div
            className={`p-5 rounded-xl border transition-all ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 shadow-sm shrink-0 mt-0.5">
                <Lightbulb
                  className={`w-5 h-5 ${
                    selectedOption === currentQ.correctIndex ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4
                    className={`text-sm font-heading font-bold ${
                      selectedOption === currentQ.correctIndex
                        ? 'text-emerald-800 dark:text-emerald-300'
                        : 'text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {selectedOption === currentQ.correctIndex
                      ? 'ถูกต้องยอดเยี่ยม! (+10 คะแนน & +5 เหรียญทอง)'
                      : 'คำตอบที่ถูกต้องและข้อเท็จจริง'}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    เกร็ดฮีโร่
                  </span>
                  <span>{currentQ.keyFact}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:translate-x-0.5 cursor-pointer"
              >
                <span>{currentIndex + 1 < QUIZ_QUESTIONS.length ? 'ข้อถัดไป' : 'สรุปผลด่านที่ 1'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
