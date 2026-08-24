import React from 'react';
import { Dna, Zap, Eye, Heart, BookOpen, Target, Sparkles, Tag, Smile, Users } from 'lucide-react';
import type { ContentDNA } from '../types';

interface ContentDNAProps {
  dna: ContentDNA;
}

export const ContentDNAComponent: React.FC<ContentDNAProps> = ({ dna }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500';
    if (score >= 60) return 'text-violet-400 bg-violet-500';
    if (score >= 45) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  const getScoreBadgeBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    if (score >= 60) return 'bg-violet-500/10 text-violet-300 border-violet-500/20';
    if (score >= 45) return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
  };

  const dnaMetrics = [
    { label: 'Hook Strength', score: dna.hook_strength, icon: Zap, desc: 'Opening curiosity and speed to value' },
    { label: 'Clarity & Flow', score: dna.clarity, icon: Eye, desc: 'Message conciseness and logical structure' },
    { label: 'Emotional Impact', score: dna.emotional_impact, icon: Heart, desc: 'Curiosity, inspiration and feeling' },
    { label: 'Readability Ease', score: dna.readability, icon: BookOpen, desc: 'Flesch metric & sentence accessibility' },
    { label: 'CTA Strength', score: dna.cta_strength, icon: Target, desc: 'Conversion guidance and action clarity' },
    { label: 'Originality', score: dna.originality, icon: Sparkles, desc: 'Vocabulary freshness and metric depth' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>CONTENT DNA</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-violet-500/20 text-violet-300">
                Signature Profile
              </span>
            </h3>
            <p className="text-xs text-slate-400">Multidimensional algorithmic diagnostic</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Grade Level: </span>
          <span className="text-xs font-mono font-bold text-violet-300">Grade {dna.grade_level || '8.0'}</span>
        </div>
      </div>

      {/* Grid of DNA Metric Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
        {dnaMetrics.map((item) => {
          const Icon = item.icon;
          const colorClasses = getScoreColor(item.score);
          const badgeClasses = getScoreBadgeBg(item.score);

          return (
            <div
              key={item.label}
              className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800/80 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${colorClasses.split(' ')[0]}`} />
                  <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                </div>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${badgeClasses}`}>
                  {item.score}/100
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${colorClasses.split(' ')[1]}`}
                  style={{ width: `${Math.min(100, Math.max(8, item.score))}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Meta Profile Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/60 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center justify-center gap-1 mb-1">
            <Smile className="w-3 h-3 text-violet-400" />
            <span>Tone</span>
          </div>
          <div className="text-xs font-medium text-slate-200 truncate">{dna.meta?.tone || 'Professional'}</div>
        </div>

        <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/60 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center justify-center gap-1 mb-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Primary Emotion</span>
          </div>
          <div className="text-xs font-medium text-slate-200 truncate">{dna.meta?.primary_emotion || 'Curiosity'}</div>
        </div>

        <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/60 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center justify-center gap-1 mb-1">
            <Users className="w-3 h-3 text-cyan-400" />
            <span>Target Audience</span>
          </div>
          <div className="text-xs font-medium text-slate-200 truncate">{dna.meta?.audience || 'General Tech'}</div>
        </div>

        <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/60 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center justify-center gap-1 mb-1">
            <Tag className="w-3 h-3 text-emerald-400" />
            <span>Content Type</span>
          </div>
          <div className="text-xs font-medium text-slate-200 truncate">{dna.meta?.content_type || 'Educational'}</div>
        </div>
      </div>
    </div>
  );
};
