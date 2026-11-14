import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { SITE_CONFIG } from '../../core/config/site.config';
import { Icon } from '../../shared/ui/icon/icon';
import { SkipLink } from '../../shared/ui/skip-link';
import { LocalePathPipe } from '../../core/i18n/current-locale';

export interface PortalNavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
  readonly exact?: boolean;
}

/** Application shell for authenticated areas: responsive sidebar navigation + content outlet. */
@Component({
  selector: 'app-portal-shell',
  imports: [LocalePathPipe, RouterOutlet, RouterLink, RouterLinkActive, Icon, SkipLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portal-shell.html',
  styleUrl: './portal-shell.scss',
})
export class PortalShell {
  protected readonly auth = inject(AuthService);
  protected readonly brand = SITE_CONFIG;

  readonly title = input.required<string>();
  readonly nav = input.required<readonly PortalNavItem[]>();

  protected readonly menuOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.menuOpen.set(false));
  }
}
