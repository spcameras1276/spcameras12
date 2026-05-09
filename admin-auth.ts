import { getAdminByUsername } from "./db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyAdminLogin(username: string, password: string) {
  const admin = await getAdminByUsername(username);
  
  if (!admin) {
    return null;
  }

  // Comparar senha (em produção, use bcrypt!)
  if (admin.password !== password) {
    return null;
  }

  // Gerar JWT token
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
}

export function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}
