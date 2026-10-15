import React from 'react';
import { HeartPulse, MessageSquare, GitCompare, BookOpen, Sparkles, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: 'demo' | 'compare' | 'rationale' | 'playground';
  setActiveTab: (tab: 'demo' | 'compare' | 'rationale' | 'playground') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  showSwahili: boolean;
  setShowSwahili: (show: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  showSwahili,
  setShowSwahili,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-900/30">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">PROMPTS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                  Jacaranda Health
                </span>
                <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono border border-cyan-500/20">
                  AI Edge Case Demo
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Maternal SMS Gestational Pathway & Re-enrolment Triage Simulator
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'demo'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Simulated Conversations</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'compare'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span className="hidden md:inline">Pathway Comparison</span>
              <span className="md:hidden">Compare</span>
            </button>

            <button
              onClick={() => setActiveTab('rationale')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'rationale'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Clinical & Slack Analysis</span>
              <span className="md:hidden">Rationale</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'playground'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Live AI Test</span>
            </button>
          </nav>

          {/* Toggles */}
          <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
            <button
              onClick={() => setShowSwahili((prev) => !prev)}
              title="Toggle Swahili translation"
              className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
                showSwahili
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {showSwahili ? 'Swahili: ON' : 'Swahili: OFF'}
            </button>

            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
