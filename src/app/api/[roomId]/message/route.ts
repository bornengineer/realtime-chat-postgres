import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getUserFromToken } from "@/utils/authUtils";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { roomId, message } = await req.json();
  const token = req.cookies.get("token")?.value ?? "";
  const user = getUserFromToken(token);
  const existingUser = await db.user.findMany({
    where: {
      email: user?.email,
    },
  });
  const res = await db.message.create({
    data: {
      text: message,
      chatRoom: {
        connect: { id: roomId },
      },
      user: {
        connect: { id: existingUser[0].id },
      },
    },
  });
  pusherServer.trigger(roomId, "incoming-message", {
    message,
    createdAt: res.createdAt,
    id: res.id,
    user,
  });
  return new Response(JSON.stringify({ success: true }));
}
