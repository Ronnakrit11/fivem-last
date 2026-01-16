"use strict";
// Wepay API Integration Utility
// Based on Wepay API Documentation
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WepayAPI = void 0;
exports.getWepayAPI = getWepayAPI;
var WepayAPI = /** @class */ (function () {
    function WepayAPI(config) {
        this.baseUrl = 'https://www.wepay.in.th';
        this.config = config;
    }
    WepayAPI.prototype.topupGame = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData;
            return __generator(this, function (_a) {
                requestData = __assign({ username: this.config.username, password: this.config.password, resp_url: this.config.callbackUrl, dest_ref: params.reference, type: 'gtopup', pay_to_amount: params.amount, pay_to_company: params.company, pay_to_ref1: params.uid }, (params.server ? { pay_to_ref2: params.server } : {}));
                return [2 /*return*/, this.sendRequest(requestData)];
            });
        });
    };
    /**
     * ส่งคำขอเติมเงินมือถือไปยัง Wepay
     */
    WepayAPI.prototype.topupMobile = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData;
            return __generator(this, function (_a) {
                requestData = {
                    username: this.config.username,
                    password: this.config.password,
                    resp_url: this.config.callbackUrl,
                    dest_ref: params.reference,
                    type: 'mtopup',
                    pay_to_amount: params.amount,
                    pay_to_company: params.company,
                    pay_to_ref1: params.phoneNumber,
                };
                return [2 /*return*/, this.sendRequest(requestData)];
            });
        });
    };
    /**
     * ส่งคำขอซื้อบัตรเงินสดไปยัง Wepay
     */
    WepayAPI.prototype.buyCashCard = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData;
            return __generator(this, function (_a) {
                requestData = {
                    username: this.config.username,
                    password: this.config.password,
                    resp_url: this.config.callbackUrl,
                    dest_ref: params.reference,
                    type: 'cashcard',
                    pay_to_amount: params.amount,
                    pay_to_company: params.company,
                    pay_to_ref1: '0000000000', // Fixed for cash card
                };
                return [2 /*return*/, this.sendRequest(requestData)];
            });
        });
    };
    /**
     * ดึงข้อมูลรายละเอียดสินค้าจาก Wepay
     */
    WepayAPI.prototype.productDetail = function (companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var formBody, response, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        formBody = new URLSearchParams();
                        formBody.append('username', this.config.username);
                        formBody.append('password', this.config.password);
                        formBody.append('type', 'gtopup');
                        formBody.append('pay_to_company', companyId);
                        formBody.append('payee_info', 'true');
                        return [4 /*yield*/, fetch("".concat(this.baseUrl, "/client_api.json.php"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: formBody.toString(),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = (_a.sent());
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Wepay Product Detail API Error:', error_1);
                        throw new Error('Failed to fetch product details from Wepay API');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ส่ง HTTP Request ไปยัง Wepay API
     */
    WepayAPI.prototype.sendRequest = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var formBody_1, response, _a, _b, _c, result, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        formBody_1 = new URLSearchParams();
                        Object.entries(data).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (value !== undefined && value !== null) {
                                formBody_1.append(key, String(value));
                            }
                        });
                        return [4 /*yield*/, fetch("".concat(this.baseUrl, "/client_api.json.php"), {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: formBody_1.toString(),
                            })];
                    case 1:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _b = (_a = console).log;
                        _c = ["response game: "];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        throw new Error("HTTP error! status: ".concat(response.status));
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        result = _d.sent();
                        // console.log("response game: ",result);
                        return [2 /*return*/, result];
                    case 5:
                        error_2 = _d.sent();
                        console.error('Wepay API Error:', error_2);
                        throw new Error('Failed to connect to Wepay API');
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * ตรวจสอบ callback response จาก Wepay
     */
    WepayAPI.validateCallback = function (data) {
        return !!(data.dest_ref &&
            data.transaction_id &&
            data.status &&
            (data.status === '2' || data.status === '4'));
    };
    /**
     * สร้าง callback response ที่จะส่งกลับไปยัง Wepay
     */
    WepayAPI.createCallbackResponse = function (success, message) {
        if (success) {
            return "SUCCEED|".concat(message);
        }
        else {
            return "ERROR|".concat(message);
        }
    };
    return WepayAPI;
}());
exports.WepayAPI = WepayAPI;
/**
 * Get Wepay API instance
 */
function getWepayAPI() {
    var config = {
        username: process.env.WEPAY_USERNAME || '',
        password: process.env.WEPAY_PASSWORD || '',
        callbackUrl: process.env.WEPAY_CALLBACK_URL || "".concat(process.env.NEXT_PUBLIC_BASE_URL, "/api/wepay/callback"),
    };
    if (!config.username || !config.password) {
        throw new Error('Wepay credentials not configured');
    }
    return new WepayAPI(config);
}
