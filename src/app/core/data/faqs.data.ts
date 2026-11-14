import { FaqItem } from '../models';

/**
 * Frequently asked questions (based on 02_SEO_AND_COPY_EN_NL.md), translated with $localize.
 * TODO-FACT: add "Where do you train?" once the training location is known.
 */
export const GENERAL_FAQS: readonly FaqItem[] = [
  {
    id: 'faq-who',
    question: $localize`Do I need experience to start?`,
    answer: $localize`No. Plenty of people start without ever having touched a barbell. We start where you are, and your plan grows with you.`,
  },
  {
    id: 'faq-frequency',
    question: $localize`How often should I train?`,
    answer: $localize`Most people do well with 2 to 4 sessions a week. We decide together, based on your goal and your schedule.`,
  },
  {
    id: 'faq-online',
    question: $localize`What is the difference between personal training and online coaching?`,
    answer: $localize`With personal training, I'm next to you in the gym. With online coaching, you train on your own and I guide you with a plan in your client dashboard, a weekly check-in and feedback on your videos.`,
  },
  {
    id: 'faq-gym',
    question: $localize`Do I need a gym membership?`,
    answer: $localize`Most programs are made for a regular gym, but training at home is possible too. Tell me what equipment you have and I'll build the plan around it.`,
  },
  {
    id: 'faq-results',
    question: $localize`How quickly will I see results?`,
    answer: $localize`That depends on where you start, how consistently you train and eat, how well you sleep, and your body. Most people notice they're getting stronger before they see a change in the mirror. No honest coach can promise a specific result or date.`,
  },
  {
    id: 'faq-nutrition',
    question: $localize`Do you help with food and diet?`,
    answer: $localize`Yes, with practical guidance that fits your training: calorie and macro targets and a simple meal structure. Detailed meal plans are part of the Premium and Contest Prep packages. For a medical diet, please see a dietitian.`,
  },
  {
    id: 'faq-cancel',
    question: $localize`Can I pause or cancel?`,
    answer: $localize`Monthly packages can be cancelled before the next billing date. If a package has a minimum term, it's stated on the pricing page and in the terms of service.`,
  },
  {
    id: 'faq-medical',
    question: $localize`Can I train with you if I have an injury?`,
    answer: $localize`Tell me about it first. I can adapt exercises, but I'm not a doctor or physiotherapist. If needed, I'll ask you to get a green light from your doctor before we start.`,
  },
  {
    id: 'faq-supplements',
    question: $localize`Do I need supplements?`,
    answer: $localize`No. Training, food, sleep and consistency do the work. A few well-researched supplements, like creatine monohydrate, can help a little. I'm happy to explain what the research says.`,
  },
];
