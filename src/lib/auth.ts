import crypto from 'crypto';

const SALT = 'uyutny-kvartal-auth-v1';
const KEYLEN = 64;
const ITERATIONS = 100000;

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, SALT, ITERATIONS, KEYLEN, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  const computed = hashPassword(password);
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
}
