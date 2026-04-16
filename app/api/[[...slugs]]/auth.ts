import { redis } from "@/lib/redis";
import { error } from "console";
import Elysia from "elysia";

class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const authMiddleware = new Elysia({
  name: "auth",
})
  .error({ AuthError })
  .onError(({ code, set }) => {
    if (code === "AuthError") {
      set.status = 401;
      return { error: "Unauthorzied" };
    }
  })
  .derive({ as: "scoped" }, async ({ cookie, query }) => {
    const roomId = query.roomId;
    // Safe access to cookie value
    const token = cookie["x-auth-token"]?.value as string | undefined;

    if (!roomId || !token) {
      throw new AuthError("Missing Room ID or Token");
    }

    const roomMeta = await redis.hgetall<{
      connected: string[];
      createdAt: number;
    }>(`room:${roomId}`);

    if (!roomMeta || !roomMeta.connected.includes(token)) {
      throw new AuthError("Invalid token or room");
    }

    return { auth: { token, isConnected: true, roomId } };
  });
