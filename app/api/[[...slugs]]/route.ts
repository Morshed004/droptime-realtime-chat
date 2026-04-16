import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";
import { authMiddleware } from "./auth";
import z from "zod";

// Room Route

const room = new Elysia({ prefix: "/room" }).post("/create", async () => {
  const roomId = nanoid();
  const ROOM_EXPIRE = 60 * 20;

  await redis.hset(`room:${roomId}`, {
    connected: [],
    createdAt: Date.now(),
  });

  await redis.expire(`room:${roomId}`, ROOM_EXPIRE);

  return { roomId };
});

// Message Route
const message = new Elysia({ prefix: "/message" }).use(authMiddleware).post(
  "/",
  async ({ body, auth }) => {
    const { roomId, isConnected, token } = auth;
    const { sender, msg } = body;

    const isRoomExist = await redis.exists(`room:${roomId}`);

    if(!isRoomExist){
      throw new Error("Room does not exist")
    }
  },
  {
    query: z.object({ roomId: z.string() }),
    body: z.object({
      sender: z.string().max(100),
      msg: z.string().max(1000),
    }),
  },
);

// Main app route
const app = new Elysia({ prefix: "/api" }).use(room).use(message);

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
