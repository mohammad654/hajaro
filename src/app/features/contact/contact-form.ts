import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  OnInit,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiError } from '../../core/api/api-error';
import { ContactGateway, ContactRequest } from '../../core/contact/contact-gateway';
import { CURRENT_LOCALE } from '../../core/i18n/current-locale';
import { SITE_CONFIG } from '../../core/config/site.config';
import { PackageStore } from '../../core/data-access/package.store';
import { ProgramStore } from '../../core/data-access/program.store';
import { ServiceCatalogStore } from '../../core/data-access/service-catalog.store';
import {
  COACHING_TYPE_LABELS,
  CoachingType,
  EXPERIENCE_LABELS,
  ExperienceLevel,
} from '../../core/models';
import { FieldError } from '../../shared/forms/field-error';
import { phoneValidator } from '../../shared/forms/validation-messages';
import { Icon } from '../../shared/ui/icon/icon';
import { LocalePathPipe } from '../../core/i18n/current-locale';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const GOAL_OPTIONS = [
  'Build muscle',
  'Lose fat',
  'Body recomposition',
  'Get stronger',
  'Compete on stage',
  'Improve fitness & health',
] as const;

const PREFERRED_TIMES = [
  'Weekday mornings',
  'Weekday afternoons',
  'Weekday evenings',
  'Weekends',
  'Flexible',
];

/** What went wrong, and what the visitor can do instead. Nothing they typed is lost. */
function sendErrorMessage(status: number): string {
  const email = SITE_CONFIG.contact.email;
  switch (status) {
    case 400:
      return $localize`Some details could not be accepted. Check the fields and send the form again.`;
    case 429:
      return $localize`You sent several messages in a short time. Wait a few minutes, or email ${email}:EMAIL: directly.`;
    case 0:
      return $localize`Your message was not sent because there is no connection. Check your internet connection and try again.`;
    default:
      return $localize`Your message could not be sent right now. Try again later, or email ${email}:EMAIL: directly.`;
  }
}

/** Removes control characters and trims user input before it leaves the browser. */
const clean = (value: string) =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();

@Component({
  selector: 'app-contact-form',
  imports: [LocalePathPipe, ReactiveFormsModule, RouterLink, FieldError, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly gateway = inject(ContactGateway);
  private readonly packages = inject(PackageStore);
  private readonly services = inject(ServiceCatalogStore);
  private readonly programs = inject(ProgramStore);

  /** Context from query params (?package=…, ?service=…, ?program=…). */
  readonly packageId = input<string | undefined>(undefined);
  readonly serviceSlug = input<string | undefined>(undefined);
  readonly programSlug = input<string | undefined>(undefined);

  protected readonly goalOptions = GOAL_OPTIONS;
  protected readonly coachingTypes = Object.entries(COACHING_TYPE_LABELS) as [
    CoachingType,
    string,
  ][];
  protected readonly experienceLevels = Object.entries(EXPERIENCE_LABELS) as [
    ExperienceLevel,
    string,
  ][];
  protected readonly preferredTimes = PREFERRED_TIMES;
  protected readonly responseTime = SITE_CONFIG.contact.responseTime;

  protected readonly state = signal<FormState>('idle');
  protected readonly errorMessage = signal('');
  protected readonly submittedName = signal('');

  protected readonly form = this.fb.group({
    name: this.fb.control('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(80),
    ]),
    email: this.fb.control('', [Validators.required, Validators.email, Validators.maxLength(120)]),
    phone: this.fb.control('', [phoneValidator]),
    goals: this.fb.control<string[]>([], [Validators.required]),
    coachingType: this.fb.control<CoachingType>('not-sure'),
    experience: this.fb.control<ExperienceLevel>('beginner'),
    message: this.fb.control('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(2000),
    ]),
    wantsConsultation: this.fb.control(true),
    preferredTime: this.fb.control('Flexible'),
    consent: this.fb.control(false, [Validators.requiredTrue]),
    /** Honeypot: hidden from people, often filled by bots. */
    website: this.fb.control(''),
  });

  protected readonly contextLabel = computed(() => {
    const pkg = this.packages.get(this.packageId());
    if (pkg) return `Package: ${pkg.name}`;
    const service = this.services.bySlug(this.serviceSlug() ?? '');
    if (service) return `Service: ${service.name}`;
    const program = this.programs.bySlug(this.programSlug() ?? '');
    if (program) return `Program: ${program.name}`;
    return '';
  });

  ngOnInit(): void {
    const service = this.services.bySlug(this.serviceSlug() ?? '');
    if (
      service?.slug === 'competition-preparation' ||
      service?.slug === 'posing-coaching' ||
      this.packageId() === 'competition-preparation'
    ) {
      this.form.controls.coachingType.setValue('competition-prep');
    } else if (service?.delivery === 'online') {
      this.form.controls.coachingType.setValue('online');
    } else if (service?.delivery === 'in-person') {
      this.form.controls.coachingType.setValue('in-person');
    }
  }

  protected toggleGoal(goal: string, checked: boolean): void {
    const control = this.form.controls.goals;
    const next = checked ? [...control.value, goal] : control.value.filter((g) => g !== goal);
    control.setValue(next);
    control.markAsTouched();
  }

  protected isChecked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    const v = this.form.getRawValue();
    if (v.website) {
      // Silently accept bot submissions without storing them.
      this.state.set('success');
      return;
    }

    const context = this.contextLabel();
    const request: ContactRequest = {
      name: clean(v.name),
      email: clean(v.email).toLowerCase(),
      ...(v.phone ? { phone: clean(v.phone) } : {}),
      goals: v.goals,
      coachingType: v.coachingType,
      experience: v.experience,
      message: clean(v.message),
      wantsConsultation: v.wantsConsultation,
      ...(v.wantsConsultation ? { preferredTime: v.preferredTime } : {}),
      ...(context ? { context } : {}),
      language: CURRENT_LOCALE.code,
      website: v.website,
    };

    this.state.set('submitting');
    this.gateway
      .send(request)
      .pipe(finalize(() => this.state() === 'submitting' && this.state.set('idle')))
      .subscribe({
        next: () => {
          this.submittedName.set(request.name.split(' ')[0]);
          this.state.set('success');
          // The form stays filled in on errors, so nothing typed is lost; clear it only on success.
          this.form.reset();
        },
        error: (error: unknown) => {
          this.errorMessage.set(sendErrorMessage(error instanceof ApiError ? error.status : 0));
          this.state.set('error');
        },
      });
  }

  protected reset(): void {
    this.state.set('idle');
  }

  private focusFirstInvalid(): void {
    if (typeof document === 'undefined') return;
    setTimeout(() =>
      document
        .querySelector<HTMLElement>('.contact-form .ng-invalid:not(form):not(fieldset)')
        ?.focus(),
    );
  }
}
