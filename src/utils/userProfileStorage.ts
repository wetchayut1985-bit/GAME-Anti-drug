export interface UserProfile {
  id: string;
  fullName: string;
  nickname: string;
  school: string;
  grade: string;
  motto: string;
  club: string;
  avatarType: 'preset' | 'custom';
  avatarPreset: 'boy' | 'girl' | 'aidin' | 'fahsai' | 'kongphop' | 'mint';
  customAvatarUrl: string | null;
  heroCoins: number;
  totalScoreEver: number;
  inventory: string[]; // item ids
  equippedTitle: string | null;
  equippedFrame: string | null;
  equippedGear: string | null;
  equippedPowerups: string[];
  lastDailyClaim: string | null; // ISO Date string
}

const STORAGE_KEY = 'drug_free_hero_user_profile_v2';

export const DEFAULT_PROFILE: UserProfile = {
  id: 'hero_' + Math.floor(Math.random() * 100000),
  fullName: 'ธนพัฒน์ รักความดี',
  nickname: 'ผู้พิทักษ์เยาวชน',
  school: 'โรงเรียนมัธยมวิทยาคม',
  grade: 'มัธยมศึกษาปีที่ 3',
  motto: 'รักสุขภาพ ไม่พึ่งพายาเสพติด ก้าวสู่อนาคตที่สดใส',
  club: 'ชมรม To Be Number One & กีฬา',
  avatarType: 'preset',
  avatarPreset: 'boy',
  customAvatarUrl: null,
  heroCoins: 50, // Starting bonus coins so users can shop immediately!
  totalScoreEver: 0,
  inventory: ['title_guardian'],
  equippedTitle: 'title_guardian',
  equippedFrame: null,
  equippedGear: null,
  equippedPowerups: [],
  lastDailyClaim: null,
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function calculateLevel(totalScore: number): { level: number; exp: number; nextLevelExp: number } {
  // Each level requires 100 EXP
  const level = Math.floor(totalScore / 100) + 1;
  const exp = totalScore % 100;
  return { level, exp, nextLevelExp: 100 };
}
