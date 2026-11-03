export interface CharacterCustomization {
  gender: 'boy' | 'girl';
  nickname: string;
  heroTitle: string;
  capeColor: 'red' | 'blue' | 'emerald' | 'gold' | 'purple';
  hairColor: 'black' | 'brown' | 'gold' | 'blue';
  hairStyle: string;
  uniformStyle: 'classic' | 'smart' | 'sport';
  accessory: 'none' | 'glasses' | 'armband' | 'star_pin' | 'headphones';
  pose: 'thumbs_up' | 'fist' | 'wave';
}

export const DEFAULT_CUSTOMIZATION: CharacterCustomization = {
  gender: 'boy',
  nickname: 'ฮีโร่ผู้พิทักษ์',
  heroTitle: 'ผู้พิทักษ์เยาวชน',
  capeColor: 'red',
  hairColor: 'black',
  hairStyle: 'spiky',
  uniformStyle: 'classic',
  accessory: 'star_pin',
  pose: 'thumbs_up',
};

export const CAPE_COLORS = [
  { id: 'red', label: 'แดงเพลิงพลังฮีโร่', bg: 'bg-rose-600', ring: 'ring-rose-500', glow: 'shadow-rose-600/50' },
  { id: 'blue', label: 'น้ำเงินไพลินผู้พิทักษ์', bg: 'bg-blue-600', ring: 'ring-blue-500', glow: 'shadow-blue-600/50' },
  { id: 'emerald', label: 'เขียวมรกตธรรมชาติ', bg: 'bg-emerald-600', ring: 'ring-emerald-500', glow: 'shadow-emerald-600/50' },
  { id: 'gold', label: 'ทองอร่ามเกียรติยศ', bg: 'bg-amber-400', ring: 'ring-amber-300', glow: 'shadow-amber-400/50' },
  { id: 'purple', label: 'ม่วงประกายดวงดารา', bg: 'bg-purple-600', ring: 'ring-purple-500', glow: 'shadow-purple-600/50' },
] as const;

export const HAIR_COLORS = [
  { id: 'black', label: 'ดำธรรมชาติ', colorCode: '#1e293b' },
  { id: 'brown', label: 'น้ำตาลเข้ม', colorCode: '#78350f' },
  { id: 'gold', label: 'น้ำตาลทอง', colorCode: '#d97706' },
  { id: 'blue', label: 'น้ำเงินฮีโร่', colorCode: '#2563eb' },
] as const;

export const ACCESSORIES = [
  { id: 'none', label: 'ไม่มีอุปกรณ์เสริม', icon: 'Minus' },
  { id: 'star_pin', label: 'เข็มกลัดดาวทอง', icon: 'Star', bonus: 'ออร่าความกล้าหาญ' },
  { id: 'glasses', label: 'แว่นตาสแกนปัญญา', icon: 'Glasses', bonus: 'ช่วยตัดชอยส์ผิด' },
  { id: 'armband', label: 'ปลอกแขน To Be Number One', icon: 'Award', bonus: 'โบนัสคะแนนมิตรภาพ' },
  { id: 'headphones', label: 'หูฟังดนตรีสร้างสรรค์', icon: 'Headphones', bonus: 'พลังใจเต็มเปี่ยม' },
] as const;
