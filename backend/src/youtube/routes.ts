import type { FastifyInstance } from "fastify";
import Anthropic from "@anthropic-ai/sdk";

const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function askClaude(system: string, user: string): Promise<string> {
  const msg = await ai.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = msg.content[0];
  return block.type === "text" ? block.text : "";
}

export async function registerYouTubeRoutes(app: FastifyInstance) {
  // ── Niche Research ─────────────────────────────────────────────
  app.post("/youtube/research", async (req, reply) => {
    const { niche } = req.body as { niche: string };
    if (!niche) return reply.code(400).send({ error: "niche required" });

    const result = await askClaude(
      `You are a YouTube monetization strategist. You analyse niches for profit potential.
       Return ONLY valid JSON. No markdown fences.`,
      `Analyse this YouTube niche: "${niche}"

       Return JSON with this exact shape:
       {
         "niche": "${niche}",
         "score": 0-100,
         "monthlySearchVolume": "string estimate",
         "avgCPM": "USD range",
         "competitionLevel": "Low|Medium|High",
         "topSubNiches": ["...", "...", "..."],
         "monetizationMethods": ["...", "...", "..."],
         "contentIdeas": [
           {"title": "...", "estimatedViews": "...", "type": "..."},
           {"title": "...", "estimatedViews": "...", "type": "..."},
           {"title": "...", "estimatedViews": "...", "type": "..."},
           {"title": "...", "estimatedViews": "...", "type": "..."},
           {"title": "...", "estimatedViews": "...", "type": "..."}
         ],
         "audienceSize": "string",
         "growthTrend": "Rising|Stable|Declining",
         "timeToMonetize": "string estimate",
         "verdict": "string 2-sentence verdict"
       }`
    );

    try {
      return JSON.parse(result);
    } catch {
      return reply.code(500).send({ error: "AI parse error", raw: result });
    }
  });

  // ── Script Generator ───────────────────────────────────────────
  app.post("/youtube/script", async (req, reply) => {
    const { topic, style, duration } = req.body as {
      topic: string;
      style?: string;
      duration?: string;
    };
    if (!topic) return reply.code(400).send({ error: "topic required" });

    const result = await askClaude(
      `You are a top YouTube script writer. You write viral, high-retention scripts.
       Return ONLY valid JSON. No markdown fences.`,
      `Write a complete YouTube script for: "${topic}"
       Style: ${style ?? "educational entertaining"}
       Target duration: ${duration ?? "8-10 minutes"}

       Return JSON:
       {
         "title": "optimized clickbait title",
         "hook": "first 30 seconds script — must grab attention immediately",
         "intro": "intro after hook (30-60 seconds)",
         "sections": [
           {"heading": "...", "content": "...", "duration": "X min"},
           {"heading": "...", "content": "...", "duration": "X min"},
           {"heading": "...", "content": "...", "duration": "X min"}
         ],
         "cta": "call to action script (30 seconds)",
         "outro": "outro script (30 seconds)",
         "brollSuggestions": ["...", "...", "..."],
         "wordCount": 0,
         "estimatedDuration": "X minutes"
       }`
    );

    try {
      return JSON.parse(result);
    } catch {
      return reply.code(500).send({ error: "AI parse error", raw: result });
    }
  });

  // ── SEO Optimizer ──────────────────────────────────────────────
  app.post("/youtube/seo", async (req, reply) => {
    const { topic, niche } = req.body as { topic: string; niche?: string };
    if (!topic) return reply.code(400).send({ error: "topic required" });

    const result = await askClaude(
      `You are a YouTube SEO expert. You optimize videos for maximum discovery and clicks.
       Return ONLY valid JSON. No markdown fences.`,
      `Generate complete SEO package for YouTube video about: "${topic}"
       Niche: ${niche ?? "general"}

       Return JSON:
       {
         "titles": [
           {"title": "...", "ctrScore": 0-100, "reasoning": "..."},
           {"title": "...", "ctrScore": 0-100, "reasoning": "..."},
           {"title": "...", "ctrScore": 0-100, "reasoning": "..."}
         ],
         "description": "full optimized description 500+ words with keywords naturally embedded",
         "tags": ["tag1", "tag2", "..."],
         "primaryKeyword": "...",
         "secondaryKeywords": ["...", "...", "..."],
         "thumbnailText": "3-5 words for thumbnail overlay",
         "bestUploadTime": "Day HH:MM timezone",
         "hashtagsForCommunity": ["#...", "#...", "#..."],
         "cardTimestamps": [
           {"at": "Xs", "suggestion": "..."}
         ]
       }`
    );

    try {
      return JSON.parse(result);
    } catch {
      return reply.code(500).send({ error: "AI parse error", raw: result });
    }
  });

  // ── Thumbnail Brief ────────────────────────────────────────────
  app.post("/youtube/thumbnail", async (req, reply) => {
    const { title, niche, style } = req.body as {
      title: string;
      niche?: string;
      style?: string;
    };
    if (!title) return reply.code(400).send({ error: "title required" });

    const result = await askClaude(
      `You are a YouTube thumbnail designer who specialises in high-CTR thumbnails.
       Return ONLY valid JSON. No markdown fences.`,
      `Create a thumbnail brief for: "${title}"
       Niche: ${niche ?? "general"}  Style: ${style ?? "modern bold"}

       Return JSON:
       {
         "concept": "one-sentence concept",
         "layout": "description of layout and composition",
         "overlayText": "exact text to show on thumbnail",
         "colorScheme": ["#hex1", "#hex2", "#hex3"],
         "mood": "...",
         "faceExpression": "...",
         "backgroundSuggestion": "...",
         "canvaPrompt": "detailed prompt to paste in Canva or Midjourney",
         "aiImagePrompt": "prompt for AI image generation",
         "ctrTips": ["...", "...", "..."]
       }`
    );

    try {
      return JSON.parse(result);
    } catch {
      return reply.code(500).send({ error: "AI parse error", raw: result });
    }
  });

  // ── Content Calendar ───────────────────────────────────────────
  app.post("/youtube/calendar", async (req, reply) => {
    const { niche, frequency, weeks } = req.body as {
      niche: string;
      frequency?: string;
      weeks?: number;
    };
    if (!niche) return reply.code(400).send({ error: "niche required" });

    const w = weeks ?? 4;
    const result = await askClaude(
      `You are a YouTube content strategist. You build data-driven content calendars.
       Return ONLY valid JSON. No markdown fences.`,
      `Build a ${w}-week YouTube content calendar for niche: "${niche}"
       Upload frequency: ${frequency ?? "3x per week"}

       Return JSON:
       {
         "strategy": "2-sentence strategy overview",
         "weeks": [
           {
             "week": 1,
             "theme": "...",
             "videos": [
               {
                 "day": "Monday",
                 "title": "...",
                 "type": "Long-form|Short|Livestream",
                 "goal": "...",
                 "monetizationAngle": "..."
               }
             ]
           }
         ],
         "seriesIdeas": [
           {"name": "...", "episodes": 0, "why": "..."}
         ],
         "milestones": [
           {"week": 0, "goal": "..."}
         ]
       }`
    );

    try {
      return JSON.parse(result);
    } catch {
      return reply.code(500).send({ error: "AI parse error", raw: result });
    }
  });

  // ── Revenue Calculator (no AI needed) ─────────────────────────
  app.post("/youtube/revenue", async (req, reply) => {
    const { subscribers, monthlyViews, avgCPM, sponsorRate } = req.body as {
      subscribers: number;
      monthlyViews: number;
      avgCPM: number;
      sponsorRate?: number;
    };

    const adsense = (monthlyViews / 1000) * avgCPM * 0.55; // YouTube takes 45%
    const sponsorships = sponsorRate ? sponsorRate * 2 : subscribers * 0.02; // rough estimate
    const membershipEstimate = subscribers * 0.005 * 4.99; // 0.5% join at $4.99
    const affiliateEstimate = monthlyViews * 0.001 * 15; // 0.1% click, $15 avg commission

    return {
      monthly: {
        adsense: Math.round(adsense),
        sponsorships: Math.round(sponsorships),
        memberships: Math.round(membershipEstimate),
        affiliate: Math.round(affiliateEstimate),
        total: Math.round(adsense + sponsorships + membershipEstimate + affiliateEstimate),
      },
      annual: {
        total: Math.round((adsense + sponsorships + membershipEstimate + affiliateEstimate) * 12),
      },
      rpm: Math.round((adsense / monthlyViews) * 1000 * 100) / 100,
      breakEvenViews: Math.round(2000 / avgCPM * 1000),
      daysToMonetize: monthlyViews >= 30000 ? "Already eligible" : `~${Math.ceil((30000 - monthlyViews) / (monthlyViews / 30))} days`,
    };
  });
}
