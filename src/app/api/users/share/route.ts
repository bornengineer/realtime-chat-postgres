import { shareAppOnMail } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, url, inviter } = reqBody;

    await shareAppOnMail({
      userEmail: email,
      url,
      inviter,
    });

    return NextResponse.json({
      message: "App shared on mail",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
