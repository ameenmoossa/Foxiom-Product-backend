const crypto = require('crypto');

// AES-256-CBC with random IV.
// Encrypted payload is base64(iv) + ':' + base64(ciphertext)

const getKey = () => {
  // Prefer 32-byte key from env; otherwise derive from secret.
  const keyFromEnv = process.env.AES_256_KEY;
  if (keyFromEnv) {
    // If provided as hex, use that. If provided as utf8 string, pad/trim to 32 bytes.
    const isHex = /^[0-9a-fA-F]+$/.test(keyFromEnv) && keyFromEnv.length === 64;
    if (isHex) return Buffer.from(keyFromEnv, 'hex');
    const buf = Buffer.alloc(32);
    Buffer.from(keyFromEnv).copy(buf, 0, 0, 32);
    return buf;
  }

  const secret = process.env.AES_256_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing AES encryption key. Set AES_256_KEY (hex 64 chars) or AES_256_SECRET env var');
  }
  return crypto.createHash('sha256').update(String(secret)).digest();
};

const encrypt = (plaintext) => {
  if (plaintext === null || plaintext === undefined) return plaintext;
  const iv = crypto.randomBytes(16);
  const key = getKey();

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(String(plaintext), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return `${iv.toString('base64')}:${encrypted}`;
};

const decrypt = (payload) => {
  if (payload === null || payload === undefined) return payload;
  if (typeof payload !== 'string') return payload;

  const [ivB64, encryptedB64] = payload.split(':');
  if (!ivB64 || !encryptedB64) {
    // In case old/plain values are stored.
    return payload;
  }

  const iv = Buffer.from(ivB64, 'base64');
  const key = getKey();

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedB64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

module.exports = { encrypt, decrypt };

