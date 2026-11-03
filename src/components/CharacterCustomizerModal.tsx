import React, { useState } from 'react';
import { X, Sparkles, Check, Dices, ArrowRight, Shield, Star, Glasses, Award, Headphones, User } from 'lucide-react';
import { CharacterCustomization, CAPE_COLORS, HAIR_COLORS, ACCESSORIES } from '../data/characterCustomization';
import { HeroAvatarRenderer } from './HeroAvatarRenderer';
import { sound } from '../utils/audio';

interface CharacterCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: CharacterCustomization;
  onSave: (custom: CharacterCustomization) => void;
}

export const CharacterCustomizerModal: React.FC<CharacterCustomizerModalProps> = ({
  isOpen,
  onClose,
  customization,
  onSave,
}) => {
  const [draft, setDraft] = useState<CharacterCustomization>(customization);
  const [activeTab, setActiveTab] = useState<'gender' | 'cape' | 'hair' | 'gear'>('gender');

  if (!isOpen) return null;

  const handleRandomize = () => {
    sound.playStar();
    const genders: ('boy' | 'girl')[] = ['boy', 'girl'];
    const capes = CAPE_COLORS.map((c) => c.id);
    const hairs = HAIR_COLORS.map((h) => h.id);
    const accessories = ACCESSORIES.map((a) => a.id);

    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    const randomCape = capes[Math.floor(Math.random() * capes.length)];
    const randomHair = hairs[Math.floor(Math.random() * hairs.length)];
    const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)];

    setDraft({
      ...draft,
      gender: randomGender,
      capeColor: randomCape,
      hairColor: randomHair,
      accessory: randomAccessory,
    });
  };

  const handleSaveAndStart = () => {
    sound.playClick();
    sound.playHeroPower();
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl border-2 border-amber-400/40 flex flex-col md:flex-row overflow-hidden my-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Live Character Preview with Aura & Levitating Hero */}
        <div className="w-full md:w-5/12 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800 relative overflow-hidden">
          {/* Decorative glowing particles in preview */}
          <div className="absolute top-8 left-8 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-32 h-32 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <span className="text-[10px] font-bold tracking-widest uppercase text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> สตูดิโอออกแบบตัวละครฮีโร่
            </span>
            <h3 className="text-xl font-heading font-extrabold text-white mt-1">
              {draft.nickname || 'ฮีโร่ของคุณ'}
            </h3>
            <span className="text-xs text-blue-300">
              {draft.gender === 'boy' ? 'ฮีโร่หนุ่มน้อยผู้พิทักษ์' : 'ฮีโร่สาวน้อยผู้พิทักษ์'}
            </span>
          </div>

          {/* Floating Avatar Preview */}
          <div className="my-6 relative z-10 flex flex-col items-center">
            <HeroAvatarRenderer
              customization={draft}
              size="floating"
              speechText="พร้อมลุยทุกภารกิจแล้ว!"
            />
          </div>

          {/* Randomize Button */}
          <button
            onClick={handleRandomize}
            className="w-full py-2 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm relative z-10"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span>สุ่มลุคแฟชั่นฮีโร่ (Random)</span>
          </button>
        </div>

        {/* Right Side: Customization Controls */}
        <div className="w-full md:w-7/12 p-6 flex flex-col justify-between max-h-[75vh] overflow-y-auto">
          <div>
            {/* Customizer Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 pb-3 mb-4 text-xs font-semibold overflow-x-auto no-scrollbar">
              {[
                { id: 'gender', label: '1. เพศ & ชื่อ' },
                { id: 'cape', label: '2. สีผ้าคลุม' },
                { id: 'hair', label: '3. สไตล์ผม' },
                { id: 'gear', label: '4. อุปกรณ์พิเศษ' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(tab.id as typeof activeTab);
                  }}
                  className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Gender & Name */}
            {activeTab === 'gender' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    เลือกตัวละครฮีโร่ (เพศ):
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDraft({ ...draft, gender: 'boy' });
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                        draft.gender === 'boy'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-3xl">👦</span>
                      <span className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                        ฮีโร่ชาย (Hero Boy)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDraft({ ...draft, gender: 'girl' });
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                        draft.gender === 'girl'
                          ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 ring-2 ring-pink-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-3xl">👧</span>
                      <span className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                        ฮีโร่หญิง (Hero Girl)
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ชื่อเล่นฮีโร่ของคุณ:
                  </label>
                  <input
                    type="text"
                    value={draft.nickname}
                    onChange={(e) => setDraft({ ...draft, nickname: e.target.value })}
                    placeholder="เช่น ไอดิน / ฟ้าใส / นักสู้สีขาว"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Cape Color */}
            {activeTab === 'cape' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  เลือกสีผ้าคลุมฮีโร่ (Hero Cape):
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {CAPE_COLORS.map((cape) => {
                    const isSelected = draft.capeColor === cape.id;
                    return (
                      <button
                        key={cape.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setDraft({ ...draft, capeColor: cape.id });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/20'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full ${cape.bg} shadow-md`} />
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                            {cape.label}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Hair Color */}
            {activeTab === 'hair' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  เลือกโทนสีผมฮีโร่:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {HAIR_COLORS.map((hair) => {
                    const isSelected = draft.hairColor === hair.id;
                    return (
                      <button
                        key={hair.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setDraft({ ...draft, hairColor: hair.id });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/20'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-white/50 shadow-sm"
                          style={{ backgroundColor: hair.colorCode }}
                        />
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {hair.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 4: Accessories & Gear */}
            {activeTab === 'gear' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  เลือกอุปกรณ์เสริมพิเศษ:
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {ACCESSORIES.map((acc) => {
                    const isSelected = draft.accessory === acc.id;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setDraft({ ...draft, accessory: acc.id });
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 ring-2 ring-amber-400/20'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                            {acc.label}
                          </div>
                          {'bonus' in acc && (
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                              ✨ {acc.bonus}
                            </div>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-6 flex justify-end">
            <button
              onClick={handleSaveAndStart}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-heading font-extrabold text-sm sm:text-base shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
            >
              <span>บันทึกฮีโร่ & เริ่มภารกิจ!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
