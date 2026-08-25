import crypto from 'crypto';

function getEncryptionKey(): Buffer {
  const hexKey = process.env.AUTH_ENCRYPTION_KEY;
  if (!hexKey) {
    throw new Error('AUTH_ENCRYPTION_KEY environment variable is missing.');
  }
  const key = Buffer.from(hexKey, 'hex');
  if (key.length !== 32) {
    throw new Error(`AUTH_ENCRYPTION_KEY must be a 32-byte hex string (64 characters), got ${key.length} bytes.`);
  }
  return key;
}

export function encryptToken(plain: string): { ciphertext: string; iv: string } {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plain, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    ciphertext: `${encrypted}:${authTag}`,
    iv: iv.toString('hex'),
  };
}

export function decryptToken(ciphertext: string, ivHex: string): string {
  const key = getEncryptionKey();
  const parts = ciphertext.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid ciphertext format. Expected "ciphertext:authTag".');
  }
  const [encryptedHex, authTagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
