import { useRequestContext } from "hono/jsx-renderer";
import { User, users } from "../../database/schema";
import { auth } from "../../lib/lucia";
import { db } from "../../database/connection";
import { eq } from "drizzle-orm";

type Auth = {
  user: User | null;
  isLoggedIn: boolean;
};

export default async function useAuth(): Promise<Auth> {
  const c = useRequestContext();

  const authReq = auth.handleRequest(c);
  const session = (await authReq.validate()) as { user: { userId: string } };
  if (!session) {
    return {
      user: null,
      isLoggedIn: false,
    } as const;
  }

  const user = await db.select().from(users).where(eq(users.id, session.user.userId));
  if (!user || !user.length) {
    return {
      user: null,
      isLoggedIn: false,
    } as const;
  }

  return {
    user: user?.[0],
    isLoggedIn: true,
  } as const;
}
