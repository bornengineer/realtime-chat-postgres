import { User } from "@/types/user";

export default function serializeUsers(users: any): User {
  const serializedUsers = users.map((user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  }));
  return serializedUsers;
}
