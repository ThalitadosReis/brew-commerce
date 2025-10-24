import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("[JWT] Token verification failed:", error);
    return null;
  }
}

export function generatePasswordResetToken(userId: string): string {
  return jwt.sign({ userId, type: "password-reset" }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyPasswordResetToken(token: string): string {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      type: string;
    };

    if (decoded.type !== "password-reset") {
      throw new Error("Invalid token type");
    }

    return decoded.userId;
  } catch (error) {
    throw new Error("Invalid or expired reset token");
  }
}
