import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export async function verifyTokenEdge(token: string): Promise<JWTPayload> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as "user" | "admin",
    };
  } catch (error) {
    console.error("[JWT-Edge] Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}
