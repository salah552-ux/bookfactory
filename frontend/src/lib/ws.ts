import { ServerMsg } from "./schemas";
import { getWsUrl, getAuthToken } from "./env";
import { mockWs } from "./wsMock";

const DEMO = import.meta.env.VITE_DEMO === "true";

type Listener = (msg: ServerMsg) => void;
type StatusListener = (status: WsStatus) => void;

export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

class WsClient {
  private socket: WebSocket | null = null;
  private status: WsStatus = "idle";
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private shouldRun = false;

  start() {
    this.shouldRun = true;
    this.open();
  }

  stop() {
    this.shouldRun = false;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
    this.setStatus("closed");
  }

  send(msg: Record<string, unknown>) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn("[ws] send skipped — socket not open", msg);
      return;
    }
    this.socket.send(JSON.stringify(msg));
  }

  on(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => this.statusListeners.delete(listener);
  }

  getStatus() {
    return this.status;
  }

  private open() {
    const url = getWsUrl();
    const token = getAuthToken();
    const finalUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;

    this.setStatus("connecting");
    let socket: WebSocket;
    try {
      socket = new WebSocket(finalUrl);
    } catch (err) {
      console.error("[ws] construction failed", err);
      this.setStatus("error");
      this.scheduleReconnect();
      return;
    }
    this.socket = socket;

    socket.addEventListener("open", () => {
      this.reconnectAttempts = 0;
      this.setStatus("open");
    });
    socket.addEventListener("close", () => {
      this.setStatus("closed");
      if (this.shouldRun) this.scheduleReconnect();
    });
    socket.addEventListener("error", () => {
      this.setStatus("error");
    });
    socket.addEventListener("message", (ev) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(String(ev.data));
      } catch {
        console.warn("[ws] non-json message", ev.data);
        return;
      }
      const result = ServerMsg.safeParse(parsed);
      if (!result.success) {
        console.warn("[ws] unknown message", parsed, result.error.flatten());
        return;
      }
      for (const l of this.listeners) l(result.data);
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || !this.shouldRun) return;
    const delay = Math.min(15000, 500 * 2 ** this.reconnectAttempts);
    this.reconnectAttempts += 1;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, delay);
  }

  private setStatus(s: WsStatus) {
    this.status = s;
    for (const l of this.statusListeners) l(s);
  }
}

export const ws = DEMO ? (mockWs as unknown as WsClient) : new WsClient();
