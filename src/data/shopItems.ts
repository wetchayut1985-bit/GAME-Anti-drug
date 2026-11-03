export interface ShopItem {
  id: string;
  name: string;
  category: 'powerup' | 'gear' | 'title' | 'frame';
  price: number;
  description: string;
  perkText: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const SHOP_ITEMS: ShopItem[] = [
  // Power-ups
  {
    id: 'powerup_cut_choice',
    name: 'แว่นตาสแกนปัญญา',
    category: 'powerup',
    price: 25,
    description: 'แว่นตาเรดาร์วิเคราะห์ข้อเท็จจริง ตัดตัวเลือกที่ผิดออก 1 ชอยส์ทันทีในด่านควิซ',
    perkText: 'ตัดชอยส์ผิด 1 ตัวเลือกในด่านที่ 1',
    iconName: 'Glasses',
    rarity: 'rare',
  },
  {
    id: 'powerup_extra_time',
    name: 'นาฬิกายืดเวลาฮีโร่',
    category: 'powerup',
    price: 30,
    description: 'นาฬิกาควอนตัมพลังบวก เพิ่มเวลาในการคิดและตัดสินใจ +10 วินาทีในทุกด่าน',
    perkText: 'เพิ่มเวลา +10 วินาที',
    iconName: 'Hourglass',
    rarity: 'rare',
  },
  {
    id: 'powerup_combo_guard',
    name: 'เกราะพิทักษ์คอมโบ',
    category: 'powerup',
    price: 35,
    description: 'เกราะสนามพลังคุ้มกันสตรีค ป้องกันคอมโบหลุดเมื่อตอบผิด 1 ครั้ง',
    perkText: 'รักษาสตรีคคอมโบได้ 1 ครั้ง',
    iconName: 'ShieldAlert',
    rarity: 'epic',
  },

  // Gear & Accessories
  {
    id: 'cape_gold',
    name: 'ผ้าคลุมเกียรติยศสีทอง',
    category: 'gear',
    price: 50,
    description: 'ผ้าคลุมฮีโร่สีทองอร่าม เสริมพลังใจและความสง่างามในการปฏิบัติภารกิจ',
    perkText: 'เพิ่มโบนัสคะแนนภารกิจ +15%',
    iconName: 'Sparkles',
    rarity: 'epic',
  },
  {
    id: 'armband_tobeno1',
    name: 'ปลอกแขนผู้นำ To Be Number One',
    category: 'gear',
    price: 40,
    description: 'ปลอกแขนเยาวชนแกนนำต้านยาเสพติด แสดงจุดยืนหนักแน่นเพื่อสังคมสีขาว',
    perkText: 'ปลดล็อกสัญลักษณ์ผู้นำบนบัตรฮีโร่',
    iconName: 'Award',
    rarity: 'rare',
  },
  {
    id: 'pin_diamond',
    name: 'เข็มกลัดเพชรผู้พิทักษ์',
    category: 'gear',
    price: 70,
    description: 'เข็มกลัดเกียรติยศสูงสุด สลักตราดาวแห่งความกล้าหาญ',
    perkText: 'ออร่าประกายดาวระยิบระยับ',
    iconName: 'Gem',
    rarity: 'legendary',
  },

  // Titles
  {
    id: 'title_guardian',
    name: 'ฉายา: ผู้พิทักษ์เยาวชน',
    category: 'title',
    price: 20,
    description: 'ฉายาทางการสำหรับนักเรียนที่มีความรู้และพร้อมช่วยเหลือเพื่อน',
    perkText: 'แสดงฉายา "ผู้พิทักษ์เยาวชน" บนโปรไฟล์',
    iconName: 'Shield',
    rarity: 'common',
  },
  {
    id: 'title_legend',
    name: 'ฉายา: สุดยอดฮีโร่ไร้พ่าย',
    category: 'title',
    price: 60,
    description: 'ฉายาเกียรติยศสำหรับผู้พิชิตทุกด่านด้วยคะแนนระดับทองคำ',
    perkText: 'แสดงฉายา "สุดยอดฮีโร่ไร้พ่าย" สีทอง',
    iconName: 'Crown',
    rarity: 'legendary',
  },
  {
    id: 'title_ambassador',
    name: 'ฉายา: ทูตเยาวชนหัวใจสีขาว',
    category: 'title',
    price: 45,
    description: 'ฉายาตัวแทนคนรุ่นใหม่ผู้เป็นกระบอกเสียงสร้างชุมชนสีขาว',
    perkText: 'แสดงฉายา "ทูตเยาวชนหัวใจสีขาว"',
    iconName: 'Heart',
    rarity: 'epic',
  },

  // Profile Frames
  {
    id: 'frame_gold',
    name: 'กรอบทองคำประกายดาว',
    category: 'frame',
    price: 35,
    description: 'กรอบรูปโปรไฟล์สีทองแวววาว ตกแต่งด้วยดวงดาราระยิบระยับ',
    perkText: 'กรอบสีทองรอบรูปโปรไฟล์',
    iconName: 'Sparkle',
    rarity: 'rare',
  },
  {
    id: 'frame_neon',
    name: 'กรอบออร่าพลังสีคราม',
    category: 'frame',
    price: 45,
    description: 'กรอบแสงนีออนออร่าพลังฮีโร่แห่งอนาคต เพิ่มความโดดเด่น',
    perkText: 'กรอบไฟนีออนพัลส์สีฟ้า-เขียว',
    iconName: 'Zap',
    rarity: 'epic',
  },
];
