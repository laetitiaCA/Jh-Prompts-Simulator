import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PhoneSimulator } from './components/PhoneSimulator';
import { DualPhoneComparison } from './components/DualPhoneComparison';
import { PolicyAnalysisCard } from './components/PolicyAnalysisCard';
import { LivePlayground } from './components/LivePlayground';
import { SCENARIOS } from './data/scenarios';
import {
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  CalendarClock,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'compare' | 'rationale' | 'playground'>('demo');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSwahili, setShowSwahili] = useState<boolean>(false);

  const currentScenario =
    SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        showSwahili={showSwahili}
        setShowSwahili={setShowSwahili}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'demo' && (
          <div className="space-y-8">
            {/* Scenario Chooser Header */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    PROMPTS SMS Edge Case Simulation
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Simulating two-way SMS interactions between an expectant mother and Jacaranda Health's PROMPTS AI service.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-teal-400 font-mono">
                  <span>Kenya Shortcode: 20560</span>
                </div>
              </div>

              {/* Scenario Selection Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                {SCENARIOS.map((scen, idx) => {
                  const isSelected = scen.id === currentScenario.id;
                  return (
                    <button
                      key={scen.id}
                      onClick={() => setSelectedScenarioId(scen.id)}
                      className={`text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-teal-950/40 border-teal-500 shadow-md ring-1 ring-teal-500/30'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              scen.badgeColor === 'emerald'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : scen.badgeColor === 'amber'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-sky-500/20 text-sky-300'
                            }`}
                          >
                            {scen.badge}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Conversation {idx + 1}
                          </span>
                        </div>
                        <h3 className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {scen.title.split(':')[1]?.trim() || scen.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {scen.subtitle.replace('Scenario: ', '')}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                        <span className="text-teal-400 font-medium">Mum: {scen.motherProfile.name.split(' ')[0]}</span>
                        <span className="text-slate-400">{scen.messages.length} SMS Steps</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Phone Simulator */}
            <PhoneSimulator
              scenario={currentScenario}
              soundEnabled={soundEnabled}
              showSwahili={showSwahili}
            />
          </div>
        )}

        {activeTab === 'compare' && <DualPhoneComparison />}

        {activeTab === 'rationale' && <PolicyAnalysisCard />}

        {activeTab === 'playground' && <LivePlayground />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-white">PROMPTS Edge Case Simulator</span>
            <span>•</span>
            <span>Jacaranda Health Maternal AI Platform</span>
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Simulates Kenyan MOH clinical gestational pathway triage & LLM date verification.
          </div>
        </div>
      </footer>
    </div>
  );
}
