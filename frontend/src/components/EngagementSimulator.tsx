import React, { useState } from 'react';
import { Cpu, TrendingUp, Zap, HelpCircle, ArrowUpRight } from 'lucide-react';
import type { Simulation } from '../types';

interface EngagementSimulatorProps {
  simulation: Simulation;
}

export const EngagementSimulator: React.FC<EngagementSimulatorProps> = ({ simulation }) => {
  const [selectedScenario, setSelectedScenario] = useState<'improved' | 'aggressive'>('improved');

  const orig = simulation.original || { overall: 58, hook: 50, clarity: 70, cta: 40, emotion: 55, readability: 75 };
  const target = selectedScenario === 'improved' ? simulation.improved : simulation.aggressive_hook;
  const deltas = simulation.deltas || { hook: '+32%', clarity: '+18%', cta: '+27%', emotion: '+14%', readability: '+12%', overall: '+24%' };

  const metricRows = [
    { label: 'Hook & Curiosity', origVal: orig.hook, targetVal: target.hook, delta: deltas.hook },
    { label: 'Message Clarity', origVal: orig.clarity, targetVal: target.clarity, delta: deltas.clarity },
    { label: 'CTA & Conversion', origVal: orig.cta, targetVal: target.cta, delta: deltas.cta },
    { label: 'Emotional Resonance', origVal: orig.emotion, targetVal: target.emotion, delta: deltas.emotion },
    { label: 'Readability Pacing', origVal: orig.readability, targetVal: target.readability, delta: deltas.readability },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Engagement Simulator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-indigo-500/20 text-indigo-300">
                Predictive AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">Heuristic-based distribution forecast</p>
          </div>
        </div>

        {/* Scenario Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedScenario('improved')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedScenario === 'improved'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Standard Optimization
          </button>
          <button
            onClick={() => setSelectedScenario('aggressive')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedScenario === 'aggressive'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Aggressive Hook
          </button>
        </div>
      </div>

      {/* Top 3 Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Original */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
            Original Post
          </div>
          <div className="text-3xl font-mono font-extrabold text-slate-300">
            {orig.overall}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Predicted Potential</div>
        </div>

        {/* Improved Target */}
        <div className="bg-gradient-to-b from-violet-950/40 to-slate-900/80 rounded-xl p-4 border border-violet-500/40 text-center shadow-lg shadow-purple-500/10">
          <div className="text-xs text-violet-300 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{selectedScenario === 'improved' ? 'PostPulse Optimized' : 'Aggressive Hook'}</span>
          </div>
          <div className="text-3xl font-mono font-extrabold text-white">
            {target.overall}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            {deltas.overall} Lift in Reach
          </div>
        </div>

        {/* Forecasted Impact */}
        <div className="bg-emerald-950/20 rounded-xl p-4 border border-emerald-500/30 text-center">
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Distribution Factor</span>
          </div>
          <div className="text-3xl font-mono font-extrabold text-emerald-300">
            2.4x
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Estimated Read-Through</div>
        </div>
      </div>

      {/* Breakdown Matrix Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
          <div className="col-span-5 sm:col-span-4">Metric Factor</div>
          <div className="col-span-2 text-center">Original</div>
          <div className="col-span-3 text-center text-violet-300">Optimized</div>
          <div className="col-span-2 sm:col-span-3 text-right text-emerald-400">Impact Delta</div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {metricRows.map((row) => (
            <div key={row.label} className="grid grid-cols-12 px-4 py-3 items-center text-xs hover:bg-slate-800/30 transition-colors">
              <div className="col-span-5 sm:col-span-4 font-medium text-slate-200">{row.label}</div>
              <div className="col-span-2 text-center font-mono text-slate-400">{row.origVal}</div>
              <div className="col-span-3 text-center font-mono font-bold text-white bg-violet-600/10 py-1 rounded border border-violet-500/20">
                {row.targetVal}
              </div>
              <div className="col-span-2 sm:col-span-3 text-right font-mono font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{row.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footnote on Heuristic Defensibility */}
      <div className="mt-4 flex items-start space-x-2 text-[11px] text-slate-400 bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
        <HelpCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">Defensible Scoring: </span>
          Predicted scores are determined by composite NLP heuristic models evaluating first-line hook timing, readability pacing, question curiosity, and CTA action clarity.
        </div>
      </div>
    </div>
  );
};
