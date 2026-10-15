import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Sparkles,
  Signal,
  Wifi,
  Battery,
  User,
  HeartPulse,
  Send,
  CheckCheck,
  Layers,
  ArrowRightCircle,
  HelpCircle,
} from 'lucide-react';
import { ScenarioData, ChatMessage } from '../types';
import { playSmsSound } from '../utils/audio';

interface PhoneSimulatorProps {
  scenario: ScenarioData;
  soundEnabled: boolean;
  showSwahili: boolean;
  onSelectScenario?: (scenarioId: string) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  scenario,
  soundEnabled,
  showSwahili,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(3000); // ms per step
  const [activeTabPanel, setActiveTabPanel] = useState<'decision' | 'counterfactual' | 'profile'>('decision');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Reset steps when scenario changes
  useEffect(() => {
    setCurrentStep(1);
    setIsPlaying(false);
  }, [scenario.id]);

  // Handle auto-play
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStep < scenario.messages.length) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (soundEnabled) {
            const nextMsg = scenario.messages[next - 1];
            playSmsSound(nextMsg?.sender === 'prompts_ai' ? 'outgoing' : 'incoming');
          }
          if (next >= scenario.messages.length) {
            setIsPlaying(false);
          }
          return next;
        });
      }, playSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, scenario.messages, playSpeed, soundEnabled]);

  // Scroll to bottom when step changes
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < scenario.messages.length) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (soundEnabled) {
        const nextMsg = scenario.messages[next - 1];
        playSmsSound(nextMsg?.sender === 'prompts_ai' ? 'outgoing' : 'incoming');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsPlaying(false);
  };

  const visibleMessages = scenario.messages.slice(0, currentStep);
  const lastMessage = visibleMessages[visibleMessages.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Realistic Phone Mockup */}
      <div className="lg:col-span-6 flex flex-col items-center">
        {/* Phone Frame */}
        <div className="w-full max-w-[390px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 relative">
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-1 ring-slate-700"></div>
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700"></div>
          </div>

          {/* Screen Content Container */}
          <div className="w-full bg-slate-950 rounded-[36px] overflow-hidden flex flex-col h-[680px] border border-slate-800 relative">
            {/* Status Bar */}
            <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs text-slate-400 font-medium z-20 bg-slate-950/90 backdrop-blur">
              <span className="text-white font-semibold">10:14</span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider">Safaricom 4G</span>
                <Signal className="w-3.5 h-3.5 text-slate-300" />
                <Wifi className="w-3.5 h-3.5 text-slate-300" />
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* SMS Header */}
            <div className="px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-teal-900/40">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white text-sm">PROMPTS 20560</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-teal-500/20 text-teal-400 inline-flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-400 font-medium">Jacaranda Health • Free SMS</p>
                </div>
              </div>

              {/* Pathway Pill */}
              <div className="text-right">
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {scenario.motherProfile.stage === 'pregnancy' ? `Week ${scenario.motherProfile.calculatedWeeks}` : 'Postnatal'}
                </span>
                <p className="text-[10px] text-slate-400">EDD: {scenario.motherProfile.savedEdd}</p>
              </div>
            </div>

            {/* Conversation Flow Banner */}
            <div className="bg-slate-900/60 px-4 py-1.5 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-teal-400" />
                <span>Today</span>
              </div>
              <div className="flex items-center space-x-1 font-mono text-[10px] text-slate-400">
                <span>Step {currentStep} of {scenario.messages.length}</span>
              </div>
            </div>

            {/* SMS Messages Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
              {/* Mother context info header */}
              <div className="text-center my-2">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] bg-slate-900/90 text-slate-400 border border-slate-800 shadow-sm">
                  Encrypted SMS Session • Kenya MOH Standard
                </span>
              </div>

              {visibleMessages.map((msg, index) => {
                const isPromptsAi = msg.sender === 'prompts_ai';
                return (
                  <div key={msg.id} className="space-y-1.5 animate-fadeIn">
                    {/* Message Bubble */}
                    <div className={`flex flex-col ${isPromptsAi ? 'items-start' : 'items-end'}`}>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-0.5 px-1">
                        <span className="font-semibold text-slate-300">
                          {isPromptsAi ? 'PROMPTS AI' : scenario.motherProfile.name.split(' ')[0]}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md transition-all ${
                          isPromptsAi
                            ? 'bg-slate-800/95 text-slate-100 border border-teal-500/30 rounded-tl-sm'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-sm'
                        }`}
                      >
                        <p className="leading-relaxed font-normal">{msg.text}</p>

                        {/* Optional Swahili Translation */}
                        {showSwahili && msg.translationSwahili && (
                          <div className={`mt-2 pt-1.5 border-t text-[11px] italic ${isPromptsAi ? 'border-slate-700 text-slate-300' : 'border-emerald-500/40 text-emerald-100'}`}>
                            <span className="not-italic font-semibold text-[9px] uppercase tracking-wider block opacity-70 mb-0.5">
                              Swahili:
                            </span>
                            {msg.translationSwahili}
                          </div>
                        )}

                        {/* Metadata Footer: Characters & SMS Segments */}
                        <div
                          className={`mt-1.5 flex items-center justify-between text-[10px] ${
                            isPromptsAi ? 'text-slate-400' : 'text-emerald-200'
                          }`}
                        >
                          <span className="font-mono">
                            {msg.characterCount || msg.text.length} chars • {msg.smsCount || 1} SMS
                          </span>
                          {!isPromptsAi && <CheckCheck className="w-3.5 h-3.5 text-emerald-200 ml-1" />}
                        </div>
                      </div>
                    </div>

                    {/* Inline LLM Analysis Pill if present */}
                    {msg.llmAnalysis && (
                      <div className="my-1 mx-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[10px] text-slate-300 flex items-start space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-semibold text-slate-200">LLM Parser:</span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-mono text-[9px] font-bold ${
                                msg.llmAnalysis.status === 'VALID_DATE'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : msg.llmAnalysis.status === 'CONFIRMATION_YES'
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : msg.llmAnalysis.status === 'NEW_PREGNANCY_SUSPECTED'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {msg.llmAnalysis.status}
                            </span>
                            <span className="text-slate-400">
                              (Confidence: {Math.round(msg.llmAnalysis.confidence * 100)}%)
                            </span>
                          </div>
                          <p className="text-slate-400 leading-tight">{msg.llmAnalysis.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Bottom SMS Input Simulation Bar */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center space-x-2">
              <div className="flex-1 bg-slate-950 border border-slate-700/80 rounded-full px-3.5 py-1.5 text-xs text-slate-400 flex items-center justify-between">
                <span>Text message (SMS)...</span>
                <span className="text-[10px] text-slate-400 font-mono">Free</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm opacity-60">
                <Send className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Step Controls Bar */}
        <div className="w-full max-w-[390px] mt-4 bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-md space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">Simulation Playback</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-slate-400">Speed:</span>
              <button
                onClick={() => setPlaySpeed(4000)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  playSpeed === 4000 ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-400'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => setPlaySpeed(2500)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  playSpeed === 2500 ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-400'
                }`}
              >
                1.5x
              </button>
              <button
                onClick={() => setPlaySpeed(1500)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  playSpeed === 1500 ? 'bg-teal-500/20 text-teal-300 font-bold' : 'text-slate-400'
                }`}
              >
                2x
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentStep <= 1}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{currentStep >= scenario.messages.length ? 'Replay' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep >= scenario.messages.length}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition shadow-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              title="Reset simulation"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center space-x-1.5 pt-1">
            {scenario.messages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx + 1)}
                className={`h-1.5 rounded-full transition-all ${
                  idx + 1 === currentStep
                    ? 'w-6 bg-teal-400'
                    : idx + 1 < currentStep
                    ? 'w-3 bg-emerald-600'
                    : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Live Engine Analysis & Decision Breakdown */}
      <div className="lg:col-span-6 space-y-6">
        {/* Scenario Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    scenario.badgeColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : scenario.badgeColor === 'amber'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  }`}
                >
                  {scenario.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {scenario.id}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1.5">{scenario.title}</h2>
              <p className="text-sm text-teal-300/90 font-medium mt-0.5">{scenario.subtitle}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {scenario.clinicalContext}
          </p>

          <div className="mt-3 flex items-center space-x-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="font-medium">Direct Slack Link: {scenario.initialSlackReason}</span>
          </div>
        </div>

        {/* Tabs for Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex border-b border-slate-800 bg-slate-950/60">
            <button
              onClick={() => setActiveTabPanel('decision')}
              className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                activeTabPanel === 'decision'
                  ? 'border-b-2 border-teal-500 text-teal-400 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Step-by-Step Logic</span>
            </button>

            <button
              onClick={() => setActiveTabPanel('counterfactual')}
              className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                activeTabPanel === 'counterfactual'
                  ? 'border-b-2 border-teal-500 text-teal-400 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Policy Counterfactual</span>
            </button>

            <button
              onClick={() => setActiveTabPanel('profile')}
              className={`flex-1 py-3 px-4 text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
                activeTabPanel === 'profile'
                  ? 'border-b-2 border-teal-500 text-teal-400 bg-slate-900'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Mother Database Profile</span>
            </button>
          </div>

          <div className="p-5">
            {activeTabPanel === 'decision' && (
              <div className="space-y-4">
                {/* Current Active Step Breakdown */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold">
                      {currentStep}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      Current State: {lastMessage?.pathwayState || 'Evaluating...'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {lastMessage?.sender === 'prompts_ai' ? 'PROMPTS Outbound' : 'Mother Inbound'}
                  </span>
                </div>

                {/* System Audit Note */}
                {lastMessage?.systemNote && (
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                      Decision Engine Action:
                    </span>
                    <p className="text-slate-200">{lastMessage.systemNote}</p>
                  </div>
                )}

                {/* LLM Parser Deep Dive if applicable */}
                {lastMessage?.llmAnalysis && (
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>LLM Entity Extraction & Classification</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        Model: gemini-3.8-flash
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Parser Category</span>
                        <span className="font-semibold text-white">{lastMessage.llmAnalysis.status}</span>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Extracted Date</span>
                        <span className="font-semibold text-white font-mono">
                          {lastMessage.llmAnalysis.detectedDate || 'null (Unparseable)'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Extraction Confidence</span>
                        <span className="font-mono">{Math.round(lastMessage.llmAnalysis.confidence * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-teal-500 h-full rounded-full transition-all"
                          style={{ width: `${lastMessage.llmAnalysis.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Clinical Safety Assurance */}
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-300 block">Why this solves the problem safely:</span>
                    <p className="text-emerald-200/90 text-[11px] mt-0.5">
                      By keeping her valid recorded date on safe hold and asking an immediate targeted question, PROMPTS avoids both hazards: she does not get dropped from gestation-based alerts, nor does she receive false delivery messages if she lost a pregnancy.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTabPanel === 'counterfactual' && (
              <div className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center space-x-2 text-rose-300 font-bold mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Option 1: Silently Keep Old Date</span>
                  </div>
                  <p className="text-rose-200/80 leading-relaxed text-[11px]">
                    {scenario.counterfactualOutcome.ifOption1}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Option 2: Move to Generic Pathway</span>
                  </div>
                  <p className="text-amber-200/80 leading-relaxed text-[11px]">
                    {scenario.counterfactualOutcome.ifOption2}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center space-x-2 text-emerald-300 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Option 3 (Recommended): Re-prompt & Hold</span>
                  </div>
                  <p className="text-emerald-200/90 leading-relaxed text-[11px]">
                    {scenario.counterfactualOutcome.ifOption3}
                  </p>
                </div>
              </div>
            )}

            {activeTabPanel === 'profile' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Mother Name</span>
                    <p className="text-sm font-bold text-white mt-0.5">{scenario.motherProfile.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{scenario.motherProfile.id}</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Health Facility</span>
                    <p className="text-sm font-bold text-white mt-0.5">{scenario.motherProfile.healthFacility}</p>
                    <span className="text-[10px] text-teal-400">Public MOH Facility</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Stored EDD in Database</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                      {scenario.motherProfile.savedEdd}
                    </p>
                    <span className="text-[10px] text-slate-400">Enrolled: {scenario.motherProfile.enrolledDate}</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Care Track</span>
                    <p className="text-sm font-bold text-white mt-0.5">{scenario.motherProfile.currentTrack}</p>
                    <span className="text-[10px] text-emerald-300">Gestational SMS Active</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">
                    Scheduled High-Impact Gestational Interventions:
                  </span>
                  <div className="space-y-1.5 text-[11px] text-slate-300">
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                      <span>• Week 20-24: Fetal movement & Pre-eclampsia recognition</span>
                      <span className="text-emerald-400 font-mono text-[10px]">Protected</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                      <span>• Week 28: Tetanus toxoid booster & ANC visit 4 reminder</span>
                      <span className="text-emerald-400 font-mono text-[10px]">Protected</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>• Week 36: Birth preparedness & hospital delivery bag list</span>
                      <span className="text-emerald-400 font-mono text-[10px]">Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
