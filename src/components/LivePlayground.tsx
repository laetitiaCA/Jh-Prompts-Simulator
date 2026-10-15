import React, { useState } from 'react';
import { Sparkles, Send, RefreshCw, ShieldAlert, ShieldCheck, AlertTriangle, User, ArrowRight, Check } from 'lucide-react';
import { PolicyStrategy, AmbiguityStatus } from '../types';

interface SimulationResult {
  parserResult: {
    status: AmbiguityStatus;
    extractedDate: string | null;
    confidenceScore: number;
    parserExplanation: string;
  };
  strategyApplied: string;
  decisionExplanation: string;
  pathwayState: {
    currentPathway: string;
    activeEdd: string;
    nextScheduledMessage: string;
  };
  smsResponse: string;
  smsSegments: number;
  clinicalSafetyAudit: {
    riskLevel: 'Low' | 'Moderate' | 'High';
    reasoning: string;
  };
}

export const LivePlayground: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    'Habari, I feel the baby moving now. My due date is around when the long rains start maybe month 5 or 6.'
  );
  const [selectedStrategy, setSelectedStrategy] = useState<PolicyStrategy>('option_3_reprompt');
  const [savedEdd, setSavedEdd] = useState<string>('2026-11-15');
  const [weeksPregnant, setWeeksPregnant] = useState<number>(24);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    {
      label: 'Seasonal / Ambiguous Date',
      text: 'Habari, my baby is coming in the next big rainy season around harvest time, maybe month 5 or 6.',
      strategy: 'option_3_reprompt' as PolicyStrategy,
      edd: '2026-11-15',
      weeks: 24,
    },
    {
      label: 'Confirmation (YES)',
      text: 'YES 15 Nov is what the nurse stamped in my clinic Mother & Child booklet last Thursday.',
      strategy: 'option_3_reprompt' as PolicyStrategy,
      edd: '2026-11-15',
      weeks: 24,
    },
    {
      label: 'Pregnancy Loss & Reset',
      text: 'Hello PROMPTS, I am pregnant again. My tummy is still small maybe 3 months. When should I start clinic?',
      strategy: 'option_3_reprompt' as PolicyStrategy,
      edd: '2026-10-24',
      weeks: 39,
    },
    {
      label: 'Clinic Revised Date',
      text: 'The ultrasound doctor at Thika Level 5 said my baby will arrive on 04/12/2026.',
      strategy: 'option_3_reprompt' as PolicyStrategy,
      edd: '2026-11-15',
      weeks: 24,
    },
    {
      label: 'Still Unsure / Pending Clinic',
      text: 'I do not remember the exact date. I will go to clinic next Friday for them to check me.',
      strategy: 'option_3_reprompt' as PolicyStrategy,
      edd: '2026-12-10',
      weeks: 20,
    },
  ];

  const handleSimulate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/prompts-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incomingMessage: inputText,
          strategy: selectedStrategy,
          userProfile: {
            savedEdd,
            weeksPregnant,
            stage: 'pregnancy',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Simulation error:', err);
      setError(err.message || 'Simulation request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live AI Prompt & Pathway Playground</h2>
            <p className="text-xs text-slate-400">
              Test how the PROMPTS date extractor and decision policies behave on any incoming maternal SMS.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Load Test Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(preset.text);
                  setSelectedStrategy(preset.strategy);
                  setSavedEdd(preset.edd);
                  setWeeksPregnant(preset.weeks);
                  setResult(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-xs text-slate-300 hover:text-white transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            {/* Input Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white">Mother's Incoming SMS:</label>
                <span className="text-[10px] text-slate-400 font-mono">{inputText.length} characters</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-sans"
                placeholder="Type any mother SMS in English, Swahili, or Sheng..."
              />
            </div>

            {/* Mother Profile Stored State */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Stored Profile EDD:
                </label>
                <input
                  type="date"
                  value={savedEdd}
                  onChange={(e) => setSavedEdd(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Current Gestation Week:
                </label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={weeksPregnant}
                  onChange={(e) => setWeeksPregnant(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            {/* Strategy Radio Selection */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-white block mb-2">
                Apply System Decision Strategy:
              </label>
              <div className="space-y-2">
                <label
                  className={`flex items-start p-3 rounded-xl border cursor-pointer transition ${
                    selectedStrategy === 'option_3_reprompt'
                      ? 'bg-emerald-950/20 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={selectedStrategy === 'option_3_reprompt'}
                    onChange={() => setSelectedStrategy('option_3_reprompt')}
                    className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div className="ml-3 text-xs">
                    <span className="font-bold text-emerald-400 block">
                      Option 3 (Recommended): Re-prompt Right Away & Safe Gestational Hold
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Confirms existing date or triages new pregnancy without dropping week-by-week reminders.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start p-3 rounded-xl border cursor-pointer transition ${
                    selectedStrategy === 'option_1_keep_old'
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={selectedStrategy === 'option_1_keep_old'}
                    onChange={() => setSelectedStrategy('option_1_keep_old')}
                    className="mt-0.5"
                  />
                  <div className="ml-3 text-xs">
                    <span className="font-bold text-slate-200 block">
                      Option 1: Silently Keep Previous Date
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Ignores new text and continues old date schedule (High risk on loss/re-enrolment).
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start p-3 rounded-xl border cursor-pointer transition ${
                    selectedStrategy === 'option_2_generic'
                      ? 'bg-rose-950/20 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="strategy"
                    checked={selectedStrategy === 'option_2_generic'}
                    onChange={() => setSelectedStrategy('option_2_generic')}
                    className="mt-0.5"
                  />
                  <div className="ml-3 text-xs">
                    <span className="font-bold text-rose-400 block">
                      Option 2: Move to Generic Pathway
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Demotes mother immediately to general non-gestational messages.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleSimulate}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-900/30 transition"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating with Gemini Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run PROMPTS Engine Simulation</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Simulation Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Simulation Output</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    result.clinicalSafetyAudit.riskLevel === 'Low'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : result.clinicalSafetyAudit.riskLevel === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  Risk: {result.clinicalSafetyAudit.riskLevel}
                </span>
              </div>

              {/* Simulated Outbound SMS Box */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Outbound SMS to Mother:
                </span>
                <div className="bg-slate-950 border border-teal-500/40 rounded-2xl p-4 text-xs text-slate-100 shadow-inner">
                  <p className="leading-relaxed font-sans">{result.smsResponse}</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Length: {result.smsResponse.length} chars</span>
                    <span>Billing: {result.smsSegments} SMS page(s)</span>
                  </div>
                </div>
              </div>

              {/* LLM Parser Diagnostics */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                  LLM Classification
                </span>
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Status:</span>
                  <span className="font-mono font-bold text-white">{result.parserResult.status}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Extracted Date:</span>
                  <span className="font-mono text-emerald-400">
                    {result.parserResult.extractedDate || 'null'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-900 leading-normal">
                  {result.parserResult.parserExplanation}
                </p>
              </div>

              {/* Active Care Pathway */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                  Database Pathway State
                </span>
                <p className="text-white font-semibold">{result.pathwayState.currentPathway}</p>
                <p className="text-[10px] text-slate-400">{result.decisionExplanation}</p>
              </div>

              {/* Clinical Safety Rationale */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Safety Audit Note:
                </span>
                <p className="text-slate-300 mt-0.5">{result.clinicalSafetyAudit.reasoning}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400 h-full flex flex-col items-center justify-center space-y-3">
              <Sparkles className="w-8 h-8 text-teal-400/50" />
              <p>Click "Run PROMPTS Engine Simulation" to test the parser and dispatch logic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
