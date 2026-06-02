import { useState } from "react";
import {
  Youtube,
  Search,
  FileText,
  Tag,
  Image,
  Calendar,
  DollarSign,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  CheckCircle,
  Zap,
  Clock,
  Users,
  Eye,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { getApiUrl } from "@/lib/env";
import { useYouTube, type YtTab } from "@/stores/youtube";

// ── helpers ────────────────────────────────────────────────────────────────

function apiBase() {
  const base = getApiUrl();
  return base.endsWith("/") ? base : base + "/";
}

async function ytPost<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${apiBase()}youtube/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`${r.status}: ${txt}`);
  }
  return r.json() as Promise<T>;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1 rounded text-text-3 hover:text-text-1 transition-colors"
      title="Copy"
    >
      {copied ? <CheckCircle className="size-4 text-green" /> : <Copy className="size-4" />}
    </button>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-line bg-bg-card p-5", className)}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-text-3 mb-1.5">{children}</label>;
}

function Input({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-lg border border-line bg-bg-input px-3 py-2 text-sm text-text-1 placeholder:text-text-3",
        "focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet/50",
        className
      )}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-line bg-bg-input px-3 py-2 text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-violet/50"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function RunBtn({
  onClick,
  loading,
  label,
}: {
  onClick: () => void;
  loading: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet to-magenta hover:opacity-90 disabled:opacity-60 transition-opacity shadow-[0_0_18px_-6px_rgba(168,85,247,0.7)]"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
      {loading ? "Generating…" : label}
    </button>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-line overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            score >= 70 ? "bg-green" : score >= 40 ? "bg-orange" : "bg-red"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-text-1">{score}/100</span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Rising") return <TrendingUp className="size-4 text-green" />;
  if (trend === "Declining") return <TrendingDown className="size-4 text-red" />;
  return <Minus className="size-4 text-text-3" />;
}

function Tag2({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md border border-line bg-bg-card px-2 py-0.5 text-xs text-text-2">
      {children}
    </span>
  );
}

// ── Tab: Niche Research ────────────────────────────────────────────────────

function ResearchTab() {
  const {
    researchNiche, setResearchNiche,
    researchResult, setResearchResult,
    loading, setLoading, error, setError,
  } = useYouTube();

  async function run() {
    if (!researchNiche.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await ytPost<Record<string, unknown>>("research", { niche: researchNiche });
      setResearchResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const r = researchResult as Record<string, unknown> | null;

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-sm font-semibold text-text-1 mb-4 flex items-center gap-2">
          <Search className="size-4 text-violet-2" /> Niche Research Engine
        </h3>
        <div className="space-y-3">
          <div>
            <Label>YouTube Niche</Label>
            <Input
              value={researchNiche}
              onChange={setResearchNiche}
              placeholder="e.g. personal finance for millennials, AI tools reviews, ASMR cooking"
            />
          </div>
          <RunBtn onClick={run} loading={loading} label="Analyse Niche" />
        </div>
        {error && <p className="mt-3 text-xs text-red">{error}</p>}
      </Card>

      {r && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Niche Score", value: <ScoreBar score={r.score as number} /> },
              { label: "Competition", value: r.competitionLevel as string },
              { label: "Growth Trend", value: <div className="flex items-center gap-1.5"><TrendIcon trend={r.growthTrend as string} />{r.growthTrend as string}</div> },
              { label: "Time to Monetize", value: r.timeToMonetize as string },
            ].map((s) => (
              <Card key={s.label} className="p-4">
                <div className="text-[10px] uppercase tracking-widest text-text-3 mb-2">{s.label}</div>
                <div className="text-sm font-semibold text-text-1">{s.value}</div>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Monetization Methods</h4>
              <div className="space-y-1.5">
                {(r.monetizationMethods as string[]).map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-text-1">
                    <DollarSign className="size-3 text-green shrink-0" />{m}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Top Sub-Niches</h4>
              <div className="flex flex-wrap gap-1.5">
                {(r.topSubNiches as string[]).map((n, i) => (
                  <Tag2 key={i}>{n}</Tag2>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Content Ideas</h4>
            <div className="space-y-2">
              {(r.contentIdeas as { title: string; estimatedViews: string; type: string }[]).map((idea, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-side border border-line">
                  <span className="size-6 rounded-md bg-violet/10 text-violet-2 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-1 font-medium truncate">{idea.title}</p>
                    <p className="text-xs text-text-3">{idea.type} · ~{idea.estimatedViews}</p>
                  </div>
                  <CopyBtn text={idea.title} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-semibold text-text-2 mb-1 uppercase tracking-wider">Verdict</h4>
                <p className="text-sm text-text-1">{r.verdict as string}</p>
              </div>
              <CopyBtn text={r.verdict as string} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// ── Tab: Script Generator ──────────────────────────────────────────────────

function ScriptTab() {
  const {
    scriptTopic, setScriptTopic,
    scriptStyle, setScriptStyle,
    scriptDuration, setScriptDuration,
    scriptResult, setScriptResult,
    loading, setLoading, error, setError,
  } = useYouTube();

  async function run() {
    if (!scriptTopic.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await ytPost<Record<string, unknown>>("script", {
        topic: scriptTopic, style: scriptStyle, duration: scriptDuration,
      });
      setScriptResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const r = scriptResult as Record<string, unknown> | null;

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-sm font-semibold text-text-1 mb-4 flex items-center gap-2">
          <FileText className="size-4 text-violet-2" /> AI Script Generator
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div className="sm:col-span-3">
            <Label>Video Topic</Label>
            <Input value={scriptTopic} onChange={setScriptTopic} placeholder="e.g. How I made $10k on YouTube in 90 days" />
          </div>
          <div>
            <Label>Style</Label>
            <Select value={scriptStyle} onChange={setScriptStyle} options={[
              { label: "Educational entertaining", value: "educational entertaining" },
              { label: "Storytelling / vlog", value: "storytelling vlog" },
              { label: "Tutorial / how-to", value: "tutorial how-to" },
              { label: "Listicle / top 10", value: "listicle top 10" },
              { label: "News / commentary", value: "news commentary" },
              { label: "Motivational", value: "motivational" },
            ]} />
          </div>
          <div>
            <Label>Target Duration</Label>
            <Select value={scriptDuration} onChange={setScriptDuration} options={[
              { label: "3-5 minutes (Short)", value: "3-5 minutes" },
              { label: "8-10 minutes (Standard)", value: "8-10 minutes" },
              { label: "15-20 minutes (Long-form)", value: "15-20 minutes" },
              { label: "30+ minutes (Deep dive)", value: "30+ minutes" },
            ]} />
          </div>
          <div className="flex items-end">
            <RunBtn onClick={run} loading={loading} label="Generate Script" />
          </div>
        </div>
        {error && <p className="text-xs text-red">{error}</p>}
      </Card>

      {r && (
        <>
          <Card>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-text-2 uppercase tracking-wider">Optimized Title</h4>
              <CopyBtn text={r.title as string} />
            </div>
            <p className="text-base font-semibold text-text-1">{r.title as string}</p>
            <div className="mt-2 flex gap-3 text-xs text-text-3">
              <span className="flex items-center gap-1"><Clock className="size-3" />{r.estimatedDuration as string}</span>
              <span className="flex items-center gap-1"><FileText className="size-3" />{r.wordCount as number} words</span>
            </div>
          </Card>

          {[
            { label: "Hook (First 30 seconds)", key: "hook", color: "text-green" },
            { label: "Intro", key: "intro", color: "text-violet-2" },
          ].map(({ label, key, color }) => (
            <Card key={key}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={cn("text-xs font-semibold uppercase tracking-wider", color)}>{label}</h4>
                <CopyBtn text={r[key] as string} />
              </div>
              <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap">{r[key] as string}</p>
            </Card>
          ))}

          {(r.sections as { heading: string; content: string; duration: string }[]).map((s, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-text-2 uppercase tracking-wider">
                  Section {i + 1}: {s.heading} <span className="text-text-3 font-normal">· {s.duration}</span>
                </h4>
                <CopyBtn text={s.content} />
              </div>
              <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap">{s.content}</p>
            </Card>
          ))}

          {[
            { label: "Call to Action", key: "cta" },
            { label: "Outro", key: "outro" },
          ].map(({ label, key }) => (
            <Card key={key}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-text-2 uppercase tracking-wider">{label}</h4>
                <CopyBtn text={r[key] as string} />
              </div>
              <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap">{r[key] as string}</p>
            </Card>
          ))}

          <Card>
            <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">B-Roll Suggestions</h4>
            <div className="space-y-1">
              {(r.brollSuggestions as string[]).map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-text-1">
                  <ChevronRight className="size-3.5 text-text-3" />{b}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-center">
            <button
              onClick={() => {
                const full = [
                  `TITLE: ${r.title}`,
                  `\n=== HOOK ===\n${r.hook}`,
                  `\n=== INTRO ===\n${r.intro}`,
                  ...(r.sections as { heading: string; content: string }[]).map(
                    (s, i) => `\n=== SECTION ${i + 1}: ${s.heading} ===\n${s.content}`
                  ),
                  `\n=== CALL TO ACTION ===\n${r.cta}`,
                  `\n=== OUTRO ===\n${r.outro}`,
                ].join("\n");
                navigator.clipboard.writeText(full).catch(() => {});
              }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-text-1 border border-line hover:border-violet/50 hover:text-violet-2 transition-colors"
            >
              <Copy className="size-4" /> Copy Full Script
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Tab: SEO Optimizer ─────────────────────────────────────────────────────

function SeoTab() {
  const {
    seoTopic, setSeoTopic,
    seoNiche, setSeoNiche,
    seoResult, setSeoResult,
    loading, setLoading, error, setError,
  } = useYouTube();

  async function run() {
    if (!seoTopic.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await ytPost<Record<string, unknown>>("seo", { topic: seoTopic, niche: seoNiche });
      setSeoResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const r = seoResult as Record<string, unknown> | null;

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-sm font-semibold text-text-1 mb-4 flex items-center gap-2">
          <Tag className="size-4 text-violet-2" /> YouTube SEO Lab
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <Label>Video Topic</Label>
            <Input value={seoTopic} onChange={setSeoTopic} placeholder="e.g. 10 passive income ideas for 2025" />
          </div>
          <div>
            <Label>Channel Niche (optional)</Label>
            <Input value={seoNiche} onChange={setSeoNiche} placeholder="e.g. personal finance" />
          </div>
        </div>
        <RunBtn onClick={run} loading={loading} label="Optimize for YouTube SEO" />
        {error && <p className="mt-3 text-xs text-red">{error}</p>}
      </Card>

      {r && (
        <>
          <Card>
            <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Title Options (ranked by CTR potential)</h4>
            <div className="space-y-3">
              {(r.titles as { title: string; ctrScore: number; reasoning: string }[]).map((t, i) => (
                <div key={i} className="p-3 rounded-lg bg-bg-side border border-line">
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "size-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0",
                      i === 0 ? "bg-green/10 text-green" : "bg-bg-card text-text-3"
                    )}>
                      {i === 0 ? "★" : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-text-1">{t.title}</p>
                        <CopyBtn text={t.title} />
                      </div>
                      <div className="mb-1.5">
                        <ScoreBar score={t.ctrScore} />
                      </div>
                      <p className="text-xs text-text-3">{t.reasoning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Primary Keyword</h4>
              <div className="flex items-center gap-2">
                <Tag2>{r.primaryKeyword as string}</Tag2>
                <CopyBtn text={r.primaryKeyword as string} />
              </div>
              <h4 className="text-xs font-semibold text-text-2 mb-2 mt-4 uppercase tracking-wider">Secondary Keywords</h4>
              <div className="flex flex-wrap gap-1.5">
                {(r.secondaryKeywords as string[]).map((k, i) => (
                  <Tag2 key={i}>{k}</Tag2>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-2 uppercase tracking-wider">Thumbnail Text</h4>
              <div className="text-2xl font-black text-text-1 mb-2">{r.thumbnailText as string}</div>
              <h4 className="text-xs font-semibold text-text-2 mb-2 uppercase tracking-wider mt-3">Best Upload Time</h4>
              <div className="flex items-center gap-2 text-sm text-text-1">
                <Clock className="size-4 text-violet-2" />{r.bestUploadTime as string}
              </div>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-text-2 uppercase tracking-wider">Tags ({(r.tags as string[]).length})</h4>
              <CopyBtn text={(r.tags as string[]).join(", ")} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(r.tags as string[]).map((t, i) => (
                <Tag2 key={i}>{t}</Tag2>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-text-2 uppercase tracking-wider">SEO Description</h4>
              <CopyBtn text={r.description as string} />
            </div>
            <p className="text-sm text-text-1 leading-relaxed whitespace-pre-wrap">{r.description as string}</p>
          </Card>

          <Card>
            <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Community Hashtags</h4>
            <div className="flex flex-wrap gap-1.5">
              {(r.hashtagsForCommunity as string[]).map((h, i) => (
                <span key={i} className="text-sm text-violet-2">{h}</span>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// ── Tab: Thumbnail Brief ───────────────────────────────────────────────────

function ThumbnailTab() {
  const {
    thumbTitle, setThumbTitle,
    thumbNiche, setThumbNiche,
    thumbResult, setThumbResult,
    loading, setLoading, error, setError,
  } = useYouTube();

  async function run() {
    if (!thumbTitle.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await ytPost<Record<string, unknown>>("thumbnail", {
        title: thumbTitle, niche: thumbNiche,
      });
      setThumbResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const r = thumbResult as Record<string, unknown> | null;

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-sm font-semibold text-text-1 mb-4 flex items-center gap-2">
          <Image className="size-4 text-violet-2" /> Thumbnail Brief Generator
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <Label>Video Title</Label>
            <Input value={thumbTitle} onChange={setThumbTitle} placeholder="e.g. I Quit My Job to Make YouTube Videos" />
          </div>
          <div>
            <Label>Niche (optional)</Label>
            <Input value={thumbNiche} onChange={setThumbNiche} placeholder="e.g. entrepreneurship" />
          </div>
        </div>
        <RunBtn onClick={run} loading={loading} label="Generate Thumbnail Brief" />
        {error && <p className="mt-3 text-xs text-red">{error}</p>}
      </Card>

      {r && (
        <>
          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Concept</h4>
              <p className="text-sm text-text-1">{r.concept as string}</p>
              <h4 className="text-xs font-semibold text-text-2 mb-2 mt-4 uppercase tracking-wider">Layout</h4>
              <p className="text-sm text-text-1">{r.layout as string}</p>
              <h4 className="text-xs font-semibold text-text-2 mb-2 mt-4 uppercase tracking-wider">Mood</h4>
              <p className="text-sm text-text-1">{r.mood as string}</p>
              <h4 className="text-xs font-semibold text-text-2 mb-2 mt-4 uppercase tracking-wider">Face Expression</h4>
              <p className="text-sm text-text-1">{r.faceExpression as string}</p>
            </Card>
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Overlay Text</h4>
              <div className="p-4 rounded-lg bg-bg-side border border-violet/20 text-center">
                <p className="text-2xl font-black text-text-1">{r.overlayText as string}</p>
              </div>
              <h4 className="text-xs font-semibold text-text-2 mb-2 mt-4 uppercase tracking-wider">Color Scheme</h4>
              <div className="flex gap-2">
                {(r.colorScheme as string[]).map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="size-6 rounded border border-line" style={{ backgroundColor: c }} />
                    <span className="text-xs text-text-3">{c}</span>
                  </div>
                ))}
              </div>
              <h4 className="text-xs font-semibold text-text-2 mb-2 mt-4 uppercase tracking-wider">Background</h4>
              <p className="text-sm text-text-1">{r.backgroundSuggestion as string}</p>
            </Card>
          </div>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-text-2 uppercase tracking-wider">Canva Prompt</h4>
              <CopyBtn text={r.canvaPrompt as string} />
            </div>
            <p className="text-sm text-text-1 leading-relaxed">{r.canvaPrompt as string}</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-text-2 uppercase tracking-wider">AI Image Prompt (Midjourney / DALL·E)</h4>
              <CopyBtn text={r.aiImagePrompt as string} />
            </div>
            <p className="text-sm text-text-1 font-mono text-xs leading-relaxed bg-bg-side p-3 rounded-lg border border-line">
              {r.aiImagePrompt as string}
            </p>
          </Card>

          <Card>
            <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">CTR Tips</h4>
            <div className="space-y-1.5">
              {(r.ctrTips as string[]).map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-text-1">
                  <span className="size-4 rounded-full bg-green/10 text-green text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// ── Tab: Content Calendar ──────────────────────────────────────────────────

function CalendarTab() {
  const {
    calNiche, setCalNiche,
    calFrequency, setCalFrequency,
    calWeeks, setCalWeeks,
    calResult, setCalResult,
    loading, setLoading, error, setError,
  } = useYouTube();

  async function run() {
    if (!calNiche.trim()) return;
    setLoading(true); setError(null);
    try {
      const data = await ytPost<Record<string, unknown>>("calendar", {
        niche: calNiche, frequency: calFrequency, weeks: calWeeks,
      });
      setCalResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const r = calResult as Record<string, unknown> | null;

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-sm font-semibold text-text-1 mb-4 flex items-center gap-2">
          <Calendar className="size-4 text-violet-2" /> Content Calendar Builder
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div>
            <Label>Channel Niche</Label>
            <Input value={calNiche} onChange={setCalNiche} placeholder="e.g. AI productivity tools" />
          </div>
          <div>
            <Label>Upload Frequency</Label>
            <Select value={calFrequency} onChange={setCalFrequency} options={[
              { label: "Daily (7x/week)", value: "daily 7x per week" },
              { label: "5x per week", value: "5x per week" },
              { label: "3x per week", value: "3x per week" },
              { label: "2x per week", value: "2x per week" },
              { label: "Weekly", value: "weekly 1x per week" },
            ]} />
          </div>
          <div>
            <Label>Weeks to plan</Label>
            <Select value={String(calWeeks)} onChange={(v) => setCalWeeks(Number(v))} options={[
              { label: "2 weeks", value: "2" },
              { label: "4 weeks", value: "4" },
              { label: "8 weeks", value: "8" },
              { label: "12 weeks", value: "12" },
            ]} />
          </div>
        </div>
        <RunBtn onClick={run} loading={loading} label="Build Content Calendar" />
        {error && <p className="mt-3 text-xs text-red">{error}</p>}
      </Card>

      {r && (
        <>
          <Card>
            <h4 className="text-xs font-semibold text-text-2 mb-2 uppercase tracking-wider">Strategy</h4>
            <p className="text-sm text-text-1">{r.strategy as string}</p>
          </Card>

          {(r.weeks as { week: number; theme: string; videos: { day: string; title: string; type: string; goal: string; monetizationAngle: string }[] }[]).map((week) => (
            <Card key={week.week}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-0.5 rounded-md bg-violet/10 text-violet-2 text-xs font-bold">Week {week.week}</span>
                <span className="text-sm font-semibold text-text-1">{week.theme}</span>
              </div>
              <div className="space-y-2">
                {week.videos.map((v, vi) => (
                  <div key={vi} className="grid sm:grid-cols-[80px_1fr_100px] gap-2 p-3 rounded-lg bg-bg-side border border-line">
                    <div className="text-xs font-semibold text-text-3">{v.day}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-1">{v.title}</p>
                        <CopyBtn text={v.title} />
                      </div>
                      <p className="text-xs text-text-3 mt-0.5">{v.goal}</p>
                      <p className="text-xs text-green mt-0.5">💰 {v.monetizationAngle}</p>
                    </div>
                    <div className="flex items-center">
                      <Tag2>{v.type}</Tag2>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          <div className="grid sm:grid-cols-2 gap-5">
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Series Ideas</h4>
              <div className="space-y-2">
                {(r.seriesIdeas as { name: string; episodes: number; why: string }[]).map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-bg-side border border-line">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-text-1">{s.name}</span>
                      <Tag2>{s.episodes} eps</Tag2>
                    </div>
                    <p className="text-xs text-text-3">{s.why}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">Milestones</h4>
              <div className="space-y-2">
                {(r.milestones as { week: number; goal: string }[]).map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="size-5 rounded-full border-2 border-violet/40 bg-violet/10 text-violet-2 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">W{m.week}</span>
                    <p className="text-sm text-text-1">{m.goal}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// ── Tab: Revenue Calculator ────────────────────────────────────────────────

function RevenueTab() {
  const {
    revSubscribers, setRevSubscribers,
    revMonthlyViews, setRevMonthlyViews,
    revCPM, setRevCPM,
    revSponsorRate, setRevSponsorRate,
    revResult, setRevResult,
    loading, setLoading, error, setError,
  } = useYouTube();

  async function run() {
    setLoading(true); setError(null);
    try {
      const data = await ytPost<Record<string, unknown>>("revenue", {
        subscribers: revSubscribers,
        monthlyViews: revMonthlyViews,
        avgCPM: revCPM,
        sponsorRate: revSponsorRate,
      });
      setRevResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const r = revResult as Record<string, unknown> | null;
  const monthly = r?.monthly as Record<string, number> | undefined;

  const CPM_BENCHMARKS = [
    { niche: "Finance / Investing", cpm: "$12–$25" },
    { niche: "Business / Entrepreneurship", cpm: "$10–$18" },
    { niche: "Tech / Software", cpm: "$8–$15" },
    { niche: "Health & Wellness", cpm: "$5–$10" },
    { niche: "Education", cpm: "$4–$8" },
    { niche: "Entertainment / Vlogging", cpm: "$2–$5" },
    { niche: "Gaming", cpm: "$1.5–$4" },
  ];

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-sm font-semibold text-text-1 mb-4 flex items-center gap-2">
          <DollarSign className="size-4 text-violet-2" /> YouTube Revenue Calculator
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {[
            { label: "Subscribers", value: revSubscribers, set: setRevSubscribers, min: 0, max: 10000000, step: 1000 },
            { label: "Monthly Views", value: revMonthlyViews, set: setRevMonthlyViews, min: 0, max: 50000000, step: 10000 },
            { label: "Average CPM ($)", value: revCPM, set: setRevCPM, min: 0.5, max: 50, step: 0.5 },
            { label: "Sponsor Rate per Video ($)", value: revSponsorRate, set: setRevSponsorRate, min: 0, max: 50000, step: 100 },
          ].map(({ label, value, set, min, max, step }) => (
            <div key={label}>
              <Label>{label}</Label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={value}
                  min={min} max={max} step={step}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-full rounded-lg border border-line bg-bg-input px-3 py-2 text-sm text-text-1 focus:outline-none focus:ring-2 focus:ring-violet/50"
                />
              </div>
            </div>
          ))}
        </div>
        <RunBtn onClick={run} loading={loading} label="Calculate Revenue" />
        {error && <p className="mt-3 text-xs text-red">{error}</p>}
      </Card>

      {r && monthly && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Monthly AdSense", value: `$${monthly.adsense.toLocaleString()}`, icon: <Eye className="size-4" /> },
              { label: "Sponsorships", value: `$${monthly.sponsorships.toLocaleString()}`, icon: <Users className="size-4" /> },
              { label: "Memberships + Affiliate", value: `$${(monthly.memberships + monthly.affiliate).toLocaleString()}`, icon: <TrendingUp className="size-4" /> },
              { label: "Total Monthly", value: `$${monthly.total.toLocaleString()}`, icon: <DollarSign className="size-4" />, highlight: true },
            ].map((s) => (
              <Card key={s.label} className={s.highlight ? "border-green/40 bg-green/5" : ""}>
                <div className={cn("mb-2", s.highlight ? "text-green" : "text-text-3")}>{s.icon}</div>
                <div className={cn("text-xl font-black", s.highlight ? "text-green" : "text-text-1")}>
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-text-3 mt-1">{s.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <Card>
              <div className="text-[10px] uppercase tracking-widest text-text-3 mb-1">Annual Revenue</div>
              <div className="text-2xl font-black text-text-1">
                ${(r.annual as Record<string, number>).total.toLocaleString()}
              </div>
            </Card>
            <Card>
              <div className="text-[10px] uppercase tracking-widest text-text-3 mb-1">Effective RPM</div>
              <div className="text-2xl font-black text-text-1">${r.rpm as number}</div>
            </Card>
            <Card>
              <div className="text-[10px] uppercase tracking-widest text-text-3 mb-1">Days to Monetize</div>
              <div className="text-2xl font-black text-text-1 text-sm mt-1">{r.daysToMonetize as string}</div>
            </Card>
          </div>
        </>
      )}

      <Card>
        <h4 className="text-xs font-semibold text-text-2 mb-3 uppercase tracking-wider">CPM Benchmarks by Niche</h4>
        <div className="space-y-1.5">
          {CPM_BENCHMARKS.map((b) => (
            <div key={b.niche} className="flex items-center justify-between text-sm py-1 border-b border-line last:border-0">
              <span className="text-text-2">{b.niche}</span>
              <span className="font-semibold text-text-1">{b.cpm}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────

const TABS: { id: YtTab; label: string; Icon: React.ElementType }[] = [
  { id: "research",  label: "Niche Research",  Icon: Search },
  { id: "script",    label: "Script",           Icon: FileText },
  { id: "seo",       label: "SEO Lab",          Icon: Tag },
  { id: "thumbnail", label: "Thumbnail",        Icon: Image },
  { id: "calendar",  label: "Calendar",         Icon: Calendar },
  { id: "revenue",   label: "Revenue",          Icon: DollarSign },
];

export function YouTube() {
  const { activeTab, setActiveTab } = useYouTube();

  return (
    <div className="p-6 sm:p-10 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-xl bg-red-600/10 flex items-center justify-center">
            <Youtube className="size-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-1">YouTube AI Automation</h1>
            <p className="text-xs text-text-3">AI-powered tools to grow your channel and maximize revenue</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5">
          {[
            { label: "Niche Research", desc: "Find profitable niches", icon: "🔍" },
            { label: "Script Writer", desc: "High-retention scripts", icon: "✍️" },
            { label: "SEO Optimizer", desc: "Titles, tags & descriptions", icon: "🎯" },
            { label: "Thumbnail Brief", desc: "CTR-optimized visuals", icon: "🖼️" },
            { label: "Content Calendar", desc: "30-90 day schedule", icon: "📅" },
            { label: "Revenue Calculator", desc: "Forecast your income", icon: "💰" },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg border border-line bg-bg-card text-center">
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-[10px] font-semibold text-text-1">{item.label}</div>
              <div className="text-[9px] text-text-3 mt-0.5 leading-tight">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-line">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-all",
              activeTab === id
                ? "text-violet-2 border-b-2 border-violet -mb-px bg-violet/[0.05]"
                : "text-text-3 hover:text-text-1"
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "research"  && <ResearchTab />}
      {activeTab === "script"    && <ScriptTab />}
      {activeTab === "seo"       && <SeoTab />}
      {activeTab === "thumbnail" && <ThumbnailTab />}
      {activeTab === "calendar"  && <CalendarTab />}
      {activeTab === "revenue"   && <RevenueTab />}
    </div>
  );
}
