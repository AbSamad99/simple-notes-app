import crypto from "crypto";

export interface EncryptionInfo {
  iv: string;
  content: string;
}

export class EncryptionHelper {
  static encrypt(toEncrypt: string): EncryptionInfo {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      "aes-256-ctr",
      process.env.ENCRYPTION_KEY,
      iv
    );

    const encrypted = Buffer.concat([cipher.update(toEncrypt), cipher.final()]);

    return {
      iv: iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
  }

  static decrypt(encryptionInfo: EncryptionInfo) {
    const decipher = crypto.createDecipheriv(
      "aes-256-ctr",
      process.env.ENCRYPTION_KEY,
      Buffer.from(encryptionInfo.iv, "hex")
    );

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(encryptionInfo.content, "hex")),
      decipher.final(),
    ]);

    return decrpyted.toString();
  }
}
