import React from 'react';
import { Microscope, CheckCircle2, AlertTriangle, ShieldCheck, Heart, Sparkles, Lock, Flame } from 'lucide-react';
import type { ContentHealth, PsychologyScores } from '../types';

interface ContentForensicsProps {
  health: ContentHealth;
  psychology: PsychologyScores;
}

export const ContentForensics: React.FC<ContentForensicsProps> = ({
  health,
  psychology
}) => {
  const psychItems = [
    { label: 'Curiosity Trigger', score: psychology.curiosity, icon: Sparkles, color: 'bg-violet-500', text: 'text-violet-400' },
    { label: 'Trust & Credibility', score: psychology.trust, icon: Lock, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { label: 'Urgency / Action', score: psychology.urgency, icon: Flame, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Emotional Resonance', score: psychology.emotion, icon: Heart, color: 'bg-rose-500', text: 'text-rose-400' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Microscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Content Forensics</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-teal-500/20 text-teal-300">
                Health & Psychology
              </span>
            </h3>
            <p className="text-xs text-slate-400">Deep structural hygiene & cognitive impact audit</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Health Index: </span>
          <span className="text-xs font-mono font-bold text-teal-300">{health.health_score}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Content Health Checklist */}
        <div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Content Health Audit</span>
          </div>

          <div className="space-y-2.5">
            {health.checklist.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className={item.passed ? 'text-slate-200 font-medium' : 'text-amber-200/90 font-medium'}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Audience Psychology Levers */}
        <div>
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Audience Psychology Levers</span>
          </div>

          <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            {psychItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Icon className={`w-3.5 h-3.5 ${item.text}`} />
                      <span className="text-slate-300 font-medium">{item.label}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-200">{item.score}/100</span>
                  </div>

                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${item.color}`}
                      style={{ width: `${Math.min(100, Math.max(10, item.score))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-[11px] text-slate-400 italic text-center">
            Scores reflect psycholinguistic triggers influencing reader comments and shares.
          </div>
        </div>
      </div>
    </div>
  );
};
