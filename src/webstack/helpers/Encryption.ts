import crypto from 'crypto';

export function encryptRequest(text: string, key: string | undefined) {
    if (!key) return;

    // Hash the key to get a fixed-size key
    const hash = crypto.createHash('sha256');
    hash.update(key);
    const hashedKey = hash.digest();

    const iv = crypto.randomBytes(16); // generate a new random initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
