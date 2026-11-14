import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { SiteContentStore } from '../../../core/data-access/site-content.store';
import { CredentialItem, MethodPillar, PageSeo, SiteContent } from '../../../core/models';
import { ToastService } from '../../../core/services/toast.service';
import { Icon } from '../../../shared/ui/icon/icon';
import { SchemaFields } from '../forms/schema-fields';
import {
  FieldDef,
  buildSchemaGroup,
  list,
  optNum,
  optStr,
  readSchemaGroup,
  str,
} from '../forms/schema-form';

const CONTENT_FIELDS: readonly FieldDef[] = [
  { key: 'heroEyebrow', label: 'Hero eyebrow', type: 'text', required: true, maxLength: 80 },
  { key: 'heroHeadline', label: 'Hero headline', type: 'text', required: true, maxLength: 80 },
  {
    key: 'heroHighlight',
    label: 'Hero highlighted words',
    type: 'text',
    required: true,
    maxLength: 80,
  },
  {
    key: 'heroSubheadline',
    label: 'Hero introduction',
    type: 'textarea',
    required: true,
    rows: 3,
    maxLength: 300,
  },
  { key: 'trainerName', label: 'Trainer name', type: 'text', required: true },
  { key: 'trainerRole', label: 'Trainer role / title', type: 'text', required: true },
  {
    key: 'trainerShortBio',
    label: 'Short bio',
    type: 'textarea',
    required: true,
    rows: 3,
    maxLength: 300,
  },
  {
    key: 'trainerBio',
    label: 'Biography paragraphs',
    type: 'lines',
    rows: 6,
    hint: 'Lines starting with “[” are treated as placeholders and hidden.',
  },
  { key: 'trainerJourney', label: 'Fitness journey paragraphs', type: 'lines', rows: 5 },
  { key: 'philosophy', label: 'Coaching philosophy', type: 'lines', rows: 4 },
  { key: 'yearsCoaching', label: 'Years coaching (optional)', type: 'number', min: 0, max: 80 },
  {
    key: 'trainerPhotoUrl',
    label: 'Trainer photo path or URL',
    type: 'url',
    hint: 'e.g. /images/coach/portrait.webp (4:5 ratio)',
  },
  { key: 'trainerPhotoAlt', label: 'Trainer photo alt text', type: 'text', maxLength: 140 },
];

/** Pages whose title and meta description can be overridden. */
const SEO_PAGES: readonly { key: string; label: string }[] = [
  { key: 'home', label: 'Homepage' },
  { key: 'about', label: 'About' },
  { key: 'services', label: 'Services' },
  { key: 'programs', label: 'Programs' },
  { key: 'exercises', label: 'Exercise library' },
  { key: 'muscle-chart', label: 'Muscle chart' },
  { key: 'workout-planner', label: 'Workout planner' },
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'calculators', label: 'Calculators' },
  { key: 'transformations', label: 'Transformations' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'contact', label: 'Contact' },
];

type CredentialGroup = FormGroup<{
  title: FormControl<string>;
  detail: FormControl<string>;
  year: FormControl<string>;
  verified: FormControl<boolean>;
}>;
type PillarGroup = FormGroup<{ title: FormControl<string>; description: FormControl<string> }>;
type CredentialKey = 'qualifications' | 'competitionHistory' | 'achievements';

@Component({
  selector: 'app-site-content-page',
  imports: [ReactiveFormsModule, SchemaFields, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-content-page.html',
  styleUrl: '../../dashboard/pages/dashboard-pages.scss',
  styles: `
    .block {
      margin-bottom: var(--sp-5);
    }
    .item {
      display: grid;
      gap: var(--sp-2);
      padding: var(--sp-3) 0;
      border-bottom: 1px solid var(--c-border);
    }
    @media (min-width: 820px) {
      .item--credential {
        grid-template-columns: 1.4fr 1fr 90px auto auto;
        align-items: center;
      }
      .item--pillar {
        grid-template-columns: 200px 1fr auto;
        align-items: start;
      }
      .seo-row {
        grid-template-columns: 160px 1fr 1.6fr;
        align-items: center;
      }
    }
    .seo-row {
      display: grid;
      gap: var(--sp-2);
      padding: var(--sp-3) 0;
      border-bottom: 1px solid var(--c-border);
    }
  `,
})
export class SiteContentPage {
  private readonly store = inject(SiteContentStore);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly toast = inject(ToastService);

  protected readonly fields = CONTENT_FIELDS;
  protected readonly seoPages = SEO_PAGES;
  protected readonly credentialSections: readonly { key: CredentialKey; label: string }[] = [
    { key: 'qualifications', label: 'Qualifications & certifications' },
    { key: 'competitionHistory', label: 'Competitive bodybuilding history' },
    { key: 'achievements', label: 'Achievements & awards' },
  ];
  protected readonly saving = signal(false);

  protected readonly main = signal<FormGroup>(buildSchemaGroup(CONTENT_FIELDS, {}));
  protected readonly methodology = new FormArray<PillarGroup>([]);
  protected readonly credentials: Record<CredentialKey, FormArray<CredentialGroup>> = {
    qualifications: new FormArray<CredentialGroup>([]),
    competitionHistory: new FormArray<CredentialGroup>([]),
    achievements: new FormArray<CredentialGroup>([]),
  };
  protected readonly seo = new FormGroup<
    Record<string, FormGroup<{ title: FormControl<string>; description: FormControl<string> }>>
  >(
    Object.fromEntries(
      SEO_PAGES.map((p) => [
        p.key,
        this.fb.group({
          title: this.fb.control('', [Validators.maxLength(70)]),
          description: this.fb.control('', [Validators.maxLength(160)]),
        }),
      ]),
    ),
  );

  constructor() {
    effect(() => {
      const content = this.store.content();
      untracked(() => this.populate(content));
    });
  }

  protected addCredential(key: CredentialKey): void {
    this.credentials[key].push(
      this.credentialGroup({ title: '', detail: '', year: '', verified: false }),
    );
  }

  protected addPillar(): void {
    this.methodology.push(this.pillarGroup({ title: '', description: '' }));
  }

  protected save(): void {
    const main = this.main();
    const arrays = [this.methodology, ...Object.values(this.credentials)];
    if (main.invalid || this.seo.invalid || arrays.some((a) => a.invalid)) {
      main.markAllAsTouched();
      this.seo.markAllAsTouched();
      arrays.forEach((a) => a.markAllAsTouched());
      this.toast.error('Please correct the highlighted fields.');
      return;
    }
    const v = readSchemaGroup(CONTENT_FIELDS, main);
    const current = this.store.content();
    const seo: Record<string, PageSeo> = {};
    for (const [key, value] of Object.entries(this.seo.getRawValue())) {
      if (value.title.trim() || value.description.trim()) {
        seo[key] = { title: value.title.trim(), description: value.description.trim() };
      }
    }
    const readCredentials = (key: CredentialKey): CredentialItem[] =>
      this.credentials[key]
        .getRawValue()
        .filter((c) => c.title.trim())
        .map((c) => ({
          title: c.title.trim(),
          detail: c.detail.trim(),
          year: c.year.trim(),
          verified: c.verified,
        }));

    const updated: SiteContent = {
      ...current,
      heroEyebrow: str(v['heroEyebrow']),
      heroHeadline: str(v['heroHeadline']),
      heroHighlight: str(v['heroHighlight']),
      heroSubheadline: str(v['heroSubheadline']),
      trainerName: str(v['trainerName']),
      trainerRole: str(v['trainerRole']),
      trainerShortBio: str(v['trainerShortBio']),
      trainerBio: list(v['trainerBio']),
      trainerJourney: list(v['trainerJourney']),
      philosophy: list(v['philosophy']),
      yearsCoaching: optNum(v['yearsCoaching']),
      trainerPhotoUrl: optStr(v['trainerPhotoUrl']),
      trainerPhotoAlt: optStr(v['trainerPhotoAlt']),
      methodology: this.methodology
        .getRawValue()
        .filter((m) => m.title.trim())
        .map((m): MethodPillar => ({ title: m.title.trim(), description: m.description.trim() })),
      qualifications: readCredentials('qualifications'),
      competitionHistory: readCredentials('competitionHistory'),
      achievements: readCredentials('achievements'),
      seo,
    };
    this.saving.set(true);
    this.store
      .save(updated, false)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.toast.success('Site content saved.'),
        error: (e: Error) => this.toast.error(e.message),
      });
  }

  private populate(content: SiteContent): void {
    this.main.set(buildSchemaGroup(CONTENT_FIELDS, { ...content }));
    this.methodology.clear();
    content.methodology.forEach((m) => this.methodology.push(this.pillarGroup(m)));
    for (const key of Object.keys(this.credentials) as CredentialKey[]) {
      this.credentials[key].clear();
      content[key].forEach((c) => this.credentials[key].push(this.credentialGroup(c)));
    }
    for (const page of SEO_PAGES) {
      const override = content.seo[page.key];
      this.seo.controls[page.key].reset({
        title: override?.title ?? '',
        description: override?.description ?? '',
      });
    }
  }

  private credentialGroup(c: CredentialItem): CredentialGroup {
    return this.fb.group({
      title: this.fb.control(c.title, [Validators.maxLength(120)]),
      detail: this.fb.control(c.detail, [Validators.maxLength(160)]),
      year: this.fb.control(c.year ?? '', [Validators.maxLength(9)]),
      verified: this.fb.control(c.verified),
    });
  }

  private pillarGroup(m: MethodPillar): PillarGroup {
    return this.fb.group({
      title: this.fb.control(m.title, [Validators.maxLength(40)]),
      description: this.fb.control(m.description, [Validators.maxLength(240)]),
    });
  }
}
