import crypto from 'crypto';

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'der' },
  privateKeyEncoding: { type: 'pkcs8', format: 'der' }
});

const keyBase64 = publicKey.toString('base64');
console.log('Key:\n' + keyBase64);

const hash = crypto.createHash('sha256').update(publicKey).digest('hex').substring(0, 32);
const extId = hash.split('').map(c => {
  const code = parseInt(c, 16);
  return String.fromCharCode(97 + code);
}).join('');

console.log('\nExtension ID: ' + extId);
