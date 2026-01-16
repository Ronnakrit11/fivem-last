# WePay Products Sync Script

สคริปต์สำหรับ sync ข้อมูลสินค้าจาก WePay API กับ database

## 📋 วิธีการทำงาน

สคริปต์นี้จะ:

1. **Fetch ข้อมูลจาก WePay API** - ดึงข้อมูลสินค้าทั้งหมดจาก `https://wepay.in.th/comp_export.php?json`

### 🎮 Sync to GAMES:

2. **Sync GTopup (gtopup) → Games** 🎯
   - ✨ **สร้าง `Game` ใหม่อัตโนมัติ** ถ้ายังไม่มีในระบบ (พร้อม `isPlayerId = true`)
   - สร้างหรืออัปเดต `Package` จาก `denomination` ของ WePay
   - อัปเดตราคา `cost` และ `fee`
   - ตัวอย่าง: ROV, Free Fire, Mobile Legends

### 💳 Sync to CARDS:

3. **Sync Mobile Topup (mtopup) → Cards** 📱
   - ✨ **สร้าง `Card` ใหม่อัตโนมัติ** ถ้ายังไม่มีในระบบ
   - สร้างหรืออัปเดต `CardOption` จาก `denomination` ของ WePay
   - อัปเดตราคา `cost` จาก WePay
   - ตัวอย่าง: AIS, DTAC, TrueMove

4. **Sync Billpay → Cards** 💰
   - ✨ **สร้าง `Card` ใหม่อัตโนมัติ** ถ้ายังไม่มีในระบบ
   - สร้าง `CardOption` ใหม่สำหรับ Card ใหม่ (50, 100, 200, 500, 1000 บาท)
   - อัปเดต `CardOption` ที่มีอยู่แล้ว
   - อัปเดตค่าธรรมเนียม `fee`
   - ตัวอย่าง: TrueMoney Wallet, บิลไฟฟ้า, บิลประปา

5. **Sync CashCard → Cards** 🎫
   - ✨ **สร้าง `Card` ใหม่อัตโนมัติ** ถ้ายังไม่มีในระบบ
   - สร้าง `CardOption` ใหม่สำหรับ Card ใหม่ (50, 100, 200, 500, 1000 บาท)
   - อัปเดต `CardOption` สำหรับบัตรเงินสด
   - อัปเดตค่าธรรมเนียมและข้อมูลราคา
   - ตัวอย่าง: Garena Shell, Steam Wallet

## 🚀 การใช้งาน

### 1. ติดตั้ง dependencies (ครั้งแรกเท่านั้น)

```bash
npm install
```

### 2. รันสคริปต์

```bash
npm run sync:wepay
```

## 📊 ข้อมูลที่ Sync

### 🎮 GAMES

#### จาก WePay GTopup (gtopup) → Game Packages

- `company_id` → `Package.gameCode`
- `denomination[].price` → `Package.cost`
- `denomination[].description` → `Package.name`
- `fee` → คำนวณราคาขาย (`price = cost + fee`)

### 💳 CARDS

#### จาก WePay Mobile Topup (mtopup) → Card Options

- `company_id` → `CardOption.gameCode`
- `denomination[].price` → `CardOption.cost`
- `denomination[].description` → `CardOption.name`
- `fee` → คำนวณราคาขาย (`price = cost + fee`)

#### จาก WePay Billpay → Card Options

- `company_id` → `CardOption.gameCode`
- `fee` → อัปเดตค่าธรรมเนียม
- `minimum_amount` / `maximum_amount` → สำหรับตรวจสอบและสร้าง options

#### จาก WePay CashCard → Card Options

- `company_id` → `CardOption.gameCode`
- `fee` → อัปเดตค่าธรรมเนียม
- `minimum_amount` / `maximum_amount` → สำหรับตรวจสอบและสร้าง options

## ⚙️ การตั้งค่า

### ต้องมีข้อมูลในฐานข้อมูลก่อน

#### สำหรับ Games
```sql
-- ตัวอย่าง: เติมเงิน AIS
INSERT INTO game (id, name, icon, isActive) 
VALUES (uuid(), 'เติมเงิน AIS', '/icons/ais.png', true);

INSERT INTO package (id, gameId, gameCode, name, cost, price)
VALUES (uuid(), [gameId], '12CALL', 'เติมเงิน AIS 10 บาท', 10, 10);
```

#### สำหรับ Cards
```sql
-- ตัวอย่าง: บัตรเติมเงิน TrueMoney
INSERT INTO card (id, name, icon, isActive)
VALUES (uuid(), 'TrueMoney Wallet', '/icons/truemoney.png', true);

INSERT INTO card_option (id, cardId, gameCode, name, cost, price)
VALUES (uuid(), [cardId], 'TMW', 'TrueMoney 50 บาท', 50, 50);
```

## 📝 Output ตัวอย่าง

### กรณีรันครั้งแรก (สร้าง Game/Card ใหม่):

```
🚀 Starting WePay Products Sync...

✅ Fetched WePay data successfully
   Mobile Topup products: 3
   GTopup products: 10
   Billpay products: 150
   CashCard products: 5

🎯 Syncing GTopup to Games...

➕ Creating new game for: Garena RoV (Thailand)
   ✅ Game created: Garena RoV (Thailand)
   + Created package: ROV 100 เพชร (35฿)
   + Created package: ROV 500 เพชร (175฿)

📊 GTopup Summary:
   Games created: 2
   Games updated: 0
   Packages created: 15
   Packages updated: 0

📱 Syncing Mobile Topup to Cards...

➕ Creating new card for: เอไอเอส วัน-ทู-คอล!
   ✅ Card created: เอไอเอส วัน-ทู-คอล!
   + Created option: เอไอเอส 10 บาท (10฿)
   + Created option: เอไอเอส 20 บาท (20฿)
   + Created option: เอไอเอส 50 บาท (50฿)

📊 Mobile Topup Summary:
   Cards created: 1
   Cards updated: 0
   Options created: 24
   Options updated: 0

💳 Syncing Billpay to Cards...

➕ Creating new card for: ทรูมันนี่ วอลเล็ท
   ✅ Card created: ทรูมันนี่ วอลเล็ท
   ➕ Creating default options for ทรูมันนี่ วอลเล็ท
      + Created option: 50 บาท
      + Created option: 100 บาท
      + Created option: 200 บาท

📊 Billpay Summary:
   Cards created: 1
   Cards updated: 0
   Options created: 5
   Options updated: 0

💰 Syncing CashCard to Cards...

➕ Creating new card for: Garena Cash Card
   ✅ Card created: Garena Cash Card
   ➕ Creating default options for Garena Cash Card
      + Created option: 50 บาท
      + Created option: 100 บาท

📊 CashCard Summary:
   Cards created: 1
   Cards updated: 0
   Options created: 3
   Options updated: 0

✨ Sync completed!
```

### กรณีรันครั้งถัดไป (อัปเดตข้อมูล):

```
🚀 Starting WePay Products Sync...

✅ Fetched WePay data successfully
   Mobile Topup products: 3
   GTopup products: 10
   Billpay products: 150
   CashCard products: 5

📱 Syncing Mobile Topup to Cards...

✅ Found card: เอไอเอส วัน-ทู-คอล! for เอไอเอส วัน-ทู-คอล!
   ↻ Updated option: เอไอเอส 10 บาท (10฿)
   + Created option: เอไอเอส 100 บาท (100฿)

📊 Mobile Topup Summary:
   Cards created: 0
   Cards updated: 1
   Options created: 1
   Options updated: 23

✨ Sync completed!
```

## ⚠️ ข้อควรระวัง

1. **gameCode ต้องตรงกัน** - ต้องตั้งค่า `Package.gameCode` หรือ `CardOption.gameCode` ให้ตรงกับ `company_id` จาก WePay

2. **ราคาจะถูกอัปเดต** - `cost` จะถูกอัปเดตจาก WePay ทุกครั้งที่รัน script

3. **Package ใหม่จะถูกสร้าง** - ถ้า WePay เพิ่ม denomination ใหม่ จะมีการสร้าง Package ใหม่อัตโนมัติ

4. **ไม่ลบข้อมูล** - Script จะไม่ลบ Package หรือ CardOption ที่มีอยู่แล้ว

## 🔧 Troubleshooting

### ไม่พบ Game/Card
```
⚠️  No game found for company_id: 12CALL (เอไอเอส วัน-ทู-คอล!)
```
**แก้ไข**: สร้าง Game และ Package ที่มี `gameCode = "12CALL"` ก่อน

### Error: fetch failed
```
❌ Failed to fetch WePay data
```
**แก้ไข**: ตรวจสอบ internet connection หรือ WePay API อาจจะ down

## 📅 ควร Sync บ่อยแค่ไหน?

แนะนำ sync:
- **ทุกวัน** - เพื่ออัปเดตราคาและโปรโมชั่นใหม่
- **เมื่อเพิ่มเกม/บัตรใหม่** - หลังจากสร้าง Game/Card ใหม่ในระบบ
- **เมื่อมีปัญหาราคา** - ถ้าพบราคาไม่ตรง

## 🔄 ตั้งเวลา Auto Sync (Optional)

### ใช้ Cron Job (Linux/Mac)
```bash
# Edit crontab
crontab -e

# Sync ทุกวันเวลา 3:00 AM
0 3 * * * cd /path/to/project && npm run sync:wepay >> /var/log/wepay-sync.log 2>&1
```

### ใช้ Task Scheduler (Windows)
1. เปิด Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 3:00 AM
4. Action: Start Program
5. Program: `cmd.exe`
6. Arguments: `/c cd C:\path\to\project && npm run sync:wepay`

## 📄 ตัวอย่างโครงสร้างข้อมูล WePay API

ดูตัวอย่างโครงสร้างข้อมูลที่ `scripts/wepay-example.json`

### ประเภทข้อมูล:

#### 🎮 GAMES:

1. **gtopup** - เติมเกม (ROV, Free Fire, Mobile Legends)
   - มี `denomination` array พร้อม description
   - ใช้กับ **Games** ที่เป็นการเติมเกม
   - จะมี Player ID field

#### 💳 CARDS:

2. **mtopup** - เติมเงินมือถือ (AIS, DTAC, TrueMove)
   - มี `denomination` array สำหรับราคาต่างๆ
   - ใช้กับ **Cards** ที่เป็นการเติมเงินมือถือ

3. **billpay** - ชำระบิล (TrueMoney, ไฟฟ้า, ประปา)
   - มี `refs` สำหรับ reference fields
   - ใช้กับ **Cards** ที่เป็นการชำระบิล

4. **cashcard** - บัตรเงินสด (Garena, Steam, Google Play)
   - ไม่มี `denomination` (ระบุราคาได้เอง)
   - ใช้กับ **Cards** ที่เป็นบัตรเติมเงิน

## 🔗 Links

- [WePay API](https://wepay.in.th/comp_export.php?json)
- [Prisma Docs](https://www.prisma.io/docs)
