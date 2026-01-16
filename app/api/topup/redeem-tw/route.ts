import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

interface RedeemRequest {
  url: string;
}

function parseVoucherCode(input: string): string | null {
  try {
    // Try parse as URL and extract v= param
    const u = new URL(input);
    const v = u.searchParams.get("v");
    if (v) return v;

    // Try path style .../vouchers/{code}/...
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p.toLowerCase() === "vouchers");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1] ?? null;
  } catch {
    // Not a URL, assume raw code
    if (input && input.length >= 10) return input;
  }
  return null;
}

async function redeemVoucher(code: string, mobile: string) {
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

  const redeemUrl = `https://tw.temp-th.net/gift-truewallet/redeem`;

  const res = await fetch(redeemUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": userAgent,
    },
    body: JSON.stringify({ mobile, code }),
  });

  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, data };
  }
  return { ok: true, data };
}

export async function POST(request: Request) {
    // Check authentication
    const session = await auth.api.getSession({
    headers: request.headers,
    });

    if (!session?.user) {
    return NextResponse.json(
        { error: "Unauthorized", message: "กรุณาเข้าสู่ระบบ" },
        { status: 401 }
    );
    }

  let body: RedeemRequest;
  try {
    body = (await request.json()) as RedeemRequest;
  } catch {
    return NextResponse.json(
      { success: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { success: false, error: "กรุณาระบุลิงก์อั่งเปาทรูวอเล็ท" },
      { status: 400 }
    );
  }

  const code = parseVoucherCode(url);
  if (!code) {
    return NextResponse.json(
      { success: false, error: "ลิงก์ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" },
      { status: 400 }
    );
  }

  const mobile = process.env.TW_VOUCHER_PHONE;
  if (!mobile) {
    return NextResponse.json(
      {
        success: false,
        error:
          "ระบบยังไม่ได้ตั้งค่าเบอร์ทรูมันนี่ (TW_VOUCHER_PHONE) โปรดติดต่อผู้ดูแลระบบ",
      },
      { status: 500 }
    );
  }

  try {
    const result = await redeemVoucher(code, mobile);
    type TrueWalletRedeemResponse = {
      status?: { code?: string };
      data?: { voucher?: { redeemed_amount_baht?: string } };
      message?: string;
    };

    const data = result.data as TrueWalletRedeemResponse;
    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.message ?? "ไม่สามารถใช้ซองอั่งเปานี้ได้ กรุณาลองใหม่",
          detail: data,
        },
        { status: 400 }
      );
    }
    if (data?.status?.code !== "SUCCESS") {
      return NextResponse.json(
        { success: false, error: "ไม่สามารถใช้ซองอั่งเปานี้ได้" },
        { status: 400 }
      );
    }

    // Parse amount (baht), minus 2.3%
    let amount = 0;
    try {
      const str = String(data.data?.voucher?.redeemed_amount_baht ?? "0").replace(
        /,/g,
        ""
      );
      amount = Number(str);
    } catch {
      amount = 0;
    }

    amount = amount - (2.9 / 100) * amount;
    amount = Math.max(0, Math.floor(amount * 100) / 100); // floor to 2 decimals

    if (amount < 1) {
      return NextResponse.json(
        { success: false, error: "เกิดข้อผิดพลาด กรุณาติดต่อแอดมิน" },
        { status: 400 }
      );
    }

    // Credit user and create transaction
    const resultTx = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
          where: { id: session.user.id },
          data: {
            balance: {
              increment: amount
            }
          }
        });

      await tx.redeemHistory.create({
        data: {
          userId: session.user.id,
          amount: amount,
          redeemedAt: new Date(),
          payloadHash: code,
        },
      });

      return { newBalance: Number(updated.balance) };
    });

    const updatedUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true }
      });

      return NextResponse.json({
        success: true,
        message: 'เติมเงินสำเร็จ ' + amount + ' บาท',
        data: {
          amount,
          newBalance: updatedUser?.balance || 0
        }
      });
  } catch (error) {
    console.error("TrueWallet redeem error:", error);
    return NextResponse.json(
      { success: false, error: "ไม่สามารถทำรายการได้ กรุณาลองใหม่" },
      { status: 500 }
    );
  }
}