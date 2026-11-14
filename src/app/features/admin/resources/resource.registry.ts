import { newId } from '../../../core/api/entity-repository';
import { SITE_CONFIG } from '../../../core/config/site.config';
import { ArticleStore } from '../../../core/data-access/article.store';
import { ExerciseStore } from '../../../core/data-access/exercise.store';
import { PackageStore } from '../../../core/data-access/package.store';
import { ProgramStore } from '../../../core/data-access/program.store';
import { ServiceCatalogStore } from '../../../core/data-access/service-catalog.store';
import { TestimonialStore, TransformationStore } from '../../../core/data-access/results.stores';
import { BookingStore, ClientStore } from '../../../core/data-access/portal.stores';
import { MUSCLES } from '../../../core/data/muscles.data';
import {
  ARTICLE_CATEGORY_LABELS,
  Article,
  ArticleCategory,
  BOOKING_TYPE_LABELS,
  Booking,
  ClientProfile,
  CoachingPackage,
  CoachingService,
  DIFFICULTY_LABELS,
  DifficultyLevel,
  EQUIPMENT_LABELS,
  EXERCISE_CATEGORY_LABELS,
  Entity,
  Equipment,
  Exercise,
  ExerciseCategory,
  MuscleId,
  PROGRAM_GOAL_LABELS,
  Testimonial,
  TrainingProgram,
  Transformation,
} from '../../../core/models';
import { slugify } from '../../../shared/forms/validation-messages';
import { bool, list, num, optStr, optionsFrom, str } from '../forms/schema-form';
import { blocksToMarkup, markupToBlocks, readingMinutes } from './article-markup';
import { ResourceConfig, defineResource } from './resource.model';

const muscleOptions = MUSCLES.map((m) => ({ value: m.id, label: m.name }));
const today = () => new Date().toISOString().slice(0, 10);
const yesNo = (v: boolean) => (v ? 'Yes' : 'No');

// ---------------------------------------------------------------- Exercises
const exercises = defineResource<Exercise>({
  key: 'exercises',
  singular: 'Exercise',
  plural: 'Exercises',
  description:
    'Exercise library: technique, muscles, programming ranges, demonstration images and videos.',
  icon: 'dumbbell',
  store: ExerciseStore,
  columns: [
    { label: 'Name', value: (e) => e.name },
    { label: 'Category', value: (e) => EXERCISE_CATEGORY_LABELS[e.category] },
    { label: 'Level', value: (e) => DIFFICULTY_LABELS[e.difficulty] },
    {
      label: 'Video',
      value: (e) => yesNo(!!e.media?.videoUrl),
      tone: (e) => (e.media?.videoUrl ? 'success' : null),
    },
  ],
  searchText: (e) => `${e.name} ${e.category} ${e.primaryMuscles.join(' ')}`,
  filter: {
    label: 'Category',
    options: optionsFrom(EXERCISE_CATEGORY_LABELS),
    matches: (e, v) => e.category === v,
  },
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true, maxLength: 80 },
    {
      key: 'slug',
      label: 'URL slug',
      type: 'slug',
      hint: 'Leave empty to generate from the name.',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: optionsFrom(EXERCISE_CATEGORY_LABELS),
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      type: 'select',
      required: true,
      options: optionsFrom(DIFFICULTY_LABELS),
    },
    { key: 'summary', label: 'Summary', type: 'textarea', required: true, maxLength: 300, rows: 2 },
    {
      key: 'primaryMuscles',
      label: 'Primary muscles',
      type: 'multiselect',
      options: muscleOptions,
    },
    {
      key: 'secondaryMuscles',
      label: 'Secondary muscles',
      type: 'multiselect',
      options: muscleOptions,
    },
    {
      key: 'equipment',
      label: 'Equipment',
      type: 'multiselect',
      options: optionsFrom(EQUIPMENT_LABELS),
    },
    {
      key: 'startingPosition',
      label: 'Starting position',
      type: 'textarea',
      required: true,
      rows: 3,
    },
    { key: 'execution', label: 'Execution steps', type: 'lines', required: true },
    { key: 'endingPosition', label: 'Ending position', type: 'textarea', required: true, rows: 2 },
    { key: 'postureCues', label: 'Posture cues', type: 'lines' },
    {
      key: 'recommendedSets',
      label: 'Recommended sets',
      type: 'text',
      required: true,
      maxLength: 20,
    },
    {
      key: 'recommendedReps',
      label: 'Recommended reps',
      type: 'text',
      required: true,
      maxLength: 40,
    },
    { key: 'restSeconds', label: 'Rest (seconds)', type: 'number', min: 0, max: 600, step: 15 },
    { key: 'commonMistakes', label: 'Common mistakes', type: 'lines' },
    { key: 'safety', label: 'Safety considerations', type: 'lines' },
    {
      key: 'videoUrl',
      label: 'Demonstration video (YouTube or Vimeo URL)',
      type: 'url',
      wide: true,
    },
    {
      key: 'imageUrl',
      label: 'Demonstration image path or URL',
      type: 'url',
      hint: 'e.g. /images/exercises/bench-press.webp',
    },
    { key: 'imageAlt', label: 'Image alt text', type: 'text', maxLength: 140 },
  ],
  toForm: (e) => ({
    ...e,
    videoUrl: e.media?.videoUrl,
    imageUrl: e.media?.imageUrl,
    imageAlt: e.media?.imageAlt,
  }),
  fromForm: (v, existing) => {
    const slug = str(v['slug']) || slugify(str(v['name']));
    const media = {
      videoUrl: optStr(v['videoUrl']),
      imageUrl: optStr(v['imageUrl']),
      imageAlt: optStr(v['imageAlt']),
    };
    return {
      id: existing?.id ?? slug,
      slug,
      name: str(v['name']),
      category: str(v['category']) as ExerciseCategory,
      difficulty: str(v['difficulty']) as DifficultyLevel,
      summary: str(v['summary']),
      primaryMuscles: list<MuscleId>(v['primaryMuscles']),
      secondaryMuscles: list<MuscleId>(v['secondaryMuscles']),
      equipment: list<Equipment>(v['equipment']),
      startingPosition: str(v['startingPosition']),
      execution: list(v['execution']),
      endingPosition: str(v['endingPosition']),
      postureCues: list(v['postureCues']),
      recommendedSets: str(v['recommendedSets']),
      recommendedReps: str(v['recommendedReps']),
      restSeconds: num(v['restSeconds'], 90),
      commonMistakes: list(v['commonMistakes']),
      safety: list(v['safety']),
      ...(media.videoUrl || media.imageUrl ? { media } : {}),
    };
  },
  blank: () => ({
    category: 'chest',
    difficulty: 'beginner',
    restSeconds: 90,
    recommendedSets: '3',
    recommendedReps: '8–12',
  }),
  publicUrl: (e) => `/exercises/${e.slug}`,
});

// ---------------------------------------------------------------- Programs (list; custom editor)
const programs = defineResource<TrainingProgram>({
  key: 'programs',
  singular: 'Program',
  plural: 'Programs & workout charts',
  description: 'Training programs and workout charts. Open a program to edit its weekly schedule.',
  icon: 'layers',
  store: ProgramStore,
  columns: [
    { label: 'Name', value: (p) => p.name },
    { label: 'Level', value: (p) => DIFFICULTY_LABELS[p.level] },
    { label: 'Goal', value: (p) => PROGRAM_GOAL_LABELS[p.goal] },
    { label: 'Days / week', value: (p) => String(p.daysPerWeek) },
    {
      label: 'Featured',
      value: (p) => yesNo(!!p.featured),
      tone: (p) => (p.featured ? 'accent' : null),
    },
  ],
  searchText: (p) => `${p.name} ${p.goal} ${p.level}`,
  fields: [],
  toForm: (p) => ({ ...p }),
  fromForm: (_v, existing) => existing!,
  blank: () => ({}),
  publicUrl: (p) => `/programs/${p.slug}`,
  editPath: (id) => `/admin/programs/${id}`,
});

// ---------------------------------------------------------------- Packages & pricing
const packages = defineResource<CoachingPackage>({
  key: 'packages',
  singular: 'Package',
  plural: 'Packages & pricing',
  description: 'Coaching packages and prices. Every price on the website reads from here.',
  icon: 'medal',
  store: PackageStore,
  columns: [
    { label: 'Order', value: (p) => String(p.order) },
    { label: 'Name', value: (p) => p.name },
    { label: 'Price', value: (p) => `${p.price} ${p.currency} / ${p.billingPeriod}` },
    {
      label: 'Status',
      value: (p) => (p.active ? 'Active' : 'Hidden'),
      tone: (p) => (p.active ? 'success' : null),
    },
  ],
  searchText: (p) => p.name,
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true, maxLength: 60 },
    { key: 'tagline', label: 'Tagline', type: 'text', required: true, maxLength: 120 },
    { key: 'price', label: 'Price', type: 'number', required: true, min: 0, step: 1 },
    { key: 'currency', label: 'Currency (ISO code)', type: 'text', required: true, maxLength: 3 },
    {
      key: 'billingPeriod',
      label: 'Billing period',
      type: 'select',
      required: true,
      options: [
        { value: 'month', label: 'Per month' },
        { value: 'week', label: 'Per week' },
        { value: 'session', label: 'Per session' },
        { value: 'program', label: 'One-off' },
      ],
    },
    { key: 'duration', label: 'Duration / terms', type: 'text', required: true, maxLength: 80 },
    { key: 'trainingPlan', label: 'Training plan', type: 'text', required: true },
    { key: 'nutrition', label: 'Nutrition guidance', type: 'text', required: true },
    { key: 'checkIns', label: 'Check-ins', type: 'text', required: true },
    { key: 'communication', label: 'Coach communication', type: 'text', required: true },
    { key: 'support', label: 'Support level', type: 'text', required: true },
    { key: 'features', label: 'Additional features', type: 'lines' },
    { key: 'ctaLabel', label: 'Button label', type: 'text', required: true, maxLength: 30 },
    { key: 'order', label: 'Display order', type: 'number', min: 0 },
    { key: 'highlighted', label: 'Highlight as most popular', type: 'checkbox' },
    { key: 'active', label: 'Show on website', type: 'checkbox' },
  ],
  toForm: (p) => ({ ...p }),
  fromForm: (v, existing) => ({
    id: existing?.id ?? (slugify(str(v['name'])) || newId('pkg')),
    name: str(v['name']),
    tagline: str(v['tagline']),
    price: num(v['price']),
    currency: str(v['currency']).toUpperCase(),
    billingPeriod: str(v['billingPeriod']) as CoachingPackage['billingPeriod'],
    duration: str(v['duration']),
    trainingPlan: str(v['trainingPlan']),
    nutrition: str(v['nutrition']),
    checkIns: str(v['checkIns']),
    communication: str(v['communication']),
    support: str(v['support']),
    features: list(v['features']),
    highlighted: bool(v['highlighted']),
    ctaLabel: str(v['ctaLabel']),
    order: num(v['order'], 99),
    active: bool(v['active']),
  }),
  blank: () => ({
    currency: SITE_CONFIG.currency,
    billingPeriod: 'month',
    ctaLabel: 'Apply now',
    active: true,
    order: 10,
  }),
  publicUrl: () => '/pricing',
});

// ---------------------------------------------------------------- Services
const services = defineResource<CoachingService>({
  key: 'services',
  singular: 'Service',
  plural: 'Coaching services',
  description: 'Service pages: who each service is for, what is included and how it works.',
  icon: 'trophy',
  store: ServiceCatalogStore,
  columns: [
    { label: 'Name', value: (s) => s.name },
    { label: 'Delivery', value: (s) => s.delivery },
    {
      label: 'Featured',
      value: (s) => yesNo(!!s.featured),
      tone: (s) => (s.featured ? 'accent' : null),
    },
  ],
  searchText: (s) => s.name,
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    {
      key: 'slug',
      label: 'URL slug',
      type: 'slug',
      hint: 'Leave empty to generate from the name.',
    },
    {
      key: 'delivery',
      label: 'Delivery',
      type: 'select',
      required: true,
      options: [
        { value: 'online', label: 'Online' },
        { value: 'in-person', label: 'In person' },
        { value: 'hybrid', label: 'Online or in person' },
      ],
    },
    { key: 'icon', label: 'Icon name', type: 'text', hint: 'e.g. dumbbell, flame, trophy, users' },
    {
      key: 'shortDescription',
      label: 'Short description',
      type: 'textarea',
      required: true,
      rows: 2,
      maxLength: 200,
    },
    { key: 'intro', label: 'Introduction', type: 'textarea', required: true },
    { key: 'whoItsFor', label: 'Who it’s for', type: 'lines' },
    { key: 'included', label: 'What’s included', type: 'lines' },
    { key: 'howItWorks', label: 'How it works (steps)', type: 'lines' },
    { key: 'gettingStarted', label: 'Getting started', type: 'textarea', rows: 2 },
    { key: 'featured', label: 'Feature on the homepage', type: 'checkbox' },
  ],
  toForm: (s) => ({ ...s }),
  fromForm: (v, existing) => {
    const slug = str(v['slug']) || slugify(str(v['name']));
    return {
      ...(existing ?? {}),
      id: existing?.id ?? slug,
      slug,
      name: str(v['name']),
      icon: str(v['icon']) || 'dumbbell',
      delivery: str(v['delivery']) as CoachingService['delivery'],
      shortDescription: str(v['shortDescription']),
      intro: str(v['intro']),
      whoItsFor: list(v['whoItsFor']),
      included: list(v['included']),
      howItWorks: list(v['howItWorks']),
      gettingStarted: str(v['gettingStarted']),
      featured: bool(v['featured']),
    };
  },
  blank: () => ({ delivery: 'online', icon: 'dumbbell' }),
  publicUrl: (s) => `/services/${s.slug}`,
});

// ---------------------------------------------------------------- Articles
const articles = defineResource<Article>({
  key: 'articles',
  singular: 'Article',
  plural: 'Blog articles',
  description: 'Blog posts with SEO title, meta description, category and structured content.',
  icon: 'book',
  store: ArticleStore,
  columns: [
    { label: 'Title', value: (a) => a.title },
    { label: 'Category', value: (a) => ARTICLE_CATEGORY_LABELS[a.category] },
    { label: 'Published', value: (a) => a.publishedAt },
    {
      label: 'Status',
      value: (a) => (a.published ? 'Live' : 'Draft'),
      tone: (a) => (a.published ? 'success' : null),
    },
  ],
  searchText: (a) => `${a.title} ${a.tags.join(' ')}`,
  filter: {
    label: 'Category',
    options: optionsFrom(ARTICLE_CATEGORY_LABELS),
    matches: (a, v) => a.category === v,
  },
  fields: [
    { key: 'title', label: 'Title (H1)', type: 'text', required: true, maxLength: 120, wide: true },
    {
      key: 'slug',
      label: 'URL slug',
      type: 'slug',
      hint: 'Leave empty to generate from the title.',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: optionsFrom(ARTICLE_CATEGORY_LABELS),
    },
    {
      key: 'seoTitle',
      label: 'SEO title',
      type: 'text',
      required: true,
      maxLength: 70,
      hint: 'Max 70 characters.',
    },
    {
      key: 'metaDescription',
      label: 'Meta description',
      type: 'textarea',
      required: true,
      maxLength: 160,
      rows: 2,
    },
    { key: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, maxLength: 300, rows: 2 },
    {
      key: 'body',
      label: 'Content',
      type: 'textarea',
      required: true,
      rows: 18,
      hint: '## Heading · ### Subheading · - bullet · 1. step · > callout · [Link text](/internal-path). Blank line = new paragraph.',
    },
    { key: 'tags', label: 'Tags', type: 'lines', rows: 3 },
    { key: 'author', label: 'Author', type: 'text', required: true },
    { key: 'publishedAt', label: 'Publication date', type: 'date', required: true },
    { key: 'featuredImageUrl', label: 'Featured image path or URL', type: 'url' },
    { key: 'featuredImageAlt', label: 'Featured image alt text', type: 'text', maxLength: 140 },
    { key: 'featured', label: 'Feature on the homepage', type: 'checkbox' },
    { key: 'published', label: 'Published', type: 'checkbox' },
  ],
  toForm: (a) => ({ ...a, body: blocksToMarkup(a.body) }),
  fromForm: (v, existing) => {
    const slug = str(v['slug']) || slugify(str(v['title']));
    const body = markupToBlocks(str(v['body']));
    return {
      id: existing?.id ?? slug,
      slug,
      title: str(v['title']),
      seoTitle: str(v['seoTitle']),
      metaDescription: str(v['metaDescription']),
      excerpt: str(v['excerpt']),
      category: str(v['category']) as ArticleCategory,
      author: str(v['author']),
      publishedAt: str(v['publishedAt']),
      updatedAt: today(),
      readingMinutes: readingMinutes(body),
      featuredImageUrl: optStr(v['featuredImageUrl']),
      featuredImageAlt: optStr(v['featuredImageAlt']),
      body,
      tags: list(v['tags']),
      featured: bool(v['featured']),
      published: bool(v['published']),
    };
  },
  blank: () => ({
    category: 'bodybuilding',
    author: 'Coach Hajaro',
    publishedAt: today(),
    published: false,
  }),
  publicUrl: (a) => (a.published ? `/blog/${a.slug}` : null),
});

// ---------------------------------------------------------------- Results
const transformations = defineResource<Transformation>({
  key: 'transformations',
  singular: 'Transformation',
  plural: 'Transformations',
  description:
    'Before-and-after stories. Only published entries with confirmed written consent appear on the website.',
  icon: 'image',
  store: TransformationStore,
  columns: [
    { label: 'Client', value: (t) => t.clientName },
    { label: 'Headline', value: (t) => t.headline },
    {
      label: 'Consent',
      value: (t) => yesNo(t.consentConfirmed),
      tone: (t) => (t.consentConfirmed ? 'success' : 'danger'),
    },
    {
      label: 'Status',
      value: (t) => (t.published && t.consentConfirmed ? 'Live' : 'Hidden'),
      tone: (t) => (t.published && t.consentConfirmed ? 'success' : null),
    },
  ],
  searchText: (t) => `${t.clientName} ${t.headline}`,
  fields: [
    {
      key: 'clientName',
      label: 'Client display name',
      type: 'text',
      required: true,
      hint: 'Use the name format the client approved (e.g. first name only).',
    },
    { key: 'headline', label: 'Headline', type: 'text', required: true, maxLength: 100 },
    { key: 'goal', label: 'Goal', type: 'text', required: true },
    {
      key: 'durationWeeks',
      label: 'Duration (weeks)',
      type: 'number',
      required: true,
      min: 1,
      max: 520,
    },
    { key: 'story', label: 'Story', type: 'textarea', required: true },
    { key: 'results', label: 'Results achieved (verified)', type: 'lines' },
    { key: 'testimonial', label: 'Client quote (verbatim)', type: 'textarea', rows: 3 },
    { key: 'beforeImageUrl', label: 'Before image path or URL', type: 'url' },
    { key: 'afterImageUrl', label: 'After image path or URL', type: 'url' },
    {
      key: 'consentConfirmed',
      label: 'Written consent to publish images and story is on file',
      type: 'checkbox',
      wide: true,
    },
    { key: 'published', label: 'Published', type: 'checkbox' },
  ],
  toForm: (t) => ({ ...t }),
  fromForm: (v, existing) => ({
    id: existing?.id ?? newId('tr'),
    clientName: str(v['clientName']),
    headline: str(v['headline']),
    goal: str(v['goal']),
    durationWeeks: num(v['durationWeeks'], 12),
    story: str(v['story']),
    results: list(v['results']),
    testimonial: optStr(v['testimonial']),
    beforeImageUrl: optStr(v['beforeImageUrl']),
    afterImageUrl: optStr(v['afterImageUrl']),
    consentConfirmed: bool(v['consentConfirmed']),
    published: bool(v['published']),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }),
  blank: () => ({ durationWeeks: 12, consentConfirmed: false, published: false }),
  publicUrl: () => '/transformations',
});

const testimonials = defineResource<Testimonial>({
  key: 'testimonials',
  singular: 'Testimonial',
  plural: 'Testimonials',
  description: 'Client quotes. Only published testimonials with confirmed consent are displayed.',
  icon: 'message',
  store: TestimonialStore,
  columns: [
    { label: 'Client', value: (t) => t.clientName },
    { label: 'Context', value: (t) => t.context },
    {
      label: 'Consent',
      value: (t) => yesNo(t.consentConfirmed),
      tone: (t) => (t.consentConfirmed ? 'success' : 'danger'),
    },
    {
      label: 'Status',
      value: (t) => (t.published && t.consentConfirmed ? 'Live' : 'Hidden'),
      tone: (t) => (t.published && t.consentConfirmed ? 'success' : null),
    },
  ],
  searchText: (t) => `${t.clientName} ${t.quote}`,
  fields: [
    { key: 'clientName', label: 'Client display name', type: 'text', required: true },
    {
      key: 'context',
      label: 'Context',
      type: 'text',
      required: true,
      hint: 'e.g. Online coaching client, 6 months',
    },
    { key: 'quote', label: 'Quote (verbatim)', type: 'textarea', required: true, maxLength: 600 },
    {
      key: 'consentConfirmed',
      label: 'Written consent to publish is on file',
      type: 'checkbox',
      wide: true,
    },
    { key: 'published', label: 'Published', type: 'checkbox' },
  ],
  toForm: (t) => ({ ...t }),
  fromForm: (v, existing) => ({
    id: existing?.id ?? newId('tm'),
    clientName: str(v['clientName']),
    context: str(v['context']),
    quote: str(v['quote']),
    consentConfirmed: bool(v['consentConfirmed']),
    published: bool(v['published']),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  }),
  blank: () => ({ consentConfirmed: false, published: false }),
  publicUrl: () => '/transformations',
});

// ---------------------------------------------------------------- Bookings
const bookings = defineResource<Booking>({
  key: 'bookings',
  singular: 'Booking',
  plural: 'Bookings',
  description: 'Consultations, sessions and calls.',
  icon: 'calendar',
  store: BookingStore,
  columns: [
    { label: 'When', value: (b) => new Date(b.startsAt).toLocaleString() },
    { label: 'Name', value: (b) => b.name },
    { label: 'Type', value: (b) => BOOKING_TYPE_LABELS[b.type] },
    {
      label: 'Status',
      value: (b) => b.status,
      tone: (b) =>
        b.status === 'confirmed'
          ? 'success'
          : b.status === 'requested'
            ? 'accent'
            : b.status === 'cancelled'
              ? 'danger'
              : null,
    },
  ],
  searchText: (b) => `${b.name} ${b.email}`,
  filter: {
    label: 'Status',
    options: ['requested', 'confirmed', 'completed', 'cancelled'].map((s) => ({
      value: s,
      label: s,
    })),
    matches: (b, v) => b.status === v,
  },
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'clientId', label: 'Client account ID (optional)', type: 'text' },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: optionsFrom(BOOKING_TYPE_LABELS),
    },
    { key: 'startsAt', label: 'Date & time', type: 'datetime', required: true },
    {
      key: 'durationMinutes',
      label: 'Duration (minutes)',
      type: 'number',
      required: true,
      min: 5,
      max: 240,
      step: 5,
    },
    { key: 'location', label: 'Location', type: 'text', required: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: ['requested', 'confirmed', 'completed', 'cancelled'].map((s) => ({
        value: s,
        label: s,
      })),
    },
    { key: 'notes', label: 'Notes', type: 'textarea', rows: 3 },
  ],
  toForm: (b) => ({ ...b }),
  fromForm: (v, existing) => ({
    id: existing?.id ?? newId('b'),
    clientId: optStr(v['clientId']),
    name: str(v['name']),
    email: str(v['email']),
    type: str(v['type']) as Booking['type'],
    startsAt: str(v['startsAt']),
    durationMinutes: num(v['durationMinutes'], 30),
    location: str(v['location']),
    status: str(v['status']) as Booking['status'],
    notes: optStr(v['notes']),
  }),
  blank: () => ({
    type: 'consultation',
    durationMinutes: 20,
    location: 'Video call',
    status: 'confirmed',
  }),
});

// ---------------------------------------------------------------- Clients (list; custom detail)
const clients = defineResource<ClientProfile>({
  key: 'clients',
  singular: 'Client',
  plural: 'Clients',
  description: 'Client accounts, assigned programs, nutrition targets and progress.',
  icon: 'users',
  store: ClientStore,
  columns: [
    { label: 'Name', value: (c) => c.name },
    { label: 'Email', value: (c) => c.email },
    { label: 'Goal', value: (c) => c.goal },
    {
      label: 'Status',
      value: (c) => c.status,
      tone: (c) =>
        c.status === 'active' ? 'success' : c.status === 'onboarding' ? 'accent' : null,
    },
  ],
  searchText: (c) => `${c.name} ${c.email}`,
  filter: {
    label: 'Status',
    options: ['active', 'onboarding', 'paused', 'archived'].map((s) => ({ value: s, label: s })),
    matches: (c, v) => c.status === v,
  },
  fields: [
    { key: 'name', label: 'Name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'goal', label: 'Goal', type: 'text', required: true },
    { key: 'startDate', label: 'Start date', type: 'date', required: true },
  ],
  toForm: (c) => ({ ...c }),
  fromForm: (v, existing) => ({
    ...(existing ?? {}),
    id: existing?.id ?? newId('client'),
    name: str(v['name']),
    email: str(v['email']).toLowerCase(),
    goal: str(v['goal']),
    startDate: str(v['startDate']),
    status: existing?.status ?? 'onboarding',
  }),
  blank: () => ({ startDate: today() }),
  editPath: (id) => `/admin/clients/${id}`,
});

export const ADMIN_RESOURCES: readonly ResourceConfig<Entity>[] = [
  clients,
  programs,
  exercises,
  packages,
  services,
  articles,
  transformations,
  testimonials,
  bookings,
];

export function findResource(key: string): ResourceConfig<Entity> | undefined {
  return ADMIN_RESOURCES.find((r) => r.key === key);
}
