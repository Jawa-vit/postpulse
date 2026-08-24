import React, { useState } from 'react';
import { Layers, Copy, Check, Info, Briefcase, Camera, Send, MessageCircle } from 'lucide-react';
import type { Platforms, PlatformFormat } from '../types';

interface PlatformTransformerProps {
  platforms: Platforms;
}

export const PlatformTransformer: React.FC<PlatformTransformerProps> = ({ platforms }) => {
  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'instagram' | 'twitter' | 'threads'>('linkedin');
  const [copied, setCopied] = useState(false);
  const [showThread, setShowThread] = useState(false);

  const currentData: PlatformFormat = platforms[activePlatform] || {
    platform: 'LinkedIn',
    content: 'Transforming post...',
    character_count: 0,
    tips: 'Optimized for high reach.'
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platformTabs = [
    { id: 'linkedin', label: 'LinkedIn', icon: Briefcase, color: 'text-blue-400' },
    { id: 'instagram', label: 'Instagram', icon: Camera, color: 'text-pink-400' },
    { id: 'twitter', label: 'X / Twitter', icon: Send, color: 'text-sky-400' },
    { id: 'threads', label: 'Threads', icon: MessageCircle, color: 'text-purple-400' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Platform Transformer</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase bg-purple-500/20 text-purple-300">
                Multi-Channel Layout
              </span>
            </h3>
            <p className="text-xs text-slate-400">Audience-calibrated formatting tailored for each network</p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {platformTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActivePlatform(tab.id as any);
                  setShowThread(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activePlatform === tab.id
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activePlatform === tab.id ? 'text-white' : tab.color}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Platform Specific Tip Header */}
        <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Info className="w-4 h-4 text-violet-400 shrink-0" />
            <span>{currentData.tips}</span>
          </div>

          <div className="flex items-center space-x-2">
            {activePlatform === 'twitter' && platforms.twitter?.thread && (
              <button
                onClick={() => setShowThread(!showThread)}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/20"
              >
                {showThread ? 'View Single Post' : 'View Thread Format'}
              </button>
            )}
            <button
              onClick={() => handleCopy(showThread && platforms.twitter?.thread ? platforms.twitter.thread.join('\n\n---\n\n') : currentData.content)}
              className="flex items-center space-x-1.5 text-xs font-semibold bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white px-3 py-1 rounded-lg border border-violet-500/30 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Formatted Post'}</span>
            </button>
          </div>
        </div>

        {/* Social Mockup Preview Frame */}
        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800/90 font-sans shadow-inner">
          {/* Clean Author Header */}
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-900">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs">
              ME
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Your Name / Channel</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {activePlatform === 'linkedin' ? 'Professional Update' : 'Social Draft Preview'}
              </div>
            </div>
          </div>

          {/* Render Content */}
          {activePlatform === 'twitter' && showThread && platforms.twitter?.thread ? (
            <div className="space-y-4">
              {platforms.twitter.thread.map((tweet, idx) => (
                <div key={idx} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {tweet}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-slate-100 whitespace-pre-wrap leading-relaxed font-sans">
              {currentData.content}
            </div>
          )}

          {/* Clean Footer Metrics */}
          <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>{currentData.character_count || currentData.content.length} characters</span>
            <span className="text-slate-400">Editorial Pacing Applied</span>
          </div>
        </div>
      </div>
    </div>
  );
};
