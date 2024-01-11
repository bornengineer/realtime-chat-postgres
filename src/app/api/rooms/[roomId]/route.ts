import { db } from "@/lib/db";
export async function GET(req: Request) {
  const roomId = req?.url?.split("/")[5];
  const room = await db.chatRoom.findMany({
    where: {
      id: roomId,
    },
    include: {
      users: true,
    },
  });
  return new Response(JSON.stringify(room));
}
