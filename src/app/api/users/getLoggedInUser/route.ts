import { getUserFromToken } from "@/utils/authUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get("token")?.value ?? "";
  const user = getUserFromToken(token)!;
  return new Response(JSON.stringify(user));
}
