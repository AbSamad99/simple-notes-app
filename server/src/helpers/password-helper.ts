import { randomBytes, scryptSync } from "crypto";

export class PasswordHelper {
  static hashPassword(password: string) {
    const salt = randomBytes(8).toString("hex");
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${hash}.${salt}`;
  }

  static compare(storedPassword: string, providedPassword: string) {
    const [storedHash, salt] = storedPassword.split(".");
    const providedHash = scryptSync(providedPassword, salt, 64).toString("hex");
    return storedHash == providedHash;
  }
}
