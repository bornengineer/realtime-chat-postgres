import jwt from "jsonwebtoken";

export function getUserFromToken(
  token: string
): { username: string; email: string } | null {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_TOKEN_SECRET!
    ) as {
      username: string;
      email: string;
    };
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
