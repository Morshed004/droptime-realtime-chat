import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";

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

// Main app route
const app = new Elysia({ prefix: "/api" }).use(room);

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
