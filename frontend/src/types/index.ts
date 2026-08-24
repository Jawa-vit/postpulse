export interface ContentDNA {
  hook_strength: number;
  clarity: number;
  emotional_impact: number;
  readability: number;
  cta_strength: number;
  originality: number;
  grade_level: number;
  meta: {
    tone: string;
    primary_emotion: string;
    audience: string;
    content_type: string;
  };
}

export interface ScrollRisk {
  hook_score: number;
  hook_sentence: string;
  word_count: number;
  scroll_risk: 'High' | 'Medium' | 'Low';
  risk_reason: string;
  suggested_better_hook: string;
  has_fluff_starter?: boolean;
}

export interface CTAAnalysis {
  cta_score: number;
  has_high_intent_cta: boolean;
  has_medium_intent_cta: boolean;
  keywords_found: string[];
  assessment: string;
}

export interface PsychologyScores {
  curiosity: number;
  trust: number;
  urgency: number;
  emotion: number;
}

export interface HealthCheckItem {
  label: string;
  passed: boolean;
  detail: string;
}

export interface ContentHealth {
  health_score: number;
  checklist: HealthCheckItem[];
  vocabulary_richness: number;
  avg_sentence_length: number;
  hashtag_count: number;
  is_spam_free: boolean;
}

export interface Scorecard {
  engagement_potential: number;
  overall_health: number;
  verdict: string;
  stats: {
    word_count: number;
    character_count: number;
    sentence_count: number;
    avg_sentence_len: number;
  };
}

export interface SimulationMetrics {
  overall: number;
  hook: number;
  clarity: number;
  cta: number;
  emotion: number;
  readability: number;
}

export interface Simulation {
  original: SimulationMetrics;
  improved: SimulationMetrics;
  aggressive_hook: SimulationMetrics;
  deltas: {
    hook: string;
    clarity: string;
    cta: string;
    emotion: string;
    readability: string;
    overall: string;
  };
}

export interface PlatformFormat {
  platform: string;
  content: string;
  character_count: number;
  tips: string;
  thread?: string[];
}

export interface Platforms {
  linkedin: PlatformFormat;
  instagram: PlatformFormat;
  twitter: PlatformFormat;
  threads: PlatformFormat;
}

export interface RewriteStrategy {
  strategy: string;
  name: string;
  tagline: string;
  content: string;
  predicted_score: number;
  improvements: string[];
}

export interface Rewrites {
  safe: RewriteStrategy;
  viral: RewriteStrategy;
  expert: RewriteStrategy;
  human: RewriteStrategy;
}

export interface AnalysisResult {
  success: boolean;
  input_text: string;
  dna: ContentDNA;
  scroll_risk: ScrollRisk;
  cta_analysis: CTAAnalysis;
  psychology: PsychologyScores;
  content_health: ContentHealth;
  scorecard: Scorecard;
  simulation: Simulation;
  platforms: Platforms;
  rewrites: Rewrites;
}

export interface SamplePost {
  id: string;
  title: string;
  category: string;
  text: string;
  description: string;
}

export interface ExtractResponse {
  success: boolean;
  text: string;
  file_type: string;
  file_name: string;
  word_count: number;
  character_count: number;
  details: Record<string, any>;
  error?: string;
}
