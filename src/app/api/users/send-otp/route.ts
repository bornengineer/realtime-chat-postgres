import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { sendVerifyMail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email } = reqBody;

    // check if user already exists
    const userWithEmail = await db.user.findMany({
      where: {
        email: email,
      },
    });
    const userWithUsername = await db.user.findMany({
      where: {
        username: username,
      },
    });

    if (userWithUsername?.length) {
      console.log(
        "user with username exists------------------------------------------"
      );
      return NextResponse.json(
        { error: "User with username already exists" },
        { status: 202 }
      );
    } else if (userWithEmail?.length) {
      console.log(
        "user with email exists------------------------------------------"
      );
      return NextResponse.json(
        { error: "User with email already exists" },
        { status: 202 }
      );
    }

    const newUnverifiedUser = await db.unverifiedUser.create({
      data: {
        username,
        email,
      },
    });

    console.log("newUnverifiedUser", newUnverifiedUser);

    const mailRes = await sendVerifyMail({
      userEmail: email,
      userId: newUnverifiedUser.id,
      userName: newUnverifiedUser.username,
    });

    console.log("mailRes", mailRes);

    return NextResponse.json({
      message: "OTP sent successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
