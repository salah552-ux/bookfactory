import { create } from "zustand";

export type YtTab = "research" | "script" | "seo" | "thumbnail" | "calendar" | "revenue";

interface YouTubeStore {
  activeTab: YtTab;
  setActiveTab: (t: YtTab) => void;

  researchNiche: string;
  setResearchNiche: (v: string) => void;
  researchResult: Record<string, unknown> | null;
  setResearchResult: (v: Record<string, unknown> | null) => void;

  scriptTopic: string;
  setScriptTopic: (v: string) => void;
  scriptStyle: string;
  setScriptStyle: (v: string) => void;
  scriptDuration: string;
  setScriptDuration: (v: string) => void;
  scriptResult: Record<string, unknown> | null;
  setScriptResult: (v: Record<string, unknown> | null) => void;

  seoTopic: string;
  setSeoTopic: (v: string) => void;
  seoNiche: string;
  setSeoNiche: (v: string) => void;
  seoResult: Record<string, unknown> | null;
  setSeoResult: (v: Record<string, unknown> | null) => void;

  thumbTitle: string;
  setThumbTitle: (v: string) => void;
  thumbNiche: string;
  setThumbNiche: (v: string) => void;
  thumbResult: Record<string, unknown> | null;
  setThumbResult: (v: Record<string, unknown> | null) => void;

  calNiche: string;
  setCalNiche: (v: string) => void;
  calFrequency: string;
  setCalFrequency: (v: string) => void;
  calWeeks: number;
  setCalWeeks: (v: number) => void;
  calResult: Record<string, unknown> | null;
  setCalResult: (v: Record<string, unknown> | null) => void;

  revSubscribers: number;
  setRevSubscribers: (v: number) => void;
  revMonthlyViews: number;
  setRevMonthlyViews: (v: number) => void;
  revCPM: number;
  setRevCPM: (v: number) => void;
  revSponsorRate: number;
  setRevSponsorRate: (v: number) => void;
  revResult: Record<string, unknown> | null;
  setRevResult: (v: Record<string, unknown> | null) => void;

  loading: boolean;
  setLoading: (v: boolean) => void;
  error: string | null;
  setError: (v: string | null) => void;
}

export const useYouTube = create<YouTubeStore>((set) => ({
  activeTab: "research",
  setActiveTab: (t) => set({ activeTab: t }),

  researchNiche: "",
  setResearchNiche: (v) => set({ researchNiche: v }),
  researchResult: null,
  setResearchResult: (v) => set({ researchResult: v }),

  scriptTopic: "",
  setScriptTopic: (v) => set({ scriptTopic: v }),
  scriptStyle: "educational entertaining",
  setScriptStyle: (v) => set({ scriptStyle: v }),
  scriptDuration: "8-10 minutes",
  setScriptDuration: (v) => set({ scriptDuration: v }),
  scriptResult: null,
  setScriptResult: (v) => set({ scriptResult: v }),

  seoTopic: "",
  setSeoTopic: (v) => set({ seoTopic: v }),
  seoNiche: "",
  setSeoNiche: (v) => set({ seoNiche: v }),
  seoResult: null,
  setSeoResult: (v) => set({ seoResult: v }),

  thumbTitle: "",
  setThumbTitle: (v) => set({ thumbTitle: v }),
  thumbNiche: "",
  setThumbNiche: (v) => set({ thumbNiche: v }),
  thumbResult: null,
  setThumbResult: (v) => set({ thumbResult: v }),

  calNiche: "",
  setCalNiche: (v) => set({ calNiche: v }),
  calFrequency: "3x per week",
  setCalFrequency: (v) => set({ calFrequency: v }),
  calWeeks: 4,
  setCalWeeks: (v) => set({ calWeeks: v }),
  calResult: null,
  setCalResult: (v) => set({ calResult: v }),

  revSubscribers: 10000,
  setRevSubscribers: (v) => set({ revSubscribers: v }),
  revMonthlyViews: 100000,
  setRevMonthlyViews: (v) => set({ revMonthlyViews: v }),
  revCPM: 4,
  setRevCPM: (v) => set({ revCPM: v }),
  revSponsorRate: 500,
  setRevSponsorRate: (v) => set({ revSponsorRate: v }),
  revResult: null,
  setRevResult: (v) => set({ revResult: v }),

  loading: false,
  setLoading: (v) => set({ loading: v }),
  error: null,
  setError: (v) => set({ error: v }),
}));
