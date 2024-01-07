import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const { roomId, message } = await req.json();
  const res = await db.message.create({
    data: {
      text: message,
      chatRoomId: roomId,
    },
  });
  pusherServer.trigger(roomId, "incoming-message", {
    message,
    createdAt: res.createdAt,
    id: res.id,
  });
  return new Response(JSON.stringify({ success: true }));
}
