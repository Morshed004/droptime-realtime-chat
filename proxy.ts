import { NextRequest, NextResponse } from "next/server";
import { redis } from "./lib/redis";
import { nanoid } from "nanoid";

export const proxy = async (req: NextRequest) => {
  const pathName = req.nextUrl.pathname;
  const isRoomMatche = pathName.match(/^\/room\/([^/]+)$/);

  if (!isRoomMatche) return NextResponse.redirect(new URL("/", req.url));

  const roomId = isRoomMatche[1];

  const roomMeta = await redis.hgetall<{
    connected: string[];
    createdAt: number;
  }>(`room:${roomId}`);

  if (!roomMeta) return NextResponse.redirect(new URL("/", req.url));

  const isTokenExist = req.cookies.get("x-auth-token")?.value;
  // ALLOW USER TO JOIN THE ROOM
  if (isTokenExist && roomMeta.connected.includes(isTokenExist)) {
    return NextResponse.next();
  }

  // DO NOT ALLOW USER TO JOIN THE ROOM
  if (roomMeta.connected.length >= 2) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.next();
  const token = nanoid();

  response.cookies.set("x-auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  await redis.hset(`room:${roomId}`, {
    connected: [...roomMeta.connected, token],
  });
};

export const config = {
  matcher: "/room/:path*",
};
