import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI();
}

interface UserProfile {
  name?: string;
  stage: 'pregnancy' | 'postpartum';
  savedEdd?: string;
  weeksPregnant?: number;
  clinicAttended?: boolean;
  history?: Array<{ sender: 'user' | 'ai'; text: string; timestamp: string }>;
}

// Dedicated API endpoint for simulating the Jacaranda PROMPTS LLM logic and maternal triage
app.post('/api/prompts-simulate', async (req: Request, res: Response) => {
  try {
    const {
      incomingMessage,
      userProfile,
      strategy = 'option_3_reprompt', // 'option_1_keep_old', 'option_2_generic', 'option_3_reprompt'
      language = 'en', // 'en' or 'sw'
    } = req.body as {
      incomingMessage: string;
      userProfile: UserProfile;
      strategy: 'option_1_keep_old' | 'option_2_generic' | 'option_3_reprompt';
      language?: 'en' | 'sw';
    };

    if (!incomingMessage) {
      return res.status(400).json({ error: 'incomingMessage is required' });
    }

    // Default structured simulation
    const systemPrompt = `You are the core logic engine for Jacaranda Health's PROMPTS (Promoting Maternal and Child Health Through SMS) service in Kenya.
Context:
- PROMPTS sends targeted, week-by-week clinical gestational messages (reminders for ANC visits, iron/folic acid supplements, danger signs like bleeding/headache, birth preparedness).
- A mother previously enrolled with a VALID EDD: ${userProfile?.savedEdd || '2026-11-15'} (approx week ${userProfile?.weeksPregnant || 24}).
- The mother has sent a new SMS message: "${incomingMessage}".
- Chosen system strategy: "${strategy}".
  - option_1_keep_old: Silently keep the previous valid date, do not re-prompt or clarify. Continue existing track.
  - option_2_generic: Mark unreadable date as reason to demote her to Generic Pathway (she loses gestation-specific weekly milestone alerts).
  - option_3_reprompt (RECOMMENDED BY CLINICAL & PRODUCT TEAM): Re-prompt immediately.
    Acknowledge her existing date on file, ask for clarification (e.g. did the date change? is this a new pregnancy? what did the clinic say?), and keep the valid date on hold as safety net while clarifying.

Analyze the message:
1. Parse any explicit or vague date/stage information. Is it a valid date, ambiguous date, unparseable, or indicator of pregnancy loss / new pregnancy?
2. Determine clinical risk of each strategy.
3. Generate an authentic, empathetic, clear SMS response for Jacaranda PROMPTS (short, under 160 characters if possible or max 2 SMS segments, friendly Kenyan maternal health tone, e.g., "Habari Mama...", clear action to reply).

Return pure JSON matching this schema:
{
  "parserResult": {
    "status": "VALID_DATE" | "AMBIGUOUS_DATE" | "UNPARSEABLE" | "CONFIRMATION_YES" | "NEW_PREGNANCY_SUSPECTED" | "LOSS_SUSPECTED",
    "extractedDate": string | null,
    "confidenceScore": number,
    "parserExplanation": string
  },
  "strategyApplied": "${strategy}",
  "decisionExplanation": string,
  "pathwayState": {
    "currentPathway": "Gestational Track (Week XX)" | "Generic Pathway" | "Pending Confirmation (Safe Gestational Hold)",
    "activeEdd": string,
    "nextScheduledMessage": string
  },
  "smsResponse": string,
  "smsSegments": number,
  "clinicalSafetyAudit": {
    "riskLevel": "Low" | "Moderate" | "High",
    "reasoning": string
  }
}`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text?.trim() || '{}';
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (geminiErr) {
        console.warn('Gemini call failed, falling back to deterministic engine:', geminiErr);
      }
    }

    // Deterministic fallback engine modeled directly on the user's scenarios
    const lower = incomingMessage.toLowerCase().trim();
    let status: 'VALID_DATE' | 'AMBIGUOUS_DATE' | 'UNPARSEABLE' | 'CONFIRMATION_YES' | 'NEW_PREGNANCY_SUSPECTED' | 'LOSS_SUSPECTED' = 'UNPARSEABLE';
    let extractedDate: string | null = null;
    let parserExplanation = 'LLM parser could not find an actionable calendar date from the provided text.';

    // Check for confirmation
    if (['yes', 'ndio', 'correct', 'that is correct', 'still right', 'same date'].some(w => lower.includes(w))) {
      status = 'CONFIRMATION_YES';
      extractedDate = userProfile.savedEdd || '2026-11-15';
      parserExplanation = 'Mother confirmed the existing recorded EDD is still valid.';
    } else if (lower.includes('new baby') || lower.includes('pregnant again') || lower.includes('lost') || lower.includes('miscarriage') || lower.includes('mimba nyingine')) {
      status = 'NEW_PREGNANCY_SUSPECTED';
      parserExplanation = 'Detected indication of a reset/new pregnancy or pregnancy loss needing sensitive triage.';
    } else if (/\b(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{2,4})?\b/.test(lower) || /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(lower)) {
      status = 'VALID_DATE';
      extractedDate = '2026-11-28';
      parserExplanation = 'Explicit date format parsed successfully from clinic or period reference.';
    } else {
      status = 'AMBIGUOUS_DATE';
      parserExplanation = 'Text contains vague relative timeline (e.g. season, months, harvest) without verifiable date.';
    }

    let smsResponse = '';
    let decisionExplanation = '';
    let pathway = 'Pending Confirmation (Safe Gestational Hold)';
    let riskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
    let riskReason = '';

    if (strategy === 'option_1_keep_old') {
      decisionExplanation = 'Kept previous recorded EDD without asking. Continued weekly gestational drip.';
      pathway = `Gestational Track (${userProfile.savedEdd || '15 Nov 2026'})`;
      smsResponse = 'Habari Mama! Your next pregnancy update for Week 24 is coming soon. Remember to take your iron tablets daily with clean water.';
      riskLevel = status === 'NEW_PREGNANCY_SUSPECTED' ? 'High' : 'Moderate';
      riskReason = 'If the mother lost her pregnancy or re-enrolled with a new baby, continuing old messages causes psychological distress and irrelevant clinical advice.';
    } else if (strategy === 'option_2_generic') {
      decisionExplanation = 'Demoted mother to Generic Pathway because current date could not be parsed.';
      pathway = 'Generic Pathway (Non-gestational)';
      smsResponse = 'Habari Mama, thank you for contacting PROMPTS. You are now receiving general maternal health tips. Visit your local clinic regularly.';
      riskLevel = 'High';
      riskReason = 'Mother completely loses time-sensitive ultrasound, tetanus toxoid, and pre-eclampsia warning sign reminders linked to her gestation week.';
    } else {
      // Option 3: Re-prompt immediately + confirm what we already have
      if (status === 'CONFIRMATION_YES') {
        decisionExplanation = 'Mother confirmed existing EDD. Restored full gestational track with confidence.';
        pathway = `Gestational Track (${userProfile.savedEdd || '15 Nov 2026'}) - Confirmed`;
        smsResponse = `Asante Mama! We will continue sending tips matched to your due date of ${userProfile.savedEdd || '15 Nov'}. Reply any time if you have questions.`;
        riskLevel = 'Low';
        riskReason = 'Accurate clinical timing maintained with user confirmation.';
      } else if (status === 'NEW_PREGNANCY_SUSPECTED') {
        decisionExplanation = 'Triaged potential new pregnancy or pregnancy loss. Offered nurse helpdesk support.';
        pathway = 'Clinical Triage & Reset Mode';
        smsResponse = 'Pole sana Mama, we are here for you. Reply 1 if this is a new pregnancy with your clinic date, or reply 2 to speak with a Jacaranda nurse for free.';
        riskLevel = 'Low';
        riskReason = 'Compassionate safety net prevents inappropriate milestone messages.';
      } else {
        decisionExplanation = 'Unparseable date detected. Re-prompting mother immediately while keeping existing EDD on temporary hold.';
        pathway = 'Pending Confirmation (Safe Gestational Hold)';
        smsResponse = `Habari Mama! We have your due date as ${userProfile.savedEdd || '15 Nov'}. Did this change? Reply YES if correct, or reply with your clinic date (e.g. 20/11) to get the right tips.`;
        riskLevel = 'Low';
        riskReason = 'Prevents accidental demotion while verifying if her stage or pregnancy changed.';
      }
    }

    const smsSegments = Math.ceil(smsResponse.length / 160);

    return res.json({
      parserResult: {
        status,
        extractedDate,
        confidenceScore: status === 'CONFIRMATION_YES' ? 0.95 : status === 'VALID_DATE' ? 0.88 : 0.42,
        parserExplanation,
      },
      strategyApplied: strategy,
      decisionExplanation,
      pathwayState: {
        currentPathway: pathway,
        activeEdd: userProfile.savedEdd || '2026-11-15',
        nextScheduledMessage: 'Week 24: Pre-eclampsia danger signs & ANC clinic check reminder',
      },
      smsResponse,
      smsSegments,
      clinicalSafetyAudit: {
        riskLevel,
        reasoning: riskReason || 'Standard protocol verification active.',
      },
    });
  } catch (err: any) {
    console.error('Simulation error:', err);
    return res.status(500).json({ error: err.message || 'Simulation failed' });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PROMPTS SMS Simulator running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
