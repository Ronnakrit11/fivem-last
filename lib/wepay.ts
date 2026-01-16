// Wepay API Integration Utility
// Based on Wepay API Documentationss

export interface WepayConfig {
  username: string;
  password: string;
  callbackUrl: string;
}

export interface WepayTopupRequest {
  username: string;
  password: string;
  resp_url: string;
  dest_ref: string;
  type: 'mtopup' | 'cashcard' | 'gtopup';
  pay_to_amount: number;
  pay_to_company: string;
  pay_to_ref1: string;
  pay_to_ref2?: string;
  pay_to_ref3?: string;
  pay_to_barcode1?: string;
}

export interface WepayTopupResponse {
  bill_id?: number;
  code: string;
  transaction_id?: number;
  queue_id?: number;
  total_amount?: number;
  balance?: number;
  desc?: string;
}

export interface WepayCallbackData {
  dest_ref: string;
  transaction_id: string;
  sms?: string;
  status: '2' | '4'; // 2 = success, 4 = failed
  operator_trxnsid?: string;
}

// Partial type for Wepay product detail response
// We currently use only the `discount` field in our code
export interface WepayProductDetail {
  discount?: number | string;
  [key: string]: unknown;
}

export class WepayAPI {
  private config: WepayConfig;
  private baseUrl = process.env.WEPAY_BASE_URL || 'https://gateway-wp.xyz';

  constructor(config: WepayConfig) {
    this.config = config;
  }

  async topupGame(params: {
    amount: number;
    uid: string;
    server?: string;
    company: string;
    reference: string;
  }): Promise<WepayTopupResponse> {
    const requestData: WepayTopupRequest = {
      username: this.config.username,
      password: this.config.password,
      resp_url: this.config.callbackUrl,
      dest_ref: params.reference,
      type: 'gtopup',
      pay_to_amount: params.amount,
      pay_to_company: params.company,
      pay_to_ref1: params.uid,
      ...(params.server ? { pay_to_ref2: params.server } : {}),
    };

    return this.sendRequest(requestData);
  }

  /**
   * ส่งคำขอเติมเงินมือถือไปยัง Wepay
   */
  async topupMobile(params: {
    amount: number;
    phoneNumber: string;
    company: string;
    reference: string;
  }): Promise<WepayTopupResponse> {
    const requestData: WepayTopupRequest = {
      username: this.config.username,
      password: this.config.password,
      resp_url: this.config.callbackUrl,
      dest_ref: params.reference,
      type: 'mtopup',
      pay_to_amount: params.amount,
      pay_to_company: params.company,
      pay_to_ref1: params.phoneNumber,
    };

    return this.sendRequest(requestData);
  }

  /**
   * ส่งคำขอซื้อบัตรเงินสดไปยัง Wepay
   */
  async buyCashCard(params: {
    amount: number;
    company: string;
    reference: string;
  }): Promise<WepayTopupResponse> {
    const requestData: WepayTopupRequest = {
      username: this.config.username,
      password: this.config.password,
      resp_url: this.config.callbackUrl,
      dest_ref: params.reference,
      type: 'cashcard',
      pay_to_amount: params.amount,
      pay_to_company: params.company,
      pay_to_ref1: '0000000000', // Fixed for cash card
    };

    return this.sendRequest(requestData);
  }

  /**
   * ดึงข้อมูลรายละเอียดสินค้าจาก Wepay
   */
  async productDetail(companyId: string): Promise<WepayProductDetail> {
    try {
      const formBody = new URLSearchParams();
      formBody.append('username', this.config.username);
      formBody.append('password', this.config.password);
      formBody.append('type', 'gtopup');
      formBody.append('pay_to_company', companyId);
      formBody.append('payee_info', 'true');

      const response = await fetch(`${this.baseUrl}/client_api.json.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = (await response.json()) as WepayProductDetail;
      return result;
    } catch (error) {
      console.error('Wepay Product Detail API Error:', error);
      throw new Error('Failed to fetch product details from Wepay API');
    }
  }

  /**
   * ส่ง HTTP Request ไปยัง Wepay API
   */
  private async sendRequest(data: WepayTopupRequest): Promise<WepayTopupResponse> {
    try {
      const formBody = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formBody.append(key, String(value));
        }
      });

      // for (const [key, value] of formBody) {
      //   console.log(`${key}: ${value}`);
      // }

      // console.log("Full URL: ", `${this.baseUrl}`);

      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        console.log("response game: ", await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: WepayTopupResponse = await response.json();

      // console.log("response game: ",result);

      return result;
    } catch (error) {
      console.error('Wepay API Error:', error);
      throw new Error('Failed to connect to Wepay API');
    }
  }

  /**
   * ตรวจสอบ callback response จาก Wepay
   */
  static validateCallback(data: WepayCallbackData): boolean {
    return !!(
      data.dest_ref &&
      data.transaction_id &&
      data.status &&
      (data.status === '2' || data.status === '4')
    );
  }

  /**
   * สร้าง callback response ที่จะส่งกลับไปยัง Wepay
   */
  static createCallbackResponse(success: boolean, message: string): string {
    if (success) {
      return `SUCCEED|${message}`;
    } else {
      return `ERROR|${message}`;
    }
  }
}

/**
 * Get Wepay API instance
 */
export function getWepayAPI(): WepayAPI {
  const config: WepayConfig = {
    username: process.env.WEPAY_USERNAME || '',
    password: process.env.WEPAY_PASSWORD || '',
    callbackUrl: process.env.WEPAY_CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/wepay/callback`,
  };

  if (!config.username || !config.password) {
    throw new Error('Wepay credentials not configured');
  }

  return new WepayAPI(config);
}
