import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  XCircle,
  CheckCircle2,
  HeartPulse,
  Info,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface FlawedOptionData {
  title: string;
  verdict: string;
  statusColor: string;
  aiReply: string;
  outcomePoints: string[];
  clinicalRisk: string;
}

interface RecommendedOptionData {
  title: string;
  verdict: string;
  statusColor: string;
  aiReply: string;
  outcomePoints: string[];
  clinicalRisk: string;
}

interface ComparisonItem {
  title: string;
  motherMessage: string;
  savedEdd: string;
  flawedOption: FlawedOptionData;
  option3: RecommendedOptionData;
}

export const DualPhoneComparison: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);

  const comparisons: ComparisonItem[] = [
    {
      title: 'Case 1: Ambiguous Date Input ("Baby coming when rain starts")',
      motherMessage: 'Habari, I feel the baby moving now. My due date is around when the long rains start maybe month 5.',
      savedEdd: '15-Nov-2026 (Week 24)',
      flawedOption: {
        title: 'Option 2: Demote to Generic Pathway',
        verdict: 'Disastrous Care Downgrade',
        statusColor: 'rose',
        aiReply:
          'Habari Mama. We could not verify your pregnancy week. You have been switched to general health SMS. Please remember to visit a health facility.',
        outcomePoints: [
          'Mother permanently loses gestational week alerts (Week 24 pre-eclampsia screening).',
          'ANC 4 appointment reminder will NOT trigger.',
          'Loss of trust: Mother feels demoted after sharing details.',
        ],
        clinicalRisk: 'High Clinical Gap (Patient dropped from gestational cohort)',
      },
      option3: {
        title: 'Option 3 (Recommended): Re-prompt & Confirm',
        verdict: 'Safe, Empathetic, Gestation Intact',
        statusColor: 'emerald',
        aiReply:
          'Habari Mama! We have your due date recorded as 15 Nov. Did your nurse give a new date? Reply YES if 15 Nov is still right, or reply with your clinic date (e.g. 24/11).',
        outcomePoints: [
          'Gestational track maintained on safe hold without disruption.',
          'Empowers the mother to easily confirm with a single word "YES" or new date.',
          'Zero clinical gap; maternal alerts continue seamlessly.',
        ],
        clinicalRisk: 'Low Risk (Continuous safety net with active verification)',
      },
    },
    {
      title: 'Case 2: Pregnancy Loss / Re-enrolment ("Expecting again, tummy small")',
      motherMessage: 'Hello PROMPTS, I am pregnant again. My tummy is still small maybe 3 months. When should I start clinic?',
      savedEdd: '24-Oct-2026 (Week 39 - Imminent Delivery on old record)',
      flawedOption: {
        title: 'Option 1: Silently Keep Old Date',
        verdict: 'Severe Ethical & Psychological Hazard',
        statusColor: 'rose',
        aiReply:
          'Habari Mama! You are now in Week 39! Pack your delivery bag and go to your delivery facility as soon as labor pains start.',
        outcomePoints: [
          'CRITICAL HARM: A mother who lost her pregnancy receives birth & delivery instructions.',
          'Severe trauma and psychological distress.',
          'Immediate user churn and reputational failure.',
        ],
        clinicalRisk: 'Critical Clinical & Psychological Hazard',
      },
      option3: {
        title: 'Option 3 (Recommended): Re-prompt & Sensitive Triage',
        verdict: 'Compassionate Care & Safe Reset',
        statusColor: 'emerald',
        aiReply:
          'Pole sana Mama. We want to support your journey. Reply 1 if this is a new pregnancy with your clinic date, or reply 2 to speak with our Jacaranda nurse for free.',
        outcomePoints: [
          'Detects stage discrepancy sensitively.',
          'Offers free clinical nurse helpdesk escalation.',
          'Safely resets the timeline to Week 14 upon receipt of new LMP or ultrasound.',
        ],
        clinicalRisk: 'Optimal Clinical Protocol (Zero false alerts)',
      },
    },
  ];

  const current = comparisons[selectedScenarioIndex];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner / Explanation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
                Architectural Dilemma
              </span>
              <span className="text-xs text-slate-400">Option 1 vs Option 2 vs Option 3</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Side-by-Side Pathway Comparison</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Evaluating the exact question posed to the team: When a previously enrolled mother provides new unparseable date details, what happens under each policy?
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setSelectedScenarioIndex(0)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScenarioIndex === 0
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Case 1: Ambiguous Date
            </button>
            <button
              onClick={() => setSelectedScenarioIndex(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedScenarioIndex === 1
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Case 2: Pregnancy Loss / Reset
            </button>
          </div>
        </div>

        {/* Current Case Context Box */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Mother Incoming SMS:</span>
            <p className="text-sm font-medium text-emerald-300 italic mt-0.5">"{current.motherMessage}"</p>
          </div>
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Stored Staged EDD</span>
            <span className="text-xs font-mono font-bold text-teal-300">{current.savedEdd}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* LEFT CARD: Flawed Policy */}
        <div className="bg-slate-900/90 border-2 border-rose-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-500/20 text-rose-300 px-4 py-1 rounded-bl-xl text-xs font-bold border-l border-b border-rose-500/30">
            FLAWED APPROACH
          </div>

          <div>
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">{current.flawedOption.title}</h3>
            </div>
            <p className="text-xs font-semibold text-rose-400 mt-1">{current.flawedOption.verdict}</p>

            {/* Simulated SMS Bubble */}
            <div className="mt-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Simulated Outbound SMS:</span>
              <div className="bg-slate-950 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-200/90 leading-relaxed shadow-inner">
                "{current.flawedOption.aiReply}"
              </div>
            </div>

            {/* Consequences list */}
            <div className="mt-6 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Clinical & Behavioral Hazards:
              </span>
              {current.flawedOption.outcomePoints.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-rose-200/80">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Risk Assessment:</span>
              <span className="font-bold text-rose-400">{current.flawedOption.clinicalRisk}</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARD: Recommended Approach (Option 3) */}
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden ring-1 ring-emerald-500/30">
          <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 px-4 py-1 rounded-bl-xl text-xs font-bold border-l border-b border-emerald-500/30">
            RECOMMENDED SOLUTION
          </div>

          <div>
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">{current.option3.title}</h3>
            </div>
            <p className="text-xs font-semibold text-emerald-400 mt-1">{current.option3.verdict}</p>

            {/* Simulated SMS Bubble */}
            <div className="mt-5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Simulated Outbound SMS:</span>
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 text-xs text-emerald-200 leading-relaxed shadow-inner">
                "{current.option3.aiReply}"
              </div>
            </div>

            {/* Benefits list */}
            <div className="mt-6 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Clinical & Behavioral Advantages:
              </span>
              {current.option3.outcomePoints.map((point, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-emerald-200/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Risk Assessment:</span>
              <span className="font-bold text-emerald-400">{current.option3.clinicalRisk}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
