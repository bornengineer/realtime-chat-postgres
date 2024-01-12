import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

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

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
