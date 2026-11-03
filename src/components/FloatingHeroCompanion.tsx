import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Heart } from 'lucide-react';
import { CharacterCustomization } from '../data/characterCustomization';
import { HeroAvatarRenderer } from './HeroAvatarRenderer';
import { sound } from '../utils/audio';

interface FloatingHeroCompanionProps {
  customization: CharacterCustomization;
  customUrl?: string | null;
  stageId: number;
}

const MOTIVATIONAL_QUOTES: Record<number, string[]> = {
  1: [
    'วิเคราะห์ความจริงให้ดีนะ!',
    'บุหรี่ไฟฟ้ามีนิโคตินอันตราย!',
    'สารเสพติดทำลายสมองถาวร!',
    'จำไว้ สายด่วน ป.ป.ส. คือ 1386!',
  ],
  2: [
    'แยกแยะให้ชัดเจน พฤติกรรมปลอดภัย!',
    'มุมอับลับตาคือจุดเสี่ยง!',
    'กีฬาและดนตรีสร้างสุขตามธรรมชาติ!',
    'กล้าปฏิเสธเพื่อนเมื่อถูกชวน!',
  ],
  3: [
    '3 สเต็ปฮีโร่: ปฏิเสธหนักแน่นสบตา!',
    'บอกเหตุผลและเป้าหมายชีวิตเรา!',
    'เดินผละออกมา ไม่ลังเล!',
    'เพื่อนแท้ต้องไม่ชวนทำลายอนาคต!',
  ],
  4: [
    'ทุกปัญหามีทางออกที่ดีเสมอ!',
    'เครียดเรื่องเรียน ปรึกษาครูแนะแนว!',
    'เปลี่ยนเวลาว่างเป็นโอกาสทอง!',
    'รักตัวเอง รักอนาคต!',
  ],
  5: [
    'ช่วยเพื่อนด้วยความเข้าใจ!',
    'สายด่วนบำบัด 1165 ช่วยได้เสมอ!',
    'เปลี่ยนจุดอับเป็นลานกีฬาชุมชน!',
    'รวมพลังสร้างสังคมสีขาว!',
  ],
};

export const FloatingHeroCompanion: React.FC<FloatingHeroCompanionProps> = ({
  customization,
  customUrl = null,
  stageId,
}) => {
  const [speech, setSpeech] = useState<string>('สู้ ๆ นะฮีโร่!');
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  // Periodically change motivational tips
  useEffect(() => {
    const quotes = MOTIVATIONAL_QUOTES[stageId] || MOTIVATIONAL_QUOTES[1];
    let quoteIndex = 0;

    const interval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      setSpeech(quotes[quoteIndex]);
      setIsBubbleVisible(true);

      // Auto-hide bubble after 5s for clean UI
      setTimeout(() => {
        setIsBubbleVisible(false);
      }, 5000);
    }, 9000);

    return () => clearInterval(interval);
  }, [stageId]);

  const handleTapCompanion = () => {
    sound.playStar();
    const quotes = MOTIVATIONAL_QUOTES[stageId] || MOTIVATIONAL_QUOTES[1];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setSpeech(randomQuote);
    setIsBubbleVisible(true);
  };

  return (
    <aside
      aria-label="คู่หูฮีโร่ผู้พิทักษ์"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end pointer-events-auto select-none"
    >
      {/* Speech Bubble */}
      {isBubbleVisible && (
        <div className="mb-2 max-w-[190px] sm:max-w-[240px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white px-3 py-2 rounded-2xl shadow-xl border-2 border-amber-400 text-xs sm:text-sm font-heading font-bold animate-in fade-in zoom-in-95 duration-200 flex items-start gap-1.5 relative">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>{speech}</span>
          {/* Bubble Tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 border-r-2 border-b-2 border-amber-400 transform rotate-45" />
        </div>
      )}

      {/* Floating Hero Character */}
      <button
        onClick={handleTapCompanion}
        className="cursor-pointer group transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        title="แตะเพื่อรับพลังใจจากฮีโร่คู่หู"
      >
        <HeroAvatarRenderer
          customization={customization}
          customUrl={customUrl}
          size="floating"
          className="drop-shadow-2xl"
        />
      </button>
    </aside>
  );
};
