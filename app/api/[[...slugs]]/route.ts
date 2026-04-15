import { Elysia, t } from "elysia";

// Room Route

const room = new Elysia({ prefix: "/room" }).post("/create", () => {
  console.log("Room Created");
});

// Main app route
const app = new Elysia({ prefix: "/api" }).use(room);

export type App = typeof app;
export const GET = app.fetch;
export const POST = app.fetch;
