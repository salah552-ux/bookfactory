import Fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { handleConnection } from "./ws/handler.js";
import { BOOKFACTORY_ROOT } from "./paths.js";
import { startWatcher, stopWatcher } from "./lib/watcher.js";

const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? "127.0.0.1";

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? "info",
    transport: { target: "pino-pretty", options: { colorize: true, singleLine: true } },
  },
});

await app.register(cors, { origin: true });
await app.register(websocket, {
  options: { maxPayload: 8 * 1024 * 1024 },
});

app.get("/health", async () => ({
  ok: true,
  version: "0.1.0",
  bookfactoryRoot: BOOKFACTORY_ROOT,
}));

app.get("/ws", { websocket: true }, (socket /* SocketStream wraps a ws */) => {
  // @fastify/websocket v10 hands us the WebSocket directly via `socket`.
  handleConnection(socket as unknown as import("@fastify/websocket").WebSocket);
});

const close = async () => {
  app.log.info("shutting down");
  await stopWatcher();
  await app.close();
  process.exit(0);
};
process.on("SIGINT", close);
process.on("SIGTERM", close);

try {
  await app.listen({ port: PORT, host: HOST });
  startWatcher();
  app.log.info({ port: PORT, host: HOST, bookfactoryRoot: BOOKFACTORY_ROOT }, "ready");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
