# ภารกิจพิชิตยาเสพติด (Drug-Free Hero)

เกมออนไลน์ 2 มิติ แนวผจญภัยและตอบคำถาม เพื่อรณรงค์ต่อต้านยาเสพติด สำหรับนักเรียนระดับมัธยมศึกษา พัฒนาด้วย React, TypeScript, Tailwind CSS, และ Vite

---

## 🛠️ วิธีแก้ไขปัญหา GitHub Pages Deploy ไม่ผ่าน (Failing after 8s)

หากคุณพบข้อผิดพลาด `Deploy to GitHub Pages / deploy (push) Failing after 8s`:
สาเหตุหลักเกิดจาก:
1. การตั้งค่า Source ในหน้า Settings ของ GitHub ยังเป็น **Deploy from a branch** แทนที่จะเป็น **GitHub Actions**
2. การรัน `npm ci` ใน GitHub Actions ขาดไฟล์ `package-lock.json`

**วิธีแก้ไข:**
1. ตอนนี้ระบบได้สร้างไฟล์ `package-lock.json` และปรับปรุงสคริปต์ `.github/workflows/deploy.yml` ให้รองรับการติดตั้งอัตโนมัติเรียบร้อยแล้ว
2. ให้คุณทำตามขั้นตอนด้านล่างนี้ได้เลย:

---

## 🚀 ขั้นตอนการเปิดใช้งาน GitHub Pages ให้สำเร็จ 100%

### ขั้นตอนที่ 1: อัปเดตโค้ดขึ้น GitHub
เปิด Terminal/Command Prompt ในเครื่องของคุณที่โฟลเดอร์โปรเจกต์ แล้วรันคำสั่ง:
```bash
git add .
git commit -m "Fix GitHub Pages deployment and add package-lock.json"
git push
```

### ขั้นตอนที่ 2: ตั้งค่า Source เป็น "GitHub Actions" (สำคัญมาก ⭐)
1. เข้าไปที่หน้า Repository ของคุณบน GitHub
2. คลิกแท็บ **Settings** ด้านบน
3. ที่เมนูด้านซ้าย เลือก **Pages**
4. ตรงหัวข้อ **Build and deployment**:
   - ที่ช่อง **Source** ให้คลิกเลือกเปลี่ยนเป็น **GitHub Actions** (ห้ามเลือก Deploy from a branch)
5. เมื่อเลือกเป็น GitHub Actions แล้ว ระบบจะเชื่อมโยงกับ `.github/workflows/deploy.yml` ที่เราตั้งค่าไว้โดยอัตโนมัติ

### ขั้นตอนที่ 3: ตรวจสอบและรับลิงก์เข้าเล่นเกม
1. คลิกแท็บ **Actions** ด้านบนของ GitHub
2. คุณจะเห็น workflow **Deploy to GitHub Pages** กำลังทำงานและขึ้นเครื่องหมายถูกสีเขียว (✅)
3. เมื่อเสร็จสิ้น (ประมาณ 1 นาที) ให้กลับไปที่แท็บ **Settings > Pages** จะเห็นแถบสีเขียวพร้อมลิงก์เว็บไซต์ เช่น:
   👉 **`https://<ชื่อผู้ใช้ของคุณ>.github.io/<ชื่อRepositoryของคุณ>/`**
4. คลิกเข้าไปเล่นเกมได้ทันที!
