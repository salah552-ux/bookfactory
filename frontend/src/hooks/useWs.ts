import { useEffect, useState } from "react";
import { ws, type WsStatus } from "../lib/ws";
import type { ServerMsg } from "../lib/schemas";

export function useWsStatus(): WsStatus {
  const [status, setStatus] = useState<WsStatus>(ws.getStatus());
  useEffect(() => {
    const off = ws.onStatus(setStatus);
    return () => {
      off();
    };
  }, []);
  return status;
}

export function useWsEvent<T extends ServerMsg["type"]>(
  type: T,
  handler: (msg: Extract<ServerMsg, { type: T }>) => void
) {
  useEffect(() => {
    const off = ws.on((msg) => {
      if (msg.type === type) handler(msg as Extract<ServerMsg, { type: T }>);
    });
    return () => {
      off();
    };
  }, [type, handler]);
}
