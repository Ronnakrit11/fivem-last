import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import crypto from "crypto";

const API_URL = 'https://developer.easyslip.com/api/v1/verify';
const API_KEY = process.env.EASYSLIP_API_KEY;


const EXPECTED_RECEIVER = {
  name: {
    th: "นาย ณพล อ",
    thShort: "นาย ณพล อ",
    thPartial: "นาย ณพล อ",
    en: "NAPHON I",
    enPartial: "NAPHON I"
  },

  account: "781-255111-8",
  accountIdentifiers: ["1118", "5111", "2551", "781", "7812"],
  type: "BANKAC" as const
};

// Define response type according to EasySlip API
type EasySlipResponse = {
  status: number;
  data?: {
    payload: string;
    transRef: string;
    date: string;
    countryCode: string;
    amount: {
      amount: number;
      local: {
        amount?: number;
        currency?: string;
      };
    };
    fee?: number;
    ref1?: string;
    ref2?: string;
    ref3?: string;
    sender: {
      bank: {
        id: string;
        name?: string;
        short?: string;
      };
      account: {
        name: {
          th?: string;
          en?: string;
        };
        bank?: {
          type: 'BANKAC' | 'TOKEN' | 'DUMMY';
          account: string;
        };
        proxy?: {
          type: 'NATID' | 'MSISDN' | 'EWALLETID' | 'EMAIL' | 'BILLERID';
          account: string;
        };
      };
    };
    receiver: {
      bank: {
        id: string;
        name?: string;
        short?: string;
      };
      account: {
        name: {
          th?: string;
          en?: string;
        };
        bank?: {
          type: 'BANKAC' | 'TOKEN' | 'DUMMY';
          account: string;
        };
        proxy?: {
          type: 'NATID' | 'MSISDN' | 'EWALLETID' | 'EMAIL' | 'BILLERID';
          account: string;
        };
      };
      merchantId?: string;
    };
  };
  message?: string;
}

function validateReceiver(data: EasySlipResponse): boolean {
  if (!data.data?.receiver?.account) {
    console.log('No receiver account data found');
    return false;
  }

  const receiver = data.data.receiver.account;
  console.log('Validating receiver:', JSON.stringify(receiver, null, 2));

  // Check bank account type
  if (receiver.bank?.type !== EXPECTED_RECEIVER.type) {
    console.log('Account type mismatch:', receiver.bank?.type, 'vs expected:', EXPECTED_RECEIVER.type);
    return false;
  }

  // Check receiver name - accept full name, truncated name, or partial match from bank
  // First try to validate Thai name if available
  if (receiver.name?.th) {
    const thName = receiver.name.th;
    if (thName !== EXPECTED_RECEIVER.name.th && 
        thName !== EXPECTED_RECEIVER.name.thShort && 
        !thName.startsWith(EXPECTED_RECEIVER.name.thPartial)) {
      console.log('Thai name mismatch:', thName);
      
      // If Thai name doesn't match, try English name as fallback
      if (receiver.name?.en) {
        const enName = receiver.name.en;
        if (enName === EXPECTED_RECEIVER.name.en || 
            enName.startsWith(EXPECTED_RECEIVER.name.enPartial)) {
          console.log('English name match:', enName);
        } else {
          console.log('English name mismatch:', enName);
          return false;
        }
      } else {
        return false;
      }
    }
  } 
  // If no Thai name, try English name
  else if (receiver.name?.en) {
    const enName = receiver.name.en;
    if (enName !== EXPECTED_RECEIVER.name.en && 
        !enName.startsWith(EXPECTED_RECEIVER.name.enPartial)) {
      console.log('English name mismatch:', enName);
      return false;
    }
  } 
  else {
    console.log('No name provided (neither Thai nor English)');
    return false;
  }

  // Check bank account number
  if (receiver.bank?.account) {
    const accountNumber = receiver.bank.account;
    
    // Handle masked account numbers (e.g., "XXX-X-XX271-7")
    // Extract only the visible digits (non-X digits)
    const visibleDigits = accountNumber.replace(/[^0-9]/g, '');
    const expectedAccountClean = EXPECTED_RECEIVER.account.replace(/[^0-9]/g, '');
    
    // Check if visible digits match the end of expected account
    // or if it contains any of the expected identifiers
    const endsWithVisibleDigits = expectedAccountClean.endsWith(visibleDigits);
    const hasValidIdentifier = EXPECTED_RECEIVER.accountIdentifiers.some(id => {
      const cleanId = id.replace(/[^0-9]/g, '');
      return visibleDigits.includes(cleanId) || expectedAccountClean.includes(cleanId);
    });
    
    if (!endsWithVisibleDigits && !hasValidIdentifier) {
      console.log('Account number mismatch:', accountNumber, 'should match expected account or contain one of:', EXPECTED_RECEIVER.accountIdentifiers);
      return false;
    }
    
    console.log('Account number validated:', accountNumber);
  } else {
    console.log('No account number provided');
    return false;
  }

  console.log('Receiver validation passed');
  return true;
}

function createPayloadHash(base64Image: string): string {
  return crypto.createHash('sha256').update(base64Image).digest('hex');
}

async function checkSlipAlreadyUsedByPayload(payloadHash: string): Promise<boolean> {
  const existingSlip = await prisma.verifiedSlip.findUnique({
    where: { payloadHash }
  });
  return !!existingSlip;
}

async function checkSlipAlreadyUsedByTransRef(transRef: string): Promise<boolean> {
  const existingSlip = await prisma.verifiedSlip.findUnique({
    where: { transRef }
  });
  return !!existingSlip;
}

export async function POST(request: NextRequest) {
  try {
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

    // Check API key
    if (!API_KEY) {
      console.error('EASYSLIP_API_KEY not configured');
      return NextResponse.json(
        { error: 'API configuration error', message: 'ระบบไม่พร้อมใช้งาน' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('slip') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'invalid_payload', message: 'กรุณาแนบสลิปโอนเงิน' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'image_size_too_large', message: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 10MB)' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'invalid_image', message: 'ไฟล์ต้องเป็นรูปภาพเท่านั้น' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Create payload hash for duplicate detection (ประหยัดโควต้า)
    const payloadHash = createPayloadHash(base64);
    
    // ตรวจสอบว่าเคยใช้สลิปนี้แล้วหรือไม่ (ก่อนเรียก EasySlip API)
    const isPayloadUsed = await checkSlipAlreadyUsedByPayload(payloadHash);
    if (isPayloadUsed) {
      console.log('Slip already used (detected by payload hash)');
      return NextResponse.json(
        {
          error: 'slip_already_used',
          message: 'สลิปนี้เคยถูกใช้ไปแล้ว',
          details: 'This transfer slip has already been used'
        },
        { status: 400 }
      );
    }

    // เรียก EasySlip API เพื่อตรวจสอบสลิป
    console.log('Calling EasySlip API...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}` 
      },
      body: JSON.stringify({
        image: base64
      }),
      cache: 'no-store',
    });

    const data: EasySlipResponse = await response.json();

    // Handle API errors
    if (!response.ok) {
      console.error('EasySlip API error:', data);
      return NextResponse.json(
        { 
          error: 'verification_failed',
          message: data.message || 'ไม่สามารถตรวจสอบสลิปได้',
          ...data
        },
        { status: response.status }
      );
    }

    // Validate receiver information
    if (!validateReceiver(data)) {
      return NextResponse.json(
        { 
          error: 'invalid_receiver',
          message: 'ผู้รับเงินไม่ถูกต้อง',
          details: `โอนเงินไปที่ ${EXPECTED_RECEIVER.name.th} เท่านั้น`
        },
        { status: 400 }
      );
    }

    // Check if slip has already been used (by transRef)
    if (data.data?.transRef) {
      const isTransRefUsed = await checkSlipAlreadyUsedByTransRef(data.data.transRef);
      if (isTransRefUsed) {
        return NextResponse.json(
          {
            error: 'slip_already_used',
            message: 'สลิปนี้เคยถูกใช้ไปแล้ว',
            details: 'This transfer slip has already been used'
          },
          { status: 400 }
        );
      }

      // Record verified slip and update balance
      const amount = data.data.amount.amount;
      
      await prisma.$transaction(async (tx) => {
        // Record the verified slip
        await tx.verifiedSlip.create({
          data: {
            payloadHash,
            transRef: data.data!.transRef,
            amount,
            userId: session.user.id,
          }
        });

        // Update user balance
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            balance: {
              increment: amount
            }
          }
        });
      });

      // Get updated balance
      const updatedUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true }
      });

      return NextResponse.json({
        success: true,
        message: 'เติมเงินสำเร็จ!',
        data: {
          amount,
          transRef: data.data.transRef,
          date: data.data.date,
          newBalance: updatedUser?.balance || 0
        }
      });
    }

    return NextResponse.json(
      { error: 'invalid_response', message: 'ข้อมูลจาก EasySlip ไม่สมบูรณ์' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error verifying slip:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    );
  }
}