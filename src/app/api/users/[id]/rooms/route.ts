import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = req?.url?.split("/")[5];
    const rooms = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        chatRooms: true,
      },
    });
    return new Response(JSON.stringify(rooms?.chatRooms));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
