import { ScenarioData } from '../types';

export const SCENARIOS: ScenarioData[] = [
  {
    id: 'conversation-1-confirm-existing',
    title: 'Conversation 1: Confirm Existing Date Safeguard',
    subtitle: 'Scenario: Enrolled before seeing doctor / Forgotten date / Ambiguous seasonal reference',
    badge: 'Recommended Approach',
    badgeColor: 'emerald',
    iconName: 'ShieldCheck',
    clinicalContext:
      'Mama Amina enrolled 2 months ago with an estimated due date of 15-Nov-2026. She visits a clinic or feels movement and sends an unparseable seasonal text. The AI confirms her existing EDD without dropping her from the gestational care pathway.',
    initialSlackReason:
      'Reason 1 & 3: "She enrolled before seeing a doctor, so the first date was a guess" or "She simply forgot her due date".',
    motherProfile: {
      id: 'KE-PROMPTS-89412',
      name: 'Amina Wangari',
      enrolledDate: '12-Aug-2026',
      savedEdd: '15-Nov-2026',
      calculatedWeeks: 24,
      healthFacility: 'Kiambu Level 4 Hospital',
      stage: 'pregnancy',
      currentTrack: 'Gestational Track (Week 24)',
    },
    messages: [
      {
        id: 'c1-m1',
        sender: 'mother',
        text: 'Habari, I feel the baby moving now. My due date is around when the long rains start maybe month 5 or 6.',
        translationSwahili: 'Habari, nahisi mtoto akicheza sasa. Tarehe yangu ya kujifungua ni wakati wa mvua labda mwezi wa tano au sita.',
        timestamp: '10:14 AM',
        characterCount: 104,
        smsCount: 1,
        systemNote: 'Incoming SMS received from registered number +254712***890.',
        llmAnalysis: {
          status: 'AMBIGUOUS_DATE',
          detectedDate: null,
          confidence: 0.32,
          explanation:
            'LLM parsed "long rains / month 5 or 6". No verifiable calendar date found. Existing profile has valid EDD 15-Nov-2026.',
        },
        pathwayState: 'Gestational Track (Week 24) [Under Evaluation]',
      },
      {
        id: 'c1-m2',
        sender: 'prompts_ai',
        text: 'Habari Mama Amina! We have your due date recorded as 15 Nov. Did your nurse give a new date? Reply YES if 15 Nov is still right, or reply with your clinic date (e.g. 24/11) to get the right baby tips.',
        translationSwahili: 'Habari Mama Amina! Tuna tarehe yako kama 15 Nov. Je, daktari alikupa tarehe mpya? Jibu NDIO kama bado ni sahihi, au tuma tarehe ya kliniki.',
        timestamp: '10:14 AM',
        characterCount: 198,
        smsCount: 2,
        systemNote:
          'Decision: Do NOT demote to generic. Do NOT silently assume old date. Re-prompt immediately with explicit confirmation prompt.',
        pathwayState: 'Safe Gestational Hold (Retaining Week 24 Alerts)',
      },
      {
        id: 'c1-m3',
        sender: 'mother',
        text: 'YES 15 Nov is what the nurse stamped in my clinic Mother & Child booklet last Thursday.',
        translationSwahili: 'NDIO 15 Nov ndiyo tarehe muuguzi aliyopiga muhuri kwenye kijitabu changu cha kliniki Alhamisi iliyopita.',
        timestamp: '10:17 AM',
        characterCount: 88,
        smsCount: 1,
        systemNote: 'Mother confirmed existing EDD.',
        llmAnalysis: {
          status: 'CONFIRMATION_YES',
          detectedDate: '15-Nov-2026',
          confidence: 0.98,
          explanation:
            'Affirmative confirmation of 15-Nov-2026 matched to ANC booklet stamp.',
        },
        pathwayState: 'Gestational Track (Week 24 Confirmed)',
      },
      {
        id: 'c1-m4',
        sender: 'prompts_ai',
        text: 'Asante Mama! We will keep sending week 24 tips for 15 Nov. Remember to take your daily IFAS iron tablets and watch for warning signs like severe headache or swelling.',
        translationSwahili: 'Asante Mama! Tutaendelea kutuma vidokezo vya wiki ya 24. Kumbuka kumeza vidonge vya IFAS na uchunguze dalili za hatari kama maumivu makali ya kichwa.',
        timestamp: '10:17 AM',
        characterCount: 167,
        smsCount: 2,
        systemNote:
          'Pathway preserved. High-impact clinical reminders (ANC 4, IFAS, pre-eclampsia) delivered on time.',
        pathwayState: 'Gestational Track (Week 24 Active)',
      },
    ],
    counterfactualOutcome: {
      ifOption1:
        'Option 1 (Silently Keep Old Date): Would have sent Week 24 tips anyway, but without ever checking if the mother had a revised ultrasound date from her clinic visit.',
      ifOption2:
        'Option 2 (Move to Generic Pathway): Catastrophic downgrade. Mother is demoted to generic non-date pathway, permanently losing week-by-week fetal growth updates, tetanus shot alerts, and birth preparedness checklist.',
      ifOption3:
        'Option 3 (Re-prompt & Confirm): 100% success. Validated date with mother in 3 minutes, verified ANC booklet attendance, and prevented any data loss.',
    },
  },
  {
    id: 'conversation-2-loss-and-reenrolment',
    title: 'Conversation 2: Sensitive Re-enrolment & Loss Triage',
    subtitle: 'Scenario: Pregnancy loss / Re-enrolment with new baby / Stage discrepancy',
    badge: 'Critical Clinical Safety Case',
    badgeColor: 'amber',
    iconName: 'HeartHandshake',
    clinicalContext:
      'Mama Faith had enrolled 8 months ago with a due date that would imply she is due this week. She texts in saying she has a small belly and is only 3 months along. Blindly keeping the old date would trigger delivery and postpartum SMS to a grieving or newly pregnant mother.',
    initialSlackReason:
      'Reason 2: "She lost the pregnancy, got pregnant again and is re-enrolling. That second case is why I wouldn’t just keep the old date without asking."',
    motherProfile: {
      id: 'KE-PROMPTS-61049',
      name: 'Faith Chebet',
      enrolledDate: '15-Feb-2026',
      savedEdd: '24-Oct-2026',
      calculatedWeeks: 39,
      healthFacility: 'Nakuru PGH Maternal Wing',
      stage: 'pregnancy',
      currentTrack: 'Gestational Track (Week 39 - Imminent Delivery)',
    },
    messages: [
      {
        id: 'c2-m1',
        sender: 'mother',
        text: 'Hello PROMPTS, I am pregnant again. My tummy is still small maybe 3 months. When should I start clinic?',
        translationSwahili: 'Hujambo PROMPTS, nina mimba tena. Tumbo langu bado ni dogo labda miezi 3. Nianze kliniki lini?',
        timestamp: '02:30 PM',
        characterCount: 104,
        smsCount: 1,
        systemNote: 'High discrepancy alert: Profile indicates Week 39, but user reports ~3 months.',
        llmAnalysis: {
          status: 'NEW_PREGNANCY_SUSPECTED',
          detectedDate: null,
          confidence: 0.94,
          explanation:
            'Critical phrase "pregnant again" and "maybe 3 months" detected against recorded Week 39 profile. Clinical risk: Previous pregnancy loss or infant loss.',
        },
        pathwayState: 'Discrepancy Triage (Stage Misalignment)',
      },
      {
        id: 'c2-m2',
        sender: 'prompts_ai',
        text: 'Pole sana Mama Faith, we are here with you. To make sure you get the right care, reply 1 for NEW PREGNANCY with your clinic date, or reply 2 to speak with our Jacaranda nurse for free.',
        translationSwahili: 'Pole sana Mama Faith, tuko pamoja nawe. Ili upate huduma sahihi, jibu 1 kwa MIMBA MPYA ukitaja tarehe ya kliniki, au jibu 2 kuongea na muuguzi wetu bure.',
        timestamp: '02:30 PM',
        characterCount: 187,
        smsCount: 2,
        systemNote:
          'Compassionate triage trigger. Provides immediate option to reset timeline or connect to clinical helpdesk nurse.',
        pathwayState: 'Triage Mode: Compassionate Safety Pause',
      },
      {
        id: 'c2-m3',
        sender: 'mother',
        text: '1 it is a new pregnancy. I lost the first one in April. My last monthly period was 10 July.',
        translationSwahili: '1 ni mimba mpya. Nilipoteza ile ya kwanza mwezi wa nne. Hedhi yangu ya mwisho ilikuwa tarehe 10 Julai.',
        timestamp: '02:34 PM',
        characterCount: 94,
        smsCount: 1,
        systemNote: 'Mother discloses pregnancy loss and provides Last Menstrual Period (LMP: 10-July).',
        llmAnalysis: {
          status: 'VALID_DATE',
          detectedDate: '17-Apr-2027',
          confidence: 0.96,
          explanation:
            'LMP parsed as 10-July. Calculated EDD using Naegele rule (+280 days): 17-Apr-2027 (Week 14 gestation). Previous pregnancy record archived.',
        },
        pathwayState: 'Profile Reset: Gestational Track (Week 14)',
      },
      {
        id: 'c2-m4',
        sender: 'prompts_ai',
        text: 'Pole sana for your loss, and congratulations on this new blessing Mama Faith. We have updated your due date to 17 Apr (Week 14). Please visit your clinic this week for early ANC care.',
        translationSwahili: 'Pole sana kwa msiba, na hongera kwa baraka hii mpya Mama Faith. Tumesasisha tarehe yako kuwa 17 Apr (Wiki ya 14). Tafadhali tembelea kliniki wiki hii.',
        timestamp: '02:35 PM',
        characterCount: 191,
        smsCount: 2,
        systemNote:
          'Profile successfully updated. Prevented sending traumatic "Labor and Delivery" alerts. Activated early ANC protocol.',
        pathwayState: 'Gestational Track (Week 14 Active)',
      },
    ],
    counterfactualOutcome: {
      ifOption1:
        'Option 1 (Silently Keep Old Date): SEVERE HARM. System would have sent: "Mama, pack your hospital bag! Your labor could start any day." to a mother who lost her baby in April. This causes severe psychological distress and clinical mistrust.',
      ifOption2:
        'Option 2 (Move to Generic Pathway): The mother loses first-trimester screening, early ANC booking reminders, and high-risk pregnancy monitoring after previous miscarriage.',
      ifOption3:
        'Option 3 (Re-prompt & Triage): Gold standard compassionate care. Identified loss, reset EDD to Week 14, offered free nurse counseling, and established safe clinical track.',
    },
  },
  {
    id: 'conversation-3-unclear-followup',
    title: 'Conversation 3: Unresolved Date & Periodic Re-prompting Track',
    subtitle: 'Scenario: Mother still unsure after re-prompt / Clinic visit pending',
    badge: 'Graceful Fallback Policy',
    badgeColor: 'sky',
    iconName: 'CalendarClock',
    clinicalContext:
      'Mama Grace cannot provide an exact date even after being prompted ("I haven\'t seen the doctor yet"). Rather than dropping her or guessing blindly, PROMPTS keeps her on the previous best estimate while scheduling automated check-ins.',
    initialSlackReason:
      '"If it\'s still unclear, keep the updated info and keep prompting every few weeks."',
    motherProfile: {
      id: 'KE-PROMPTS-44182',
      name: 'Grace Muthoni',
      enrolledDate: '01-Sep-2026',
      savedEdd: '10-Dec-2026',
      calculatedWeeks: 20,
      healthFacility: 'Thika Level 5 Hospital',
      stage: 'pregnancy',
      currentTrack: 'Gestational Track (Week 20)',
    },
    messages: [
      {
        id: 'c3-m1',
        sender: 'mother',
        text: 'Niko na swali, tarehe yangu sio ile ya kitambo, naskia tumbo kubwa lakini sijapata ultrasound bado.',
        translationSwahili: 'I have a question, my date is not the old one, my belly feels bigger but I have not had ultrasound yet.',
        timestamp: '08:15 AM',
        characterCount: 104,
        smsCount: 1,
        systemNote: 'Mother indicates date might be different but does not have a clinic ultrasound yet.',
        llmAnalysis: {
          status: 'AMBIGUOUS_DATE',
          detectedDate: null,
          confidence: 0.28,
          explanation:
            'Swahili statement of date discrepancy without specific calendar date or LMP.',
        },
        pathwayState: 'Safe Gestational Hold (Week 20)',
      },
      {
        id: 'c3-m2',
        sender: 'prompts_ai',
        text: 'Habari Mama Grace! Tuna tarehe yako kama 10 Dec. Je unaweza kututumia tarehe ya hedhi yako ya mwisho au tarehe ya kliniki ili tukurekebishie?',
        translationSwahili: 'Hello Mama Grace! We have your date as 10 Dec. Can you send us your last period date or clinic date so we can adjust it for you?',
        timestamp: '08:15 AM',
        characterCount: 151,
        smsCount: 1,
        systemNote: 'Re-prompting for LMP or upcoming clinic appointment date.',
        pathwayState: 'Safe Gestational Hold + Periodic Prompt Queued',
      },
      {
        id: 'c3-m3',
        sender: 'mother',
        text: 'Sikumbuki tarehe ya hedhi. Nitaenda kliniki ijumaa ijayo waniangalie.',
        translationSwahili: 'I do not remember period date. I will go to clinic next Friday for them to check me.',
        timestamp: '08:20 AM',
        characterCount: 75,
        smsCount: 1,
        systemNote: 'Mother has no date now, but confirmed upcoming ANC clinic visit on Friday.',
        llmAnalysis: {
          status: 'UNPARSEABLE',
          detectedDate: null,
          confidence: 0.1,
          explanation:
            'No exact date. Next clinic visit planned for next Friday.',
        },
        pathwayState: 'Safe Gestational Hold + Follow-up Scheduled',
      },
      {
        id: 'c3-m4',
        sender: 'prompts_ai',
        text: 'Sawa kabisa Mama Grace! Tutaendelea na tarehe ya 10 Dec kwa sasa. Baada ya kliniki Ijumaa, tutakutumia ujumbe uthibitishe tarehe yako mpya. Endelea na vidonge vyako!',
        translationSwahili: 'Well noted Mama Grace! We will continue with 10 Dec for now. After your clinic on Friday, we will send an SMS to confirm your new date. Keep taking your supplements!',
        timestamp: '08:21 AM',
        characterCount: 177,
        smsCount: 2,
        systemNote:
          'Applied team policy: Retain best estimate + schedule automated check-in in 2 weeks.',
        pathwayState: 'Safe Gestational Hold (Check-in 14d scheduled)',
      },
    ],
    counterfactualOutcome: {
      ifOption1:
        'Option 1 (Silently Keep Old Date): Never captures the fact that an ultrasound visit is happening this Friday.',
      ifOption2:
        'Option 2 (Move to Generic Pathway): Drops the mother completely from week 20 anomaly scan reminders just because she could not remember her LMP.',
      ifOption3:
        'Option 3 (Keep Hold + Periodic Re-prompt): Perfect balance. Keeps her safe on Week 20 track and cues up a post-clinic SMS check-in.',
    },
  },
];

export const SLACK_DISCUSSION_SUMMARY = {
  originalQuestion: `Hi @here
Here is little edge case to put our heads together on 🧩 I’m leaning one way, but would love to hear your thoughts.
Situation: Imagine a mum previously enrolled and gave us a valid EDD or delivery date, which we saved to her profile. She returns later and provides new details for the same stage, but this time we can’t interpret the date (even the LLM parser can’t make sense of it)

What should we do?
1️⃣ Keep the previous date (which is valid) and continue her date-based messages?
2️⃣ Consider the latest info which would move her to the generic pathway?

Which way would you lean, and why? Any third option we should consider?`,
  recommendedResolution: `My first thought was that the latest info is the most current. Thinking it through though, I'd change my answer: an unreadable date doesn't tell us anything new about her stage, and moving her to generic means she loses the gestation-based messages.

There are a few reasons a mum might give us different or unclear info:
• She enrolled before seeing a doctor, so the first date was a guess
• She lost the pregnancy, got pregnant again and is re-enrolling
• She's simply forgotten her due date

That second case is why I wouldn't just keep the old date without asking.

So I recommend we:
• Re-prompt her right away
• Or confirm what we already have
• Update if she sends a valid date. If it's still unclear, keep the updated info and keep prompting every few weeks`,
  reasonsBreakdown: [
    {
      number: '1',
      title: 'Enrolled before seeing a doctor (First date was a guess)',
      detail:
        'Many mothers enroll in PROMPTS early when noticing signs of pregnancy. Later, an ultrasound or palpation at the clinic gives an accurate EDD. An unreadable message often means she is trying to describe what the nurse said.',
      bestAction: 'Ask for the exact date written on her ANC clinic booklet.',
    },
    {
      number: '2',
      title: 'Lost the pregnancy, got pregnant again, and is re-enrolling',
      detail:
        'CRITICAL CLINICAL & ETHICAL RISK: If we silently keep the old date (Option 1), we risk sending labor and delivery countdown SMS to a mother who suffered a miscarriage or stillbirth.',
      bestAction: 'Triage with compassion: ask if it is a new pregnancy and offer nurse helpdesk support.',
    },
    {
      number: '3',
      title: "Simply forgotten her due date",
      detail:
        'Due dates are easily forgotten or conflated. Moving her to generic (Option 2) punishes her by cutting off critical weekly health advice.',
      bestAction: 'Confirm what we already have on file ("We have 15 Nov, is that right?").',
    },
  ],
};
