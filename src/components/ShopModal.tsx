import React, { useState } from 'react';
import { X, ShoppingBag, Coins, Sparkles, Check, Gift, ShieldAlert, Award, Glasses, Hourglass, Gem, Crown, Heart, Zap } from 'lucide-react';
import { SHOP_ITEMS, ShopItem } from '../data/shopItems';
import { UserProfile, saveUserProfile } from '../utils/userProfileStorage';
import { sound } from '../utils/audio';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'powerup' | 'gear' | 'title' | 'frame'>('all');
  const [claimedRewardToday, setClaimedRewardToday] = useState<boolean>(() => {
    if (!profile.lastDailyClaim) return false;
    const lastDate = new Date(profile.lastDailyClaim).toDateString();
    const today = new Date().toDateString();
    return lastDate === today;
  });

  if (!isOpen) return null;

  const filteredItems =
    activeCategory === 'all'
      ? SHOP_ITEMS
      : SHOP_ITEMS.filter((item) => item.category === activeCategory);

  const handleClaimDaily = () => {
    if (claimedRewardToday) return;
    sound.playStar();
    const bonus = 25;
    const updated: UserProfile = {
      ...profile,
      heroCoins: profile.heroCoins + bonus,
      lastDailyClaim: new Date().toISOString(),
    };
    saveUserProfile(updated);
    onUpdateProfile(updated);
    setClaimedRewardToday(true);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (profile.heroCoins < item.price) {
      sound.playWrong();
      alert('เหรียญทองฮีโร่ไม่เพียงพอ! ทำภารกิจในด่านต่าง ๆ เพื่อเก็บเหรียญเพิ่มนะ');
      return;
    }

    sound.playStar();
    const updatedInventory = [...profile.inventory, item.id];
    let updatedProfile: UserProfile = {
      ...profile,
      heroCoins: profile.heroCoins - item.price,
      inventory: updatedInventory,
    };

    // Auto-equip if title or frame
    if (item.category === 'title') {
      updatedProfile.equippedTitle = item.id;
    } else if (item.category === 'frame') {
      updatedProfile.equippedFrame = item.id;
    } else if (item.category === 'gear') {
      updatedProfile.equippedGear = item.id;
    } else if (item.category === 'powerup') {
      updatedProfile.equippedPowerups = [...profile.equippedPowerups, item.id];
    }

    saveUserProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  };

  const handleToggleEquip = (item: ShopItem) => {
    sound.playClick();
    let updated: UserProfile = { ...profile };

    if (item.category === 'title') {
      updated.equippedTitle = profile.equippedTitle === item.id ? null : item.id;
    } else if (item.category === 'frame') {
      updated.equippedFrame = profile.equippedFrame === item.id ? null : item.id;
    } else if (item.category === 'gear') {
      updated.equippedGear = profile.equippedGear === item.id ? null : item.id;
    } else if (item.category === 'powerup') {
      const isEquipped = profile.equippedPowerups.includes(item.id);
      updated.equippedPowerups = isEquipped
        ? profile.equippedPowerups.filter((id) => id !== item.id)
        : [...profile.equippedPowerups, item.id];
    }

    saveUserProfile(updated);
    onUpdateProfile(updated);
  };

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'Glasses':
        return <Glasses className="w-6 h-6 text-blue-400" />;
      case 'Hourglass':
        return <Hourglass className="w-6 h-6 text-amber-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-6 h-6 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-rose-400" />;
      case 'Gem':
        return <Gem className="w-6 h-6 text-cyan-400" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-amber-400" />;
      case 'Heart':
        return <Heart className="w-6 h-6 text-pink-400" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-sky-400" />;
      default:
        return <ShoppingBag className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden my-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-white leading-tight">
                ร้านค้าของรางวัลฮีโร่ (Hero Shop)
              </h3>
              <p className="text-xs text-amber-100 flex items-center gap-1">
                <span>ใช้แต้มและเหรียญทองแลกไอเทมพิเศษ</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-display font-extrabold flex items-center gap-1.5 text-white shadow-inner">
              <Coins className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{profile.heroCoins} เหรียญ</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Daily Bonus Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800/80 dark:to-slate-800/50 p-3.5 px-6 border-b border-amber-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              รับเหรียญรางวัลล็อกอินรายวันฟรี (+25 เหรียญ):
            </span>
          </div>

          <button
            onClick={handleClaimDaily}
            disabled={claimedRewardToday}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              claimedRewardToday
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
            }`}
          >
            {claimedRewardToday ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>รับแล้ววันนี้</span>
              </>
            ) : (
              <span>กดรับฟรี!</span>
            )}
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-2 gap-1.5 overflow-x-auto text-xs font-medium no-scrollbar">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'powerup', label: 'ไอเทมช่วยเล่น' },
            { id: 'gear', label: 'อุปกรณ์ & ของรางวัล' },
            { id: 'title', label: 'ฉายาฮีโร่' },
            { id: 'frame', label: 'กรอบโปรไฟล์' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id as typeof activeCategory);
              }}
              className={`py-1.5 px-3 rounded-xl transition-all cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[58vh] overflow-y-auto">
          {filteredItems.map((item) => {
            const isOwned = profile.inventory.includes(item.id);
            const isEquipped =
              profile.equippedTitle === item.id ||
              profile.equippedFrame === item.id ||
              profile.equippedGear === item.id ||
              profile.equippedPowerups.includes(item.id);

            const canAfford = profile.heroCoins >= item.price;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isEquipped
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-400 ring-2 ring-amber-400/20'
                    : isOwned
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/80 flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-slate-600">
                    {getItemIcon(item.iconName)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      {isOwned && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                          ครอบครองแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                      ✨ {item.perkText}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 mt-1">
                  <div className="flex items-center gap-1 font-display font-bold text-xs text-amber-600 dark:text-amber-400">
                    <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.price} เหรียญ</span>
                  </div>

                  {isOwned ? (
                    <button
                      onClick={() => handleToggleEquip(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isEquipped
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {isEquipped ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>กำลังสวมใส่</span>
                        </>
                      ) : (
                        <span>กดสวมใส่</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuyItem(item)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20 hover:scale-102'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      แลกซื้อ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
