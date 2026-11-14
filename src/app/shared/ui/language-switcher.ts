import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SITE_LOCALES, SiteLocale, injectSiteLocale, localizedPath } from '../../core/i18n/locales';

/**
 * Links to the current page in every site language, each with its flag.
 *
 * Each language is a separately compiled build served under its own URL prefix, so these are
 * plain `href` links (a full page load into the other bundle), not `routerLink`s.
 * Flags are inline SVG data URIs in CSS: no extra requests, no duplicate SVG ids when the
 * switcher is rendered twice (header + mobile menu), identical on every OS (unlike emoji flags).
 */
@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="lang" [class.lang--block]="block()" i18n-aria-label aria-label="Language">
      @for (locale of locales; track locale.code) {
        <li>
          <a
            class="lang__link"
            [href]="hrefs()[locale.code]"
            [attr.hreflang]="locale.code"
            [attr.lang]="locale.code"
            [attr.aria-current]="locale.code === current.code ? 'true' : null"
          >
            <span class="lang__flag lang__flag--{{ locale.code }}" aria-hidden="true"></span>
            @if (block()) {
              {{ locale.name }}
            } @else {
              <span aria-hidden="true">{{ locale.code.toUpperCase() }}</span>
              <span class="visually-hidden">{{ locale.name }}</span>
            }
          </a>
        </li>
      }
    </ul>
  `,
  styles: `
    .lang {
      display: inline-flex;
      gap: 2px;
      margin: 0;
      padding: 2px;
      list-style: none;
      border: 1px solid var(--c-border-strong);
      border-radius: var(--radius-pill);
    }
    .lang__link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 32px;
      padding: 0 var(--sp-2);
      border-radius: var(--radius-pill);
      color: var(--c-text-muted);
      font-size: var(--fs-xs);
      font-weight: 700;
      letter-spacing: 0.06em;
      text-decoration: none;
      transition:
        background-color var(--dur) var(--ease),
        color var(--dur) var(--ease);
    }
    .lang__link:hover {
      color: var(--c-text);
    }
    .lang__link[aria-current='true'] {
      background: var(--c-surface-3);
      color: var(--c-text);
    }
    .lang__flag {
      flex-shrink: 0;
      width: 20px;
      height: 14px;
      border-radius: 2px;
      background: center / cover no-repeat;
      box-shadow: 0 0 0 1px rgb(255 255 255 / 18%);
      opacity: 0.75;
      transition: opacity var(--dur) var(--ease);
    }
    .lang__link:hover .lang__flag,
    .lang__link[aria-current='true'] .lang__flag {
      opacity: 1;
    }
    .lang__flag--en {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3CclipPath id='t'%3E%3Cpath d='M30 15h30v15zv15h-30zh-30v-15zv-15h30z'/%3E%3C/clipPath%3E%3Cpath d='M0 0v30h60V0z' fill='%23012169'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' clip-path='url(%23t)' stroke='%23C8102E' stroke-width='4'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23fff' stroke-width='10'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23C8102E' stroke-width='6'/%3E%3C/svg%3E");
    }
    .lang__flag--nl {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 6'%3E%3Cpath fill='%2321468B' d='M0 0h9v6H0z'/%3E%3Cpath fill='%23fff' d='M0 0h9v4H0z'/%3E%3Cpath fill='%23AE1C28' d='M0 0h9v2H0z'/%3E%3C/svg%3E");
    }
    .lang--block {
      display: flex;
      width: 100%;
    }
    .lang--block li {
      flex: 1;
    }
    .lang--block .lang__link {
      width: 100%;
      height: 44px;
      gap: var(--sp-2);
      font-size: var(--fs-sm);
      letter-spacing: 0;
    }
  `,
})
export class LanguageSwitcher {
  /** Full-width variant with language names (mobile menu). */
  readonly block = input(false);

  protected readonly locales = SITE_LOCALES;
  protected readonly current = injectSiteLocale();

  private readonly router = inject(Router);
  private readonly path = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.routerPath()),
    ),
    { initialValue: this.routerPath() },
  );

  protected readonly hrefs = computed(
    () =>
      Object.fromEntries(
        SITE_LOCALES.map((l: SiteLocale) => [
          l.code,
          // In development each language has its own dev server (see environment.localeOrigins).
          `${environment.localeOrigins?.[l.code] ?? ''}${localizedPath(l, this.path())}`,
        ]),
      ) as Record<SiteLocale['code'], string>,
  );

  /** Router URL without query string or fragment (those can carry personal data). */
  private routerPath(): string {
    return this.router.url.split(/[?#]/)[0] || '/';
  }
}
