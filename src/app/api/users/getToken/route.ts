import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get("token") || "";
  return new Response(JSON.stringify(token));
}
