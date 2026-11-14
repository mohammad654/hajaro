import { SITE_CONFIG } from '../../core/config/site.config';

export interface LegalSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export interface LegalDocument {
  readonly title: string;
  readonly description: string;
  readonly updated: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
}

const BUSINESS = SITE_CONFIG.legalName;
const EMAIL = SITE_CONFIG.contact.email;

/**
 * Template legal copy. Have these documents reviewed by a qualified legal professional
 * for your jurisdiction before launch.
 */
export const LEGAL_DOCUMENTS: Readonly<Record<'privacy' | 'terms' | 'disclaimer', LegalDocument>> =
  {
    privacy: {
      title: 'Privacy Policy',
      description: `How ${BUSINESS} collects, uses and protects personal data, including your rights under the GDPR.`,
      updated: '2026-11-01',
      intro: `${BUSINESS} ("we", "us") respects your privacy. This policy explains what personal data we process, why, and the rights you have under the EU General Data Protection Regulation (GDPR).`,
      sections: [
        {
          heading: 'Data we collect',
          paragraphs: [
            'Enquiry data: your name, email address, optional phone number, training goals, experience and message when you contact us.',
            'Client data: profile details, training logs, body measurements, progress photos, check-ins and nutrition targets if you become a coaching client. Some of this (for example health-related information you choose to share) may be special-category data, which we process only with your explicit consent.',
            'Technical data: essential information required to deliver the website securely. Analytics are only enabled with your consent.',
          ],
        },
        {
          heading: 'Why we use your data and our legal basis',
          paragraphs: [
            'To respond to enquiries and provide coaching services (contract / pre-contractual steps).',
            'To process health-related information needed for safe coaching (explicit consent).',
            'To meet legal and accounting obligations (legal obligation).',
            'To improve the website using anonymised statistics (consent).',
          ],
        },
        {
          heading: 'Progress photos and transformations',
          paragraphs: [
            'Progress photos are private to you and your coach. We publish a transformation, photo or testimonial only with your separate, explicit written consent, which you may withdraw at any time — we will then remove it promptly.',
          ],
        },
        {
          heading: 'Retention',
          paragraphs: [
            'Enquiries that do not lead to coaching are deleted within 12 months. Client records are kept for the duration of coaching and up to the period required by law afterwards.',
          ],
        },
        {
          heading: 'Sharing',
          paragraphs: [
            'We never sell your data. We use carefully selected processors (such as hosting and email providers) under data-processing agreements, and only as needed to provide our services.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You have the right to access, rectify, erase, restrict or object to processing of your data, the right to data portability and the right to withdraw consent at any time. You may also lodge a complaint with your local supervisory authority.',
            `To exercise your rights, email ${EMAIL}. Clients can also request a data export or account deletion from their dashboard profile.`,
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'Data is transmitted over encrypted connections (HTTPS). Access to client data is restricted by role, and each client can only access their own information.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      description: `Terms governing the use of the ${BUSINESS} website, programs and coaching services.`,
      updated: '2026-11-01',
      intro: `These terms apply to your use of this website and to any programs or coaching services purchased from ${BUSINESS}.`,
      sections: [
        {
          heading: 'Services',
          paragraphs: [
            'Coaching packages and programs are described on the pricing and program pages. The specific inclusions of your package are confirmed in writing before you start.',
          ],
        },
        {
          heading: 'Payments, renewals and cancellation',
          paragraphs: [
            'Monthly packages renew automatically until cancelled. You can cancel with notice before your next billing date. Minimum terms, where they apply, are stated on the pricing page.',
            'Where applicable consumer law gives you a right of withdrawal, this is explained at the time of purchase.',
          ],
        },
        {
          heading: 'Your responsibilities',
          paragraphs: [
            'You confirm that the information you provide is accurate, including relevant health information, and that you will seek medical clearance where advised.',
            'You are responsible for training safely, using appropriate equipment and stopping any exercise that causes pain.',
          ],
        },
        {
          heading: 'No guarantee of results',
          paragraphs: [
            'Results depend on many individual factors. We do not guarantee any specific outcome, such as a particular amount of weight loss or muscle gain.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'Programs, articles and materials are for your personal use only and may not be resold or redistributed.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [`Questions about these terms: ${EMAIL}.`],
        },
      ],
    },
    disclaimer: {
      title: 'Health Disclaimer',
      description:
        'Important information about the educational nature of the content on this website.',
      updated: '2026-11-01',
      intro:
        'The content on this website — including programs, the exercise library, the muscle chart, calculators and articles — is provided for general educational purposes only.',
      sections: [
        {
          heading: 'Not medical advice',
          paragraphs: [
            'Nothing on this website is medical advice, diagnosis or treatment. Always consult a doctor or other qualified healthcare professional before beginning any exercise or nutrition program, especially if you are pregnant, have a medical condition, an injury or take medication.',
          ],
        },
        {
          heading: 'Exercise risk',
          paragraphs: [
            'Strength training carries an inherent risk of injury. Use appropriate loads, learn correct technique, warm up and stop immediately if you feel pain, dizziness or shortness of breath.',
          ],
        },
        {
          heading: 'Calculators',
          paragraphs: [
            'Calorie, macronutrient, protein, BMI and water calculators produce population-based estimates. They are informational and not individualised medical or dietary advice.',
          ],
        },
        {
          heading: 'Supplements',
          paragraphs: [
            'Supplements are discussed for education only. They are not medicines and are not intended to diagnose, treat, cure or prevent any disease.',
          ],
        },
      ],
    },
  };
