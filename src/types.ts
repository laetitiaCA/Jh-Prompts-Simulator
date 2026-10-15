export type PolicyStrategy = 'option_1_keep_old' | 'option_2_generic' | 'option_3_reprompt';

export type AmbiguityStatus =
  | 'VALID_DATE'
  | 'AMBIGUOUS_DATE'
  | 'UNPARSEABLE'
  | 'CONFIRMATION_YES'
  | 'NEW_PREGNANCY_SUSPECTED'
  | 'LOSS_SUSPECTED';

export interface MotherProfile {
  id: string;
  name: string;
  enrolledDate: string;
  savedEdd: string;
  calculatedWeeks: number;
  healthFacility: string;
  stage: 'pregnancy' | 'postpartum';
  currentTrack: string;
}

export interface ChatMessage {
  id: string;
  sender: 'mother' | 'prompts_ai' | 'nurse';
  text: string;
  translationSwahili?: string;
  timestamp: string;
  smsCount?: number;
  characterCount?: number;
  systemNote?: string;
  llmAnalysis?: {
    status: AmbiguityStatus;
    detectedDate: string | null;
    confidence: number;
    explanation: string;
  };
  pathwayState?: string;
}

export interface ScenarioData {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  clinicalContext: string;
  motherProfile: MotherProfile;
  initialSlackReason: string;
  messages: ChatMessage[];
  counterfactualOutcome: {
    ifOption1: string;
    ifOption2: string;
    ifOption3: string;
  };
}
