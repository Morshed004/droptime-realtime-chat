import { Message, realtime } from "@/lib/realtime";
import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authMiddleware } from "./auth";

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
const message = new Elysia({ prefix: "/message" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, auth }) => {
      const { roomId, token } = auth;
      const { sender, msg } = body;

      const isRoomExist = await redis.exists(`room:${roomId}`);

      if (!isRoomExist) {
        console.log("room not exist")
        throw new Error("Room does not exist");
      }

      const message: Message = {
        id: nanoid(),
        sender,
        msg,
        roomId,
        timeStamp: Date.now(),
      };

      await redis.rpush(`message:${roomId}`, {
        ...message,
        token,
      });

      await realtime.channel(roomId).emit("chat.message", message);

      const timeRemaining = await redis.ttl(`room:${roomId}`);
      await redis.expire(`message:${roomId}`, timeRemaining);
      await redis.expire(roomId, timeRemaining);
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        sender: z.string().max(100),
        msg: z.string().max(1000),
      }),
    },
  ).get(
    "/",
    async ({ auth }) => {
      const message = await redis.lrange<Message>(
        `message:${auth.roomId}`,
        0,
        -1,
      );

      return {
        message: message.map((m) => ({
          ...m,
          token: m.token === auth.token ? auth.token : undefined,
        })),
      };
    },
    { query: z.object({ roomId: z.string() }) },
  )
  

// Main app route
const app = new Elysia({ prefix: "/api" }).use(room).use(message);

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
