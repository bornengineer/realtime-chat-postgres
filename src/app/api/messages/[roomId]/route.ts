import { db } from "@/lib/db";
export async function GET(req: Request) {
  const roomId = req?.url?.split("/")[5];
  const existingMessages = await db.message.findMany({
    where: {
      chatRoomId: roomId,
    },
  });
  const serializedMessages = existingMessages.map((item) => ({
    id: item.id,
    message: item.text,
    createdAt: item.createdAt,
  }));
  return new Response(JSON.stringify(serializedMessages));
}
