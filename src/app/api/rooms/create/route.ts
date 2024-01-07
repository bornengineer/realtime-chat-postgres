import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { name } = (await req.json()) || "";
  const createdRoom = await db.chatRoom.create({
    data: name ? { name: name } : {},
  });
  return new Response(JSON.stringify(createdRoom.id));
}
