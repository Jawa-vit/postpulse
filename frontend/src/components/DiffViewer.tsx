import React, { useState } from 'react';
import { GitCompare, Check, Copy, CheckCircle2, FileCheck } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  improvedText: string;
  improvements: string[];
  strategyName: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalText,
  improvedText,
  improvements,
  strategyName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Editorial Revision (Before vs After)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase bg-violet-500/20 text-violet-300">
                {strategyName}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Direct comparison of structural and psychological improvements</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-violet-600/30"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Revised Version'}</span>
        </button>
      </div>

      {/* Side-by-Side Diff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Before */}
        <div className="bg-slate-950/70 border border-rose-950/40 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Original Draft</span>
              <span className="text-[10px] text-slate-500 font-mono">Unoptimized</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              {originalText}
            </div>
          </div>
        </div>

        {/* After */}
        <div className="bg-slate-950/70 border border-emerald-950/40 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-emerald-950/10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Revised Version</span>
              <span className="text-[10px] text-emerald-400 font-mono">High Retention</span>
            </div>
            <div className="text-xs sm:text-sm text-white whitespace-pre-wrap leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20">
              {improvedText}
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Diagnostic Rationale */}
      <div className="bg-slate-900/70 rounded-xl p-4 border border-slate-800">
        <div className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-violet-400" />
          <span>Editorial Breakdown (Why this version performs better)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {improvements.map((reason, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
