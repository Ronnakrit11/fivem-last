# Cloudflare Turnstile Setup

## Environment Variables

เพิ่ม environment variables ต่อไปนี้ใน `.env` ของคุณ:

```env
# Cloudflare Turnstile (สำหรับป้องกันบอทในการสมัครสมาชิก)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAB8fEpSF7UwaEzjf
TURNSTILE_SECRET_KEY=0x4AAAAAAB8fEq4iO4PDxI-mHt2_aL2Us8g
```

## คำอธิบาย

- **NEXT_PUBLIC_TURNSTILE_SITE_KEY**: Site Key ที่ใช้บน client-side (frontend)
  - ต้องขึ้นต้นด้วย `NEXT_PUBLIC_` เพื่อให้ Next.js expose ให้ browser เข้าถึงได้
  - จะถูกใช้ใน Turnstile widget ในหน้า auth

- **TURNSTILE_SECRET_KEY**: Secret Key ที่ใช้บน server-side (backend)
  - ใช้สำหรับ verify token กับ Cloudflare API
  - **ห้ามเปิดเผยหรือ commit ลง git**

## การตั้งค่า

1. เพิ่มค่าใน `.env`:
   ```bash
   echo 'NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAB8fEpSF7UwaEzjf' >> .env
   echo 'TURNSTILE_SECRET_KEY=0x4AAAAAAB8fEq4iO4PDxI-mHt2_aL2Us8g' >> .env
   ```

2. Restart development server:
   ```bash
   pnpm dev
   ```

## Security Best Practices

✅ **ควรทำ:**
- เก็บ Secret Key ใน `.env` เสมอ
- ตรวจสอบว่า `.env` อยู่ใน `.gitignore`
- ใช้ environment variables ที่แตกต่างกันระหว่าง development และ production

❌ **ไม่ควรทำ:**
- Hardcode keys ในโค้ด
- Commit `.env` ลง git
- แชร์ Secret Key ใน public repositories
