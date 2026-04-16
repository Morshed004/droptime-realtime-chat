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
  .derive({ as: "scoped" }, async ({cookie, query}) => {
    const roomId = query.roomId;
    const token = cookie["x-auth-token"].value as string | undefined;

    if(!roomId || !token){
        throw new AuthError("Missing Room ID or Token")
    }

    const isConnected = await redis.hget<string[]>(`room:${roomId}`, "connected")
    if(!isConnected?.includes(token)){
        throw new AuthError("Invalid token")
    }

    return {auth: {token, isConnected, roomId}}
  });
