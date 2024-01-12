import { db } from "@/lib/db";
import { User } from "@/utils/types";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  try {
    const roomId = req?.url?.split("/")[5];
    const room = await db.chatRoom.findMany({
      where: {
        id: roomId,
      },
      include: {
        users: true,
      },
    });
    const selectedRoom = room[0];
    const serializedRoom = {
      id: selectedRoom.id,
      name: selectedRoom.name,
      createdAt: selectedRoom.createdAt,
      creatorId: selectedRoom.creatorId,
      users: selectedRoom.users ? serializeUsers(selectedRoom.users) : {},
    };
    return new Response(JSON.stringify(serializedRoom));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function serializeUsers(users: any): User {
  const serializedUsers = users.map((user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
  }));
  return serializedUsers;
}
