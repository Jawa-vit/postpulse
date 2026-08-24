import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import type { SamplePost } from '../types';

interface NavbarProps {
  backendConnected: boolean;
  samplePosts: SamplePost[];
  onSelectSample: (sample: SamplePost) => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  backendConnected,
  samplePosts,
  onSelectSample,
  onReset
}) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with New Geometric Prism Mark */}
        <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/35 transition-all duration-300">
            <div className="w-full h-full bg-[#0D121F] rounded-[10px] flex items-center justify-center overflow-hidden">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ppGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                  <linearGradient id="ppGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                </defs>
                {/* Modern Isometric Twin Hexagon / Layered Prism */}
                <path d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z" stroke="url(#ppGrad1)" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity="0.5" />
                <path d="M16 7L23 11V21L16 25L9 21V11L16 7Z" fill="url(#ppGrad2)" fillOpacity="0.2" stroke="url(#ppGrad1)" strokeWidth="1.5" strokeLinejoin="round" />
                {/* Dynamic Forward Beam */}
                <path d="M12 16L16 12L20 16L16 20L12 16Z" fill="url(#ppGrad1)" />
                <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-white font-sans">
                Post<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300">Pulse</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-mono font-bold bg-slate-800/90 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">Content Intelligence & Distribution Platform</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Quick Scenario Selector */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-3 py-1.5 rounded-lg transition-all shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Test Scenario</span>
            </button>
            <div className="absolute right-0 mt-2 w-64 glass-panel-glow rounded-xl p-2 hidden group-hover:block z-50 shadow-2xl border border-slate-700">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Select Benchmark Sample
              </div>
              {samplePosts.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  className="w-full text-left p-2 rounded-lg hover:bg-indigo-600/15 hover:text-indigo-300 text-slate-300 text-xs transition-colors"
                >
                  <div className="font-semibold">{sample.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{sample.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Engine Status Pill */}
          <div className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60">
            {backendConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
                <span className="text-emerald-400 font-medium font-mono text-[11px]">Engine Ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-medium font-mono text-[11px]">Ready</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
