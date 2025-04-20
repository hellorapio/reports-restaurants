import * as crypto from 'crypto';
export function otpCode() {
  const otp = crypto.randomInt(1000, 9999);
  return otp;
}

export function hashObjects(obj: Record<string, any> | Record<string, any>[]) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

export function encryptString(text: string): string {
  const key = Buffer.from('0123456789ABCDEF0123456789ABCDEF', 'utf8');
  const iv = Buffer.from(key.subarray(0, 16));

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
}

export function res(
  data: Record<string, any> | Record<string, any>[],
  message?: string,
  code?: number,
) {
  return {
    status: 'success',
    code: code || 200,
    message: message || '',
    data,
  };
}
