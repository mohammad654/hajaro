import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  Renderer2,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { PRIMARY_NAV } from '../../core/config/navigation.config';
import { SITE_CONFIG } from '../../core/config/site.config';
import { AuthService } from '../../core/auth/auth.service';
import { ClientReady } from '../../core/services/client-ready';
import { Icon } from '../../shared/ui/icon/icon';
import { LanguageSwitcher } from '../../shared/ui/language-switcher';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-site-header',
  imports: [LocalePathPipe, RouterLink, RouterLinkActive, Icon, LanguageSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  host: {
    '(document:keydown.escape)': 'closeAll()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class SiteHeader {
  private readonly document = inject(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly auth = inject(AuthService);
  /** Session state is browser-only; render it after hydration so prerendered HTML matches. */
  private readonly ready = inject(ClientReady).ready;
  /** Session state is browser-only; render it after hydration so prerendered HTML matches. */
  protected readonly sessionUser = computed(() => (this.ready() ? this.auth.user() : null));

  protected readonly nav = PRIMARY_NAV;
  protected readonly brand = SITE_CONFIG;
  protected readonly openDropdown = signal<string | null>(null);
  protected readonly mobileOpen = signal(false);
  protected readonly scrolled = signal(false);

  private readonly menuToggle = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');
  private readonly mobilePanel = viewChild<ElementRef<HTMLElement>>('mobilePanel');

  constructor() {
    const destroyRef = inject(DestroyRef);
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(() => this.closeAll(false));

    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 8);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));

      // The toggle is hidden from the desktop breakpoint up (keep in sync with $bp-lg), so an open
      // mobile menu would be stuck open with the page scroll-locked; close it when we get there.
      const desktop = window.matchMedia('(min-width: 1080px)');
      const onBreakpoint = (e: MediaQueryListEvent) => e.matches && this.closeAll(false);
      desktop.addEventListener('change', onBreakpoint);
      destroyRef.onDestroy(() => desktop.removeEventListener('change', onBreakpoint));
    });
  }

  protected toggleDropdown(label: string): void {
    this.openDropdown.update((open) => (open === label ? null : label));
  }

  protected toggleMobile(): void {
    if (this.mobileOpen()) {
      this.closeAll();
      return;
    }
    this.mobileOpen.set(true);
    this.renderer.addClass(this.document.body, 'is-scroll-locked');
    // Move focus into the panel once it has rendered.
    setTimeout(() =>
      this.mobilePanel()?.nativeElement.querySelector<HTMLElement>('a, button')?.focus(),
    );
  }

  protected closeAll(restoreFocus = true): void {
    this.openDropdown.set(null);
    if (this.mobileOpen()) {
      this.mobileOpen.set(false);
      this.renderer.removeClass(this.document.body, 'is-scroll-locked');
      if (restoreFocus) this.menuToggle()?.nativeElement.focus();
    }
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.openDropdown() && !this.host.nativeElement.contains(event.target as Node)) {
      this.openDropdown.set(null);
    }
  }
}
