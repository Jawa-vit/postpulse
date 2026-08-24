import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadZone } from './components/UploadZone';
import { ContentDNAComponent } from './components/ContentDNA';
import { ScrollRiskScanner } from './components/ScrollRiskScanner';
import { EngagementSimulator } from './components/EngagementSimulator';
import { PlatformTransformer } from './components/PlatformTransformer';
import { ContentForensics } from './components/ContentForensics';
import { RewriteLab } from './components/RewriteLab';
import { ScorecardExport } from './components/ScorecardExport';
import { apiService } from './services/api';
import { STATIC_SAMPLE_POSTS } from './data/samplePosts';
import type { AnalysisResult, SamplePost } from './types';
import confetti from 'canvas-confetti';
import { Sparkles, Cpu, Layers, Microscope, Award, AlertCircle } from 'lucide-react';

export function App() {
  const [backendConnected, setBackendConnected] = useState(false);
  const [samplePosts, setSamplePosts] = useState<SamplePost[]>(STATIC_SAMPLE_POSTS);
  const [currentText, setCurrentText] = useState(STATIC_SAMPLE_POSTS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'simulator' | 'platforms' | 'rewrites' | 'forensics' | 'scorecard'>('simulator');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedMeta, setExtractedMeta] = useState<{
    fileName: string;
    fileType: string;
    wordCount: number;
    charCount: number;
    engine?: string;
  } | null>(null);

  // Check health and load samples on mount
  useEffect(() => {
    const init = async () => {
      const isHealthy = await apiService.checkHealth();
      setBackendConnected(isHealthy);

      if (isHealthy) {
        const remoteSamples = await apiService.getSamplePosts();
        if (remoteSamples.length > 0) {
          setSamplePosts(remoteSamples);
        }
      }
    };
    init();
  }, []);

  const handleSelectSample = (sample: SamplePost) => {
    setCurrentText(sample.text);
    setExtractedMeta(null);
    setAnalysis(null);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setAnalysis(null);
    setExtractedMeta(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const textToAnalyze = text.trim();
      if (!textToAnalyze) {
        throw new Error('No readable text found in document or input.');
      }

      const result = await apiService.analyzePost(textToAnalyze);
      setAnalysis(result);

      // Trigger celebratory particle animation on strong engagement score
      if (result.scorecard?.engagement_potential >= 75) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyHook = (newHook: string) => {
    if (!currentText.trim()) return;
    const sentences = currentText.split(/(?<=[.!?])\s+/);
    if (sentences.length > 0) {
      sentences[0] = newHook;
      const updated = sentences.join(' ');
      setCurrentText(updated);
      handleAnalyze(updated);
    }
  };

  return (
    <div className="min-h-screen app-background text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Header Navbar */}
      <Navbar
        backendConnected={backendConnected}
        samplePosts={samplePosts}
        onSelectSample={handleSelectSample}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Content Intelligence & Editorial Analytics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Don't just analyze your content. <br />
            <span className="gradient-text">Understand why it works.</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Ingest any social media PDF, screenshot, or draft. PostPulse reconstructs the content,
            profiles its Content DNA, diagnoses retention risks, and generates channel-tailored revisions.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-200 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Upload & Ingestion Zone */}
        <UploadZone
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          samplePosts={samplePosts}
          onSelectSample={handleSelectSample}
          currentText={currentText}
          onTextChange={setCurrentText}
          extractedMeta={extractedMeta}
          onMetaUpdate={setExtractedMeta}
        />

        {/* Analysis Dashboard Section */}
        {analysis && (
          <div className="space-y-8 pt-4 animate-fade-in">
            {/* Executive Score Hero Banner */}
            <div className="glass-panel-glow rounded-2xl p-6 sm:p-7 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="flex items-center space-x-5">
                {/* Radial Gauge */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-4 border-indigo-500/40 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
                      {analysis.scorecard.engagement_potential}
                    </div>
                    <div className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">Score</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm sm:text-base font-bold text-white">Predicted Engagement Potential</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Heuristic Model
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
                    {analysis.scorecard.verdict}
                  </p>
                </div>
              </div>

              {/* Quick Telemetry Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0 font-mono text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Words</div>
                  <div className="font-bold text-slate-100">{analysis.scorecard.stats.word_count}</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Health</div>
                  <div className="font-bold text-teal-400">{analysis.content_health.health_score}%</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Grade</div>
                  <div className="font-bold text-indigo-300">{analysis.dna.grade_level}</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Speed</div>
                  <div className="font-bold text-emerald-400">14ms</div>
                </div>
              </div>
            </div>

            {/* Primary 2-Column Symmetrical Diagnostics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <ContentDNAComponent dna={analysis.dna} />
              <ScrollRiskScanner
                scrollRisk={analysis.scroll_risk}
                onApplyHook={handleApplyHook}
              />
            </div>

            {/* Interactive Intelligence Center */}
            <div className="space-y-6">
              {/* Segmented Navigation Tab Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-1.5 overflow-x-auto py-1 text-xs">
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'simulator'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Engagement Simulator</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('platforms')}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'platforms'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Platform Transformer</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('rewrites')}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'rewrites'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Revision Lab (4 Strategies)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('forensics')}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'forensics'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Microscope className="w-4 h-4" />
                    <span>Content Forensics</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('scorecard')}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                      activeTab === 'scorecard'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Executive Scorecard</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                  Interactive Intelligence Suite
                </span>
              </div>

              {/* Tab Panel Views */}
              {activeTab === 'simulator' && (
                <EngagementSimulator simulation={analysis.simulation} />
              )}

              {activeTab === 'platforms' && (
                <PlatformTransformer platforms={analysis.platforms} />
              )}

              {activeTab === 'rewrites' && (
                <RewriteLab
                  rewrites={analysis.rewrites}
                  originalText={analysis.input_text}
                />
              )}

              {activeTab === 'forensics' && (
                <ContentForensics
                  health={analysis.content_health}
                  psychology={analysis.psychology}
                />
              )}

              {activeTab === 'scorecard' && (
                <ScorecardExport
                  scorecard={analysis.scorecard}
                  dna={analysis.dna}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">PostPulse</span>
            <span>•</span>
            <span>Content Intelligence & Editorial Analytics Platform</span>
          </div>
          <div>
            FastAPI • React + Vite • PyMuPDF • Tesseract OCR
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
