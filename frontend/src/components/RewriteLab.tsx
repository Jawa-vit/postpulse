import React, { useState } from 'react';
import { Sparkles, Shield, Flame, BookOpen, MessageCircle } from 'lucide-react';
import type { Rewrites, RewriteStrategy } from '../types';
import { DiffViewer } from './DiffViewer';

interface RewriteLabProps {
  rewrites: Rewrites;
  originalText: string;
}

export const RewriteLab: React.FC<RewriteLabProps> = ({ rewrites, originalText }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'viral' | 'safe' | 'expert' | 'human'>('viral');

  const strategies = [
    {
      id: 'viral',
      name: 'High Engagement',
      tagline: 'Direct curiosity hook, bulleted takeaways & clear discussion prompt.',
      icon: Flame,
      color: 'border-amber-500/30 text-amber-300 bg-amber-500/10'
    },
    {
      id: 'safe',
      name: 'Clean Polish',
      tagline: 'Polished phrasing and clear closing while preserving your voice.',
      icon: Shield,
      color: 'border-blue-500/30 text-blue-300 bg-blue-500/10'
    },
    {
      id: 'expert',
      name: 'Authority & Case Study',
      tagline: 'Structured technical retrospective establishing domain credibility.',
      icon: BookOpen,
      color: 'border-purple-500/30 text-purple-300 bg-purple-500/10'
    },
    {
      id: 'human',
      name: 'Authentic Story',
      tagline: 'Candid, relatable narrative that builds genuine connection.',
      icon: MessageCircle,
      color: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
    }
  ];

  const currentRewrite: RewriteStrategy = rewrites[selectedStrategy] || rewrites.viral;

  return (
    <div className="space-y-6">
      {/* Strategy Selection Grid */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Revision Lab</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-violet-500/20 text-violet-300">
                4 Editorial Approaches
              </span>
            </h3>
            <p className="text-xs text-slate-400">Select an editorial strategy tailored to your target audience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {strategies.map((strat) => {
            const Icon = strat.icon;
            const isSelected = selectedStrategy === strat.id;
            const stratData = rewrites[strat.id as keyof Rewrites];

            return (
              <button
                key={strat.id}
                onClick={() => setSelectedStrategy(strat.id as any)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-purple-500/10 scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Icon className="w-4 h-4 text-violet-400" />
                      <span>{strat.name}</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      {stratData?.predicted_score || 85} Score
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{strat.tagline}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-violet-400 font-semibold flex items-center gap-1">
                  <span>{isSelected ? '● Active Strategy' : 'Select Strategy'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Before vs After Diff Viewer */}
      <DiffViewer
        originalText={originalText}
        improvedText={currentRewrite.content}
        improvements={currentRewrite.improvements}
        strategyName={currentRewrite.name}
      />
    </div>
  );
};
