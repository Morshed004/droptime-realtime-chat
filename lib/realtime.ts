import { Realtime, InferRealtimeEvents } from "@upstash/realtime";
import { redis } from "./redis";
import { z } from "zod";

const messageSchema = z.object({
  id: z.string(),
  sender: z.string(),
  msg: z.string(),
  roomId: z.string(),
  token: z.string().optional(),
  timeStamp: z.number(),
});

const schema = {
  chat: {
    message: messageSchema,
    destroy: z.object({
      isDestroyed: z.literal(true),
    }),
  },
};

export const realtime = new Realtime({ schema, redis });
export type RealtimeEvents = InferRealtimeEvents<typeof realtime>;

export type Message = z.infer<typeof messageSchema>;
