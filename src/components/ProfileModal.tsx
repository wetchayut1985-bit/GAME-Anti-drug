import React, { useState, useRef } from 'react';
import { X, User, Camera, Upload, Award, Shield, School, BookOpen, Star, Coins, Check, Printer, Heart, Sparkles } from 'lucide-react';
import { UserProfile, saveUserProfile, calculateLevel } from '../utils/userProfileStorage';
import { ASSET_IMAGES } from '../assets/assetPaths';
import { sound } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'avatar' | 'card'>('info');
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const { level, exp, nextLevelExp } = calculateLevel(profile.totalScoreEver);

  const presetAvatars = [
    { id: 'boy', label: 'ฮีโร่หนุ่มน้อย', img: ASSET_IMAGES.avatarBoy },
    { id: 'girl', label: 'ฮีโร่สาวน้อย', img: ASSET_IMAGES.avatarGirl },
    { id: 'aidin', label: 'ไอดิน (สายปัญญา)', color: 'from-blue-500 to-indigo-600', initial: 'ไ' },
    { id: 'fahsai', label: 'ฟ้าใส (สายกีฬา)', color: 'from-emerald-500 to-teal-600', initial: 'ฟ' },
    { id: 'kongphop', label: 'ก้องภพ (สายสื่อสาร)', color: 'from-amber-500 to-orange-600', initial: 'ก' },
    { id: 'mint', label: 'มิ้นท์ (สายศิลป์)', color: 'from-purple-500 to-pink-600', initial: 'ม' },
  ];

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    sound.playCorrect();
    saveUserProfile(formData);
    onUpdateProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSelectPreset = (presetId: string) => {
    sound.playClick();
    const updated: UserProfile = {
      ...formData,
      avatarType: 'preset',
      avatarPreset: presetId as UserProfile['avatarPreset'],
      customAvatarUrl: null,
    };
    setFormData(updated);
    saveUserProfile(updated);
    onUpdateProfile(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      sound.playHeroPower();
      const dataUrl = event.target?.result as string;
      const updated: UserProfile = {
        ...formData,
        avatarType: 'custom',
        customAvatarUrl: dataUrl,
      };
      setFormData(updated);
      saveUserProfile(updated);
      onUpdateProfile(updated);
    };
    reader.readAsDataURL(file);
  };

  const getCurrentAvatarImage = () => {
    if (formData.avatarType === 'custom' && formData.customAvatarUrl) {
      return (
        <img
          src={formData.customAvatarUrl}
          alt="Custom Avatar"
          className="w-full h-full object-cover"
        />
      );
    }
    if (formData.avatarPreset === 'boy') {
      return (
        <img
          src={ASSET_IMAGES.avatarBoy}
          alt="Hero Boy"
          className="w-full h-full object-cover"
        />
      );
    }
    if (formData.avatarPreset === 'girl') {
      return (
        <img
          src={ASSET_IMAGES.avatarGirl}
          alt="Hero Girl"
          className="w-full h-full object-cover"
        />
      );
    }
    // Default initial avatar
    const preset = presetAvatars.find((p) => p.id === formData.avatarPreset) || presetAvatars[0];
    return (
      <div
        className={`w-full h-full bg-gradient-to-tr ${
          preset.color || 'from-blue-500 to-indigo-600'
        } flex items-center justify-center text-white font-heading font-extrabold text-3xl`}
      >
        {preset.initial || formData.nickname.charAt(0) || 'ฮ'}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-4">
        {/* Header with Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/60 shadow-lg shrink-0 bg-slate-800">
              {getCurrentAvatarImage()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-heading font-bold text-white">
                  {formData.nickname || 'ฮีโร่เยาวชน'}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                  เลเวล {level}
                </span>
              </div>
              <p className="text-xs text-blue-100 flex items-center gap-1.5 mt-0.5">
                <School className="w-3.5 h-3.5" />
                <span>{formData.school}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 text-amber-300">
              <Coins className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{profile.heroCoins} เหรียญ</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Level & EXP Progress Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/90 px-6 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0">
              EXP ความดี:
            </span>
            <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(exp / nextLevelExp) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-display font-semibold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
              {exp}/{nextLevelExp}
            </span>
          </div>
          <div className="text-emerald-600 dark:text-emerald-400 font-semibold shrink-0 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            <span>คะแนนสะสม {profile.totalScoreEver}</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'info'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>ประวัติส่วนตัว</span>
          </button>

          <button
            onClick={() => setActiveTab('avatar')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'avatar'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>เปลี่ยนรูปโปรไฟล์</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'card'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>บัตรประจำตัวฮีโร่</span>
          </button>
        </div>

        {/* Tab 1: Personal Info Form */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ชื่อ-นามสกุลจริง:
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="เช่น ด.ช. ธนพัฒน์ รักความดี"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ชื่อเล่น / ฉายาในเกม:
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="เช่น ไอดิน ฮีโร่"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  โรงเรียน / สถาบันการศึกษา:
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  placeholder="เช่น โรงเรียนมัธยมวิทยาคม"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ระดับชั้น:
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="มัธยมศึกษาปีที่ 1">มัธยมศึกษาปีที่ 1 (ม.1)</option>
                  <option value="มัธยมศึกษาปีที่ 2">มัธยมศึกษาปีที่ 2 (ม.2)</option>
                  <option value="มัธยมศึกษาปีที่ 3">มัธยมศึกษาปีที่ 3 (ม.3)</option>
                  <option value="มัธยมศึกษาปีที่ 4">มัธยมศึกษาปีที่ 4 (ม.4)</option>
                  <option value="มัธยมศึกษาปีที่ 5">มัธยมศึกษาปีที่ 5 (ม.5)</option>
                  <option value="มัธยมศึกษาปีที่ 6">มัธยมศึกษาปีที่ 6 (ม.6)</option>
                  <option value="เยาวชนจิตอาสา">เยาวชนจิตอาสา / To Be Number One</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                ชมรม / กิจกรรมที่ชอบทำเวลาว่าง:
              </label>
              <input
                type="text"
                value={formData.club}
                onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                placeholder="เช่น ชมรมบาสเกตบอล, ดนตรีสากล, วาดภาพ, วิทยาศาสตร์"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                คติประจำใจต้านยาเสพติด:
              </label>
              <textarea
                value={formData.motto}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                rows={2}
                placeholder="เช่น กล้าปฏิเสธ ไม่พึ่งพายาเสพติด มุ่งมั่นพัฒนาตนเองสู่อนาคต"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                บันทึกประวัติส่วนตัว
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Change Profile Picture */}
        {activeTab === 'avatar' && (
          <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Custom Photo Upload Area */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-heading font-bold text-slate-900 dark:text-white">
                  อัปโหลดรูปภาพของคุณเองจากเครื่อง
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  รองรับไฟล์รูปภาพ JPG, PNG (ขนาดไม่เกิน 3MB)
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>เลือกรูปภาพจากเครื่อง</span>
              </button>
            </div>

            {/* Cartoon Preset Avatars */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                หรือเลือกรูปการ์ตูนฮีโร่สุดน่ารัก:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {presetAvatars.map((preset) => {
                  const isSelected =
                    formData.avatarType === 'preset' && formData.avatarPreset === preset.id;

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 relative ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-700">
                        {preset.img ? (
                          <img
                            src={preset.img}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-tr ${preset.color} flex items-center justify-center text-white font-heading font-extrabold text-2xl`}
                          >
                            {preset.initial}
                          </div>
                        )}
                      </div>

                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate w-full">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Official Hero License Card */}
        {activeTab === 'card' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto flex flex-col items-center">
            {/* ID Card Visual */}
            <div className="w-full max-w-md bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border-2 border-amber-400/50 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] tracking-wider text-amber-300 font-bold uppercase">
                      บัตรประจำตัวฮีโร่เยาวชนสีขาว
                    </div>
                    <div className="text-xs font-heading font-bold text-white">
                      Drug-Free Hero Youth License
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  ระดับ {level}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-slate-800">
                  {getCurrentAvatarImage()}
                </div>

                <div className="flex-1 space-y-1 text-xs">
                  <div className="font-heading font-bold text-sm sm:text-base text-amber-300">
                    {formData.fullName}
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    ฉายา: <strong>{formData.nickname}</strong>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    โรงเรียน: {formData.school}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    ระดับชั้น: {formData.grade}
                  </div>
                </div>
              </div>

              {/* Motto Quote */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700 text-[11px] text-slate-300 italic">
                "{formData.motto}"
              </div>

              {/* Card Footer */}
              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>รหัสฮีโร่: {profile.id}</span>
                <span className="text-amber-300 font-semibold">โครงการโรงเรียนสีขาว ๒๕๖๙</span>
              </div>
            </div>

            {/* Print / Save Card Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>พิมพ์หรือบันทึกบัตรประจำตัว</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
