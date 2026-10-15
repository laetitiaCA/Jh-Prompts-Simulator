import React from 'react';
import { SLACK_DISCUSSION_SUMMARY } from '../data/scenarios';
import {
  MessageSquare,
  Sparkles,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  HeartHandshake,
  CheckCircle,
  HelpCircle,
  Stethoscope,
} from 'lucide-react';

export const PolicyAnalysisCard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Slack Discussion Quotes Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Team Slack Discussion: The Edge Case</h2>
            <p className="text-xs text-slate-400">Jacaranda Health • Product, Data & Clinical Architecture</p>
          </div>
        </div>

        {/* The Two Slack Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Post 1: The Dilemma */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>The Problem Statement</span>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                {SLACK_DISCUSSION_SUMMARY.originalQuestion}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Channel: #prompts-product-edgecases</span>
              <span className="font-mono text-amber-300">Dilemma</span>
            </div>
          </div>

          {/* Post 2: The Clinical Thought Process & Resolution */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-teal-500/30 flex flex-col justify-between ring-1 ring-teal-500/20">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Clinical & User-Centric Resolution</span>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-teal-500/20">
                {SLACK_DISCUSSION_SUMMARY.recommendedResolution}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-teal-400 flex items-center justify-between">
              <span>Resolution: Re-prompt & Confirm</span>
              <span className="font-mono text-emerald-400">Recommended Path</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 3 Core Root Causes Explained */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            Behavioral Root Causes
          </span>
          <h3 className="text-xl font-bold text-white mt-2">
            Why Mothers Provide Different or Unclear Date Information
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Understanding the real-world lived experience of mothers in Kenya using PROMPTS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SLACK_DISCUSSION_SUMMARY.reasonsBreakdown.map((r) => (
            <div
              key={r.number}
              className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm mb-3">
                  {r.number}
                </div>
                <h4 className="text-sm font-bold text-white mb-2">{r.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{r.detail}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px]">
                <span className="text-teal-400 font-semibold block mb-0.5">Recommended Policy:</span>
                <span className="text-slate-300">{r.bestAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Engine Architecture Flowchart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex items-center space-x-3">
          <GitBranch className="w-6 h-6 text-teal-400" />
          <div>
            <h3 className="text-xl font-bold text-white">PROMPTS Decision Tree Architecture</h3>
            <p className="text-xs text-slate-400">State machine flow when an unparseable date event occurs.</p>
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-4 overflow-x-auto">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-teal-300 font-bold">
            [EVENT]: Mother with valid stored EDD sends SMS with ambiguous / unparseable date info
          </div>

          <div className="pl-6 border-l-2 border-teal-500/50 space-y-4">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-semibold">1. LLM Entity & Intent Classifier:</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Checks for explicit date, seasonal phrases ("rainy season", "harvest"), and critical risk keywords ("lost baby", "pregnant again").
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-rose-950/20 rounded-xl border border-rose-500/30">
                <span className="text-rose-400 font-bold">Branch A: Loss or New Pregnancy Indicated</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  • Route to Compassionate Triage Mode.<br />
                  • Halt delivery countdown SMS immediately.<br />
                  • Send warm triage prompt offering nurse call or new pregnancy reset.
                </p>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 font-bold">Branch B: Ambiguous Date for Same Pregnancy</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  • Retain stored EDD under "Safe Gestational Hold".<br />
                  • Send instant confirmation SMS: "We have 15 Nov, did doctor give a new date?".<br />
                  • If confirmed YES: Keep active. If updated date: Recalculate gestation.
                </p>
              </div>
            </div>

            <div className="p-3 bg-sky-950/20 rounded-xl border border-sky-500/30">
              <span className="text-sky-300 font-bold">Branch C: Still Unclear After Re-prompt</span>
              <p className="text-[11px] text-slate-300 mt-1">
                • Maintain safe gestational estimate.<br />
                • Schedule recurring gentle check-in after expected clinic date (every 2-3 weeks).<br />
                • Never drop mother to generic unless explicit stage exit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
