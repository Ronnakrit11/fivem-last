import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WepayAPI, WepayCallbackData } from '@/lib/wepay';

// POST /api/wepay/callback - รับ callback จาก Wepay1
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const callbackData: WepayCallbackData = {
      dest_ref: formData.get('dest_ref') as string,
      transaction_id: formData.get('transaction_id') as string,
      sms: formData.get('sms') as string || undefined,
      status: formData.get('status') as '2' | '4',
      operator_trxnsid: formData.get('operator_trxnsid') as string || undefined,
    };

    console.log('Wepay Callback Data:', callbackData);

    // ตรวจสอบ callback data
    if (!WepayAPI.validateCallback(callbackData)) {
      console.error('Invalid callback data');
      return new NextResponse(
        WepayAPI.createCallbackResponse(false, 'Invalid callback data'),
        { status: 400 }
      );
    }

    const { dest_ref, transaction_id, sms, status, operator_trxnsid } = callbackData;
    
    // แยก dest_ref เผื่อเป็น mixPackage (format: cleanReference18digits_index)
    // dest_ref เป็น alphanumeric 20 ตัว ที่มาจาก UUID.replace(/-/g, '').substring(0, 20)
    const cleanRef = dest_ref.substring(0, 18); // เอา 18 ตัวแรก
    
    // หา PurchaseGame โดยเปรียบเทียบ UUID ที่ clean แล้ว
    const allPurchaseGames = await prisma.purchaseGame.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // ค้นหาแค่ 24 ชั่วโมงที่แล้ว
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const purchaseGame = allPurchaseGames.find(p => 
      p.id.replace(/-/g, '').substring(0, 20).startsWith(cleanRef)
    );

    if (purchaseGame) {
      // อัพเดท PurchaseGame
      const newStatus = status === '2' ? 'SUCCESS' : 'FAILED';
      
      await prisma.purchaseGame.update({
        where: { id: purchaseGame.id },
        data: {
          status: newStatus,
          wepayTxnId: transaction_id,
          wepayTxnMessage: sms,
          operatorId: operator_trxnsid,
          content: status === '2' ? sms : 'การทำรายการล้มเหลว',
        },
      });

      // ถ้าล้มเหลว คืนเงิน
      if (status === '4') {
        await prisma.user.update({
          where: { id: purchaseGame.userId },
          data: { 
            balance: {
              increment: Number(purchaseGame.paid),
            },
          },
        });
      }

      console.log(`PurchaseGame ${purchaseGame.id} updated to ${newStatus}`);
      return new NextResponse(
        WepayAPI.createCallbackResponse(true, `Updated PurchaseGame ${purchaseGame.id}`),
        { status: 200 }
      );
    }

    // ถ้าไม่ใช่ PurchaseGame ลองหา PurchaseCard
    const allPurchaseCards = await prisma.purchaseCard.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // ค้นหาแค่ 24 ชั่วโมงที่แล้ว
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    const purchaseCard = allPurchaseCards.find(p => 
      p.id.replace(/-/g, '').substring(0, 20) === dest_ref.substring(0, 20)
    );

    if (purchaseCard) {
      // อัพเดท PurchaseCard
      const newStatus = status === '2' ? 'SUCCESS' : 'FAILED';
      
      await prisma.purchaseCard.update({
        where: { id: purchaseCard.id },
        data: {
          status: newStatus,
          wepayTxnId: transaction_id,
          wepayTxnMessage: sms,
          operatorId: operator_trxnsid,
          content: status === '2' ? sms : 'การทำรายการล้มเหลว',
        },
      });

      // ถ้าล้มเหลว คืนเงิน
      if (status === '4') {
        await prisma.user.update({
          where: { id: purchaseCard.userId },
          data: { 
            balance: {
              increment: Number(purchaseCard.paid),
            },
          },
        });
      }

      console.log(`PurchaseCard ${purchaseCard.id} updated to ${newStatus}`);
      return new NextResponse(
        WepayAPI.createCallbackResponse(true, `Updated PurchaseCard ${purchaseCard.id}`),
        { status: 200 }
      );
    }

    // ไม่พบรายการ
    console.error(`Purchase not found for reference: ${dest_ref}`);
    return new NextResponse(
      WepayAPI.createCallbackResponse(false, `Purchase not found for reference: ${dest_ref}`),
      { status: 404 }
    );

  } catch (error) {
    console.error('Error processing Wepay callback:', error);
    return new NextResponse(
      WepayAPI.createCallbackResponse(false, 'Internal server error'),
      { status: 500 }
    );
  }
}
