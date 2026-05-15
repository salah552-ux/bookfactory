function readSetting(key: string, fallback: string): string {
  if (typeof window !== "undefined") {
    const v = window.localStorage.getItem(key);
    if (v) return v;
  }
  return fallback;
}

const env = import.meta.env;

export function getWsUrl(): string {
  const fromStorage = readSetting("bf.wsUrl", "");
  if (fromStorage) return fromStorage;
  const fromEnv = env.VITE_WS_URL || "/ws";
  if (fromEnv.startsWith("/")) {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}${fromEnv}`;
  }
  return fromEnv;
}

export function getApiUrl(): string {
  const fromStorage = readSetting("bf.apiUrl", "");
  if (fromStorage) return fromStorage;
  return env.VITE_API_URL || "/api";
}

export function getAuthToken(): string | null {
  const v = readSetting("bf.authToken", "");
  return v || null;
}

export function setSetting(key: string, value: string) {
  if (value) window.localStorage.setItem(key, value);
  else window.localStorage.removeItem(key);
}
