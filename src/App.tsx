/**
 * ภารกิจพิชิตยาเสพติด (Drug-Free Hero)
 * 2D Adventure & Educational Game for Secondary School Students
 */

import React, { useState, useEffect } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { StageNavHeader } from './components/StageNavHeader';
import { StageOneQuiz } from './components/StageOneQuiz';
import { StageTwoSorting } from './components/StageTwoSorting';
import { StageThreeRefusal } from './components/StageThreeRefusal';
import { StageFourPathways } from './components/StageFourPathways';
import { StageFiveCommunity } from './components/StageFiveCommunity';
import { StageCompleteModal } from './components/StageCompleteModal';
import { VictorySummaryScreen } from './components/VictorySummaryScreen';
import { HeroMentorModal } from './components/HeroMentorModal';
import { CHARACTERS, Character, STAGES } from './data/gameContent';
import { sound } from './utils/audio';

type GameState = 'TITLE' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'STAGE_4' | 'STAGE_5' | 'VICTORY';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [playerName, setPlayerName] = useState<string>('');
  const [totalScore, setTotalScore] = useState<number>(0);
  const [stageStars, setStageStars] = useState<number[]>([0, 0, 0, 0, 0]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);

  // Intermediate Stage Completion Modal State
  const [stageCompleteData, setStageCompleteData] = useState<{
    stageId: number;
    stageTitle: string;
    stageScore: number;
    stars: number;
  } | null>(null);

  // Sync mute
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleStartGame = (name: string) => {
    setPlayerName(name);
    setTotalScore(0);
    setStageStars([0, 0, 0, 0, 0]);
    setGameState('STAGE_1');
  };

  const handleUpdateScore = (points: number) => {
    setTotalScore((prev) => prev + points);
  };

  // Called when stage finishes
  const handleStageComplete = (stageId: number, score: number, stars: number) => {
    setStageStars((prev) => {
      const next = [...prev];
      next[stageId - 1] = stars;
      return next;
    });

    const currentStageInfo = STAGES.find((s) => s.id === stageId) || STAGES[0];

    setStageCompleteData({
      stageId,
      stageTitle: currentStageInfo.title,
      stageScore: score,
      stars,
    });
  };

  // Called when user clicks "Next Stage" inside the modal
  const handleProceedNextStage = () => {
    if (!stageCompleteData) return;
    const completedStageId = stageCompleteData.stageId;
    setStageCompleteData(null);

    if (completedStageId === 1) {
      setGameState('STAGE_2');
    } else if (completedStageId === 2) {
      setGameState('STAGE_3');
    } else if (completedStageId === 3) {
      setGameState('STAGE_4');
    } else if (completedStageId === 4) {
      setGameState('STAGE_5');
    } else if (completedStageId === 5) {
      setGameState('VICTORY');
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setGameState('TITLE');
    setTotalScore(0);
    setStageStars([0, 0, 0, 0, 0]);
    setStageCompleteData(null);
  };

  // Map state to stage id
  const getCurrentStageId = (): number => {
    switch (gameState) {
      case 'STAGE_1':
        return 1;
      case 'STAGE_2':
        return 2;
      case 'STAGE_3':
        return 3;
      case 'STAGE_4':
        return 4;
      case 'STAGE_5':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-body selection:bg-amber-400 selection:text-slate-950">
      {/* Title Screen */}
      {gameState === 'TITLE' && (
        <TitleScreen
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          onStartGame={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* In-Game Active Stages */}
      {gameState !== 'TITLE' && gameState !== 'VICTORY' && (
        <>
          <StageNavHeader
            character={selectedCharacter}
            currentStageId={getCurrentStageId()}
            score={totalScore}
            stars={stageStars}
            timeLeft={timeLeft}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onExitToMenu={handleRestart}
            onOpenMentor={() => setIsMentorOpen(true)}
          />

          <main className="flex-1 flex flex-col justify-center py-6 px-2 sm:px-4">
            {gameState === 'STAGE_1' && (
              <StageOneQuiz
                onComplete={(score, stars) => handleStageComplete(1, score, stars)}
                onUpdateScore={handleUpdateScore}
                setTimeLeft={setTimeLeft}
                hasPerkExtraTime={selectedCharacter.id === 'aidin'}
              />
            )}

            {gameState === 'STAGE_2' && (
              <StageTwoSorting
                onComplete={(score, stars) => handleStageComplete(2, score, stars)}
                onUpdateScore={handleUpdateScore}
                setTimeLeft={setTimeLeft}
              />
            )}

            {gameState === 'STAGE_3' && (
              <StageThreeRefusal
                onComplete={(score, stars) => handleStageComplete(3, score, stars)}
                onUpdateScore={handleUpdateScore}
                setTimeLeft={setTimeLeft}
                hasKongphopPerk={selectedCharacter.id === 'kongphop'}
              />
            )}

            {gameState === 'STAGE_4' && (
              <StageFourPathways
                onComplete={(score, stars) => handleStageComplete(4, score, stars)}
                onUpdateScore={handleUpdateScore}
                setTimeLeft={setTimeLeft}
              />
            )}

            {gameState === 'STAGE_5' && (
              <StageFiveCommunity
                onComplete={(score, stars) => handleStageComplete(5, score, stars)}
                onUpdateScore={handleUpdateScore}
                setTimeLeft={setTimeLeft}
                hasMintPerk={selectedCharacter.id === 'mint'}
              />
            )}
          </main>
        </>
      )}

      {/* Victory Summary Screen */}
      {gameState === 'VICTORY' && (
        <div className="py-8 px-4 flex-1 flex flex-col justify-center">
          <VictorySummaryScreen
            character={selectedCharacter}
            totalScore={totalScore}
            stars={stageStars}
            playerName={playerName}
            onRestart={handleRestart}
          />
        </div>
      )}

      {/* Stage Completion Pop-up Modal */}
      {stageCompleteData && (
        <StageCompleteModal
          stageId={stageCompleteData.stageId}
          stageTitle={stageCompleteData.stageTitle}
          stageScore={stageCompleteData.stageScore}
          stars={stageCompleteData.stars}
          onNextStage={handleProceedNextStage}
        />
      )}

      {/* AI Hero Mentor Q&A Modal */}
      <HeroMentorModal isOpen={isMentorOpen} onClose={() => setIsMentorOpen(false)} />
    </div>
  );
}
