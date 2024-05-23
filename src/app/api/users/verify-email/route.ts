import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { otp } = reqBody;

    const validOtp = await db.unverifiedUser.findMany({
      where: {
        verifyOtp: otp,
        verifyOtpExpiry: {
          gt: new Date().toISOString(),
        },
      },
    });

    if (validOtp?.length) {
      console.log("valid otp------------------------------------------");
      return NextResponse.json({ message: "Email verified", success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
