import { db } from "@/lib/db";
import { User } from "@/utils/types";
export async function GET(req: Request) {
  const roomId = req?.url?.split("/")[5];
  const existingMessages = await db.message.findMany({
    where: {
      chatRoomId: roomId,
    },
    include: {
      user: true,
    },
  });
  const serializedMessages = existingMessages.map((item) => ({
    id: item.id,
    user: item.user ? serializeUser(item.user) : {},
    message: item.text,
    createdAt: item.createdAt,
  }));
  return new Response(JSON.stringify(serializedMessages));
}

function serializeUser(user: any): User {
  const serializedUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    isAdmin: user.isAdmin,
  };
  return serializedUser;
}
