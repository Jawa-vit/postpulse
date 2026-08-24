import React from 'react';
import { AlertTriangle, ShieldCheck, Flame, XCircle, ArrowRight, Copy, Check } from 'lucide-react';
import type { ScrollRisk } from '../types';

interface ScrollRiskScannerProps {
  scrollRisk: ScrollRisk;
  onApplyHook?: (newHook: string) => void;
}

export const ScrollRiskScanner: React.FC<ScrollRiskScannerProps> = ({
  scrollRisk,
  onApplyHook
}) => {
  const [copied, setCopied] = React.useState(false);

  const isHighRisk = scrollRisk.scroll_risk === 'High';
  const isMedRisk = scrollRisk.scroll_risk === 'Medium';

  const riskBadgeColor = isHighRisk
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    : isMedRisk
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  const handleCopy = () => {
    if (scrollRisk.suggested_better_hook) {
      navigator.clipboard.writeText(scrollRisk.suggested_better_hook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
            isHighRisk ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
          }`}>
            {isHighRisk ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Why will people scroll past this?</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-slate-800 text-slate-300">
                Retention Diagnostic
              </span>
            </h3>
            <p className="text-xs text-slate-400">First 3-second reader friction scanner</p>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Scroll Risk:</span>
          <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${riskBadgeColor}`}>
            {scrollRisk.scroll_risk.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Diagnostic Reason */}
      <div className="mb-5 bg-slate-900/60 rounded-xl p-4 border border-slate-800/80">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
          Forensic Cause:
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          {scrollRisk.risk_reason || 'Opening sentence lacks immediate curiosity or emotional tension.'}
        </p>
      </div>

      {/* Before vs After Hook Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weak Hook */}
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400 mb-2">
              <XCircle className="w-4 h-4" />
              <span>Current Opening ({scrollRisk.word_count} words)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 italic bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
              "{scrollRisk.hook_sentence || 'No opening sentence detected.'}"
            </p>
          </div>
          <div className="text-[11px] text-rose-400/80 mt-3">
            ⚠️ Delayed payoff causes 65%+ of mobile users to keep scrolling.
          </div>
        </div>

        {/* High Converting Better Hook */}
        <div className="bg-violet-950/20 border border-violet-500/30 rounded-xl p-4 flex flex-col justify-between shadow-lg shadow-purple-500/5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-violet-300">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>High-Converting Hook Alternative</span>
              </div>
              <button
                onClick={handleCopy}
                className="text-[11px] flex items-center space-x-1 text-slate-400 hover:text-violet-300 transition-colors bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/60"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-white font-medium bg-slate-900/60 p-3 rounded-lg border border-violet-500/20">
              "{scrollRisk.suggested_better_hook || '🚀 99% of people struggle with this. Here is the exact fix:'}"
            </p>
          </div>

          {onApplyHook && scrollRisk.suggested_better_hook && (
            <button
              onClick={() => onApplyHook(scrollRisk.suggested_better_hook)}
              className="mt-3 flex items-center justify-center space-x-1.5 text-xs font-semibold text-violet-300 hover:text-white bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 py-2 px-3 rounded-lg transition-all"
            >
              <span>Apply Hook to Draft</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
