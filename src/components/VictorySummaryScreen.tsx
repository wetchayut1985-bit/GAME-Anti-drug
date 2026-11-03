import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, PhoneCall, Award, Printer, Shield, CheckCircle2, Heart } from 'lucide-react';
import { Character, HELPLINES } from '../data/gameContent';
import { ASSET_IMAGES } from '../assets/assetPaths';
import { sound } from '../utils/audio';

interface VictorySummaryScreenProps {
  character: Character;
  totalScore: number;
  stars: number[];
  onRestart: () => void;
  playerName?: string;
}

export const VictorySummaryScreen: React.FC<VictorySummaryScreenProps> = ({
  character,
  totalScore,
  stars,
  onRestart,
  playerName = '',
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const totalStars = stars.reduce((a, b) => a + b, 0);

  // Trigger celebration confetti on mount
  useEffect(() => {
    sound.playVictory();

    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Determine Rank Tier based on score and stars
  let rankTier = 'สุดยอดฮีโร่ต้านยาเสพติดระดับเหรียญทองเกียรติยศ';
  let rankBadgeColor = 'from-amber-400 to-yellow-500 text-slate-950';
  if (totalStars >= 13) {
    rankTier = 'สุดยอดฮีโร่ผู้พิทักษ์เยาวชนระดับทองคำ (Gold Tier)';
    rankBadgeColor = 'from-amber-400 to-yellow-500 text-slate-950';
  } else if (totalStars >= 9) {
    rankTier = 'ฮีโร่ผู้พิทักษ์เยาวชนระดับเงิน (Silver Tier)';
    rankBadgeColor = 'from-slate-200 to-slate-400 text-slate-900';
  } else {
    rankTier = 'ฮีโร่ผู้พิทักษ์เยาวชนระดับทองแดง (Bronze Tier)';
    rankBadgeColor = 'from-amber-700 to-amber-900 text-amber-100';
  }

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayName = playerName.trim() || character.name;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Victory Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-amber-400/50 relative overflow-hidden text-center flex flex-col items-center">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Medal Badge Asset */}
        <div className="relative mb-4">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 ring-4 ring-amber-400/30 hero-glow bg-amber-50">
            <img
              src={ASSET_IMAGES.heroMedal}
              alt="Golden Hero Medal"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-full shadow-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Encouraging Headline */}
        <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
          ภารกิจพิชิตยาเสพติดสำเร็จครบ 5 ด่าน
        </span>
        <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
          "คุณคือฮีโร่ตัวจริง! ร่วมสร้างสังคมไทยให้ปลอดยาเสพติด"
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
          ยินดีด้วยกับ <strong className="text-blue-600 dark:text-blue-400 font-semibold">{displayName}</strong> คุณได้แสดงความรู้ ความกล้าหาญในการปฏิเสธ และหัวใจที่พร้อมปกป้องเพื่อน ๆ และชุมชนให้ปลอดภัย
        </p>

        {/* Rank Badge */}
        <div className={`mt-5 px-5 py-2 rounded-2xl bg-gradient-to-r ${rankBadgeColor} font-heading font-bold text-sm sm:text-base shadow-md inline-flex items-center gap-2`}>
          <Trophy className="w-5 h-5 shrink-0" />
          <span>{rankTier}</span>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full mt-8">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">คะแนนรวม</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
              {totalScore}
            </div>
            <div className="text-[11px] text-slate-400">คะแนนเกียรติยศ</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">ดาวที่สะสม</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-500 tabular-nums mt-1 flex items-center justify-center gap-1">
              <span>{totalStars}</span>
              <span className="text-lg text-slate-400 font-normal">/15</span>
            </div>
            <div className="text-[11px] text-amber-500 font-semibold">★ ทุกด่านสำเร็จ</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">ด่านที่ผ่าน</div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums mt-1">
              5/5
            </div>
            <div className="text-[11px] text-slate-400">ครบสมบูรณ์แบบ</div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400">ตัวละครฮีโร่</div>
            <div className="text-base sm:text-lg font-heading font-bold text-slate-800 dark:text-slate-100 mt-2 truncate">
              {character.nickname}
            </div>
            <div className="text-[10px] text-slate-400 truncate">{character.role.split(' ')[0]}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-md">
          <button
            onClick={() => setShowCertificate(true)}
            className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-heading font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Award className="w-5 h-5" />
            <span>ดูเกียรติบัตรฮีโร่</span>
          </button>

          <button
            onClick={onRestart}
            className="flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 border border-slate-700"
          >
            <RotateCcw className="w-5 h-5" />
            <span>เล่นใหม่อีกครั้ง</span>
          </button>
        </div>
      </div>

      {/* Official Help & Helpline Directory */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold mb-4">
          <PhoneCall className="w-5 h-5" />
          <h3 className="text-lg font-heading font-bold text-slate-900 dark:text-white">
            ช่องทางช่วยเหลือและสายด่วนสำคัญที่วัยรุ่นควรรู้
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HELPLINES.map((line) => (
            <div
              key={line.number}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-bold text-base text-slate-900 dark:text-white">
                    {line.name}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-display font-extrabold text-sm border border-rose-200 dark:border-rose-800">
                    โทร {line.number}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {line.agency}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {line.desc}
                </p>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                ⏰ {line.hours}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl border-4 border-amber-400 relative my-8">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>

            {/* Certificate Header Lockup */}
            <div className="border-4 border-double border-amber-300 dark:border-amber-500/50 p-6 sm:p-8 rounded-2xl text-center space-y-4 bg-amber-50/30 dark:bg-slate-950/40">
              <div className="flex justify-center items-center gap-3">
                <Shield className="w-10 h-10 text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  เกียรติบัตรฮีโร่ต้านยาเสพติด
                </h2>
                <Shield className="w-10 h-10 text-amber-500" />
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                โครงการโรงเรียนสีขาว ปลอดยาเสพติดและอบายมุข ประจำปีการศึกษา ๒๕๖๙
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 pt-2">
                เกียรติบัตรนี้มอบให้เพื่อแสดงว่า
              </p>

              <div className="text-2xl sm:text-3xl font-heading font-black text-blue-700 dark:text-blue-400 border-b-2 border-dashed border-amber-400 max-w-md mx-auto pb-2">
                {displayName}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                ได้ผ่านการฝึกอบรมและปฏิบัติภารกิจในเกม <strong>"ภารกิจพิชิตยาเสพติด (Drug-Free Hero)"</strong> ครบถ้วนทั้ง ๕ ด่าน
                ด้วยคะแนนรวม <strong className="text-emerald-600 dark:text-emerald-400">{totalScore} คะแนน</strong> (★ {totalStars}/15 ดาว)
                สมควรได้รับการยกย่องเป็น
              </p>

              <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-heading font-bold text-sm sm:text-base border border-amber-300">
                ⭐ {rankTier} ⭐
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div>ลงวันที่ {currentDate}</div>
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    เครือข่ายเยาวชนไทยหัวใจสีขาว
                  </div>
                </div>
                <div className="text-right">
                  <div className="italic text-slate-600 dark:text-slate-300 font-serif">
                    Drug-Free Hero Campaign
                  </div>
                  <div className="font-semibold text-emerald-600">รับรองผลสำเร็จ 100%</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์เกียรติบัตร</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-sm"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
