import type { PostLaunchData } from "@/components/PostLaunchCharts";

/**
 * post-launch-agent and ams-optimizer-agent write their reports into
 * `books/<slug>/POST-LAUNCH-DATA.json` with the shape below. The frontend
 * reads it via `file.read` and feeds it straight to PostLaunchCharts.
 *
 * The schema is intentionally permissive — agents fill in what they have,
 * the UI shows placeholders for any series that's missing.
 */
export interface PostLaunchArtefact {
  generated_at?: string;
  bsr?: Array<{ day: string; bsr: number }>;
  reviews?: Array<{ day: string; reviews: number; rating: number }>;
  ams?: Array<{ campaign: string; spend: number; acos: number }>;
  ku?: Array<{ day: string; pages: number }>;
}

export function parseArtefact(raw: string): PostLaunchData {
  try {
    const obj = JSON.parse(raw) as PostLaunchArtefact;
    return {
      bsr: obj.bsr,
      reviews: obj.reviews,
      ams: obj.ams,
      ku: obj.ku,
    };
  } catch {
    return {};
  }
}
