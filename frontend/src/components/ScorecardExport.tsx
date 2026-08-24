import React, { useState } from 'react';
import { Award, Printer, Copy, Check } from 'lucide-react';
import type { Scorecard, ContentDNA } from '../types';

interface ScorecardExportProps {
  scorecard: Scorecard;
  dna: ContentDNA;
}

export const ScorecardExport: React.FC<ScorecardExportProps> = ({ scorecard, dna }) => {
  const [copied, setCopied] = useState(false);

  const formattedReport = `
╔═══════════════════════════════════════════╗
║         POSTPULSE CONTENT REPORT          ║
╠═══════════════════════════════════════════╣
║  Predicted Engagement Potential : ${scorecard.engagement_potential.toString().padEnd(6)}  ║
║  Hook Strength                  : ${dna.hook_strength.toString().padEnd(6)}  ║
║  Clarity & Structure            : ${dna.clarity.toString().padEnd(6)}  ║
║  Emotional Impact               : ${dna.emotional_impact.toString().padEnd(6)}  ║
║  CTA Strength                   : ${dna.cta_strength.toString().padEnd(6)}  ║
║  Readability Score              : ${dna.readability.toString().padEnd(6)}  ║
╠═══════════════════════════════════════════╣
║  Overall Content Health         : ${scorecard.overall_health.toString().padEnd(6)}% ║
╚═══════════════════════════════════════════╝

Assessment Verdict: ${scorecard.verdict}
Tone: ${dna.meta.tone} | Emotion: ${dna.meta.primary_emotion} | Target: ${dna.meta.audience}
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Executive Content Scorecard</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-amber-500/20 text-amber-300">
                Summary Report
              </span>
            </h3>
            <p className="text-xs text-slate-400">Comprehensive distribution potential & structural health breakdown</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-purple-600/30"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Scorecard Copied' : 'Copy Formatted Report'}</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Terminal Box */}
      <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 overflow-x-auto shadow-inner">
        <div className="text-indigo-400 font-bold mb-2"># CONTENT PERFORMANCE AUDIT</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 py-3 border-y border-slate-800/80">
          <div className="flex justify-between">
            <span className="text-slate-400">Engagement Potential:</span>
            <span className="font-bold text-emerald-400">{scorecard.engagement_potential} / 100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Hook Strength:</span>
            <span className="font-bold text-indigo-300">{dna.hook_strength} / 100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Message Clarity:</span>
            <span className="font-bold text-slate-200">{dna.clarity} / 100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Emotional Resonance:</span>
            <span className="font-bold text-rose-300">{dna.emotional_impact} / 100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">CTA Effectiveness:</span>
            <span className="font-bold text-amber-300">{dna.cta_strength} / 100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Readability Score:</span>
            <span className="font-bold text-sky-300">{dna.readability} / 100</span>
          </div>
          <div className="flex justify-between sm:col-span-2 pt-2 border-t border-slate-900">
            <span className="text-slate-400">Overall Content Health:</span>
            <span className="font-bold text-teal-300">{scorecard.overall_health}% Clean</span>
          </div>
        </div>

        {/* Verdict Callout */}
        <div className="mt-3 pt-2 text-xs font-sans">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Assessment Verdict: </span>
          <span className="text-slate-100 font-medium">{scorecard.verdict}</span>
        </div>
      </div>
    </div>
  );
};
