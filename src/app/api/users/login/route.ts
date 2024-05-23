import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // check if user exists
    const existingUser = await db.user.findMany({
      where: {
        OR: [
          {
            email: email,
          },
          {
            username: email,
          },
        ],
      },
    });
    const user = existingUser[0];
    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist, please sign up" },
        { status: 404 }
      );
    }

    // check if password is correct or not
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = jwt.sign(tokenData, process.env.NEXT_PUBLIC_TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Login Successfull",
      success: true,
    });
    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
