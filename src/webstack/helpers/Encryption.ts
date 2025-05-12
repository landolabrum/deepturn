import crypto from 'crypto';

export function encryptString(text: string, key: string | undefined): string | undefined {
    if (!key) return;

    // Hash the key to get a fixed-size key
    const hash = crypto.createHash('sha256');
    hash.update(key);
    const hashedKey = hash.digest(); // hashedKey is a Buffer

    const iv = crypto.randomBytes(16); // generate a new random initialization vector

    // Create the cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', hashedKey as crypto.CipherKey, iv as crypto.BinaryLike);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export function decryptString(encryptedText: string, key: string | undefined): string | null {
    if (!key || !encryptedText) return null;

    // Hash the key to get a fixed-size key
    const hash = crypto.createHash('sha256');
    hash.update(key);
    const hashedKey = hash.digest(); // hashedKey is a Buffer

    // Extract the initialization vector and the encrypted text
    const [ivHex, cipherText] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex') as crypto.BinaryLike;
    const encryptedBuffer = Buffer.from(cipherText, 'hex');

    // Decrypt the text
    const decipher = crypto.createDecipheriv('aes-256-cbc', hashedKey as crypto.CipherKey, iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    if (decrypted) return JSON.parse(String(decrypted));
    return null;
}
