/**
 * Kill-switch check. If a file named PAUSE_AUTOMATION exists at the bookfactory
 * root, the daemon refuses to run anything. This is the user's emergency stop.
 */
import fs from "node:fs/promises";

export async function isPaused(pauseFile: string): Promise<boolean> {
  try {
    await fs.access(pauseFile);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read the optional reason from the pause file. The file's first non-empty
 * line is returned, or `null` if the file is empty.
 */
export async function readPauseReason(
  pauseFile: string
): Promise<string | null> {
  try {
    const content = await fs.readFile(pauseFile, "utf8");
    const firstLine = content
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.length > 0);
    return firstLine ?? null;
  } catch {
    return null;
  }
}
