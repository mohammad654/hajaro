import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FOOTER_NAV } from '../../core/config/navigation.config';
import { SITE_CONFIG } from '../../core/config/site.config';
import { Icon } from '../../shared/ui/icon/icon';
import { WHATSAPP_PATH, whatsappHref } from '../../shared/ui/whatsapp-button';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-site-footer',
  imports: [LocalePathPipe, RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly brand = SITE_CONFIG;
  protected readonly columns = FOOTER_NAV;
  protected readonly socials = SITE_CONFIG.social.filter((s) => s.url);
  protected readonly year = new Date().getFullYear();
  protected readonly whatsapp = whatsappHref();
  protected readonly whatsappPath = WHATSAPP_PATH;
  private readonly document = inject(DOCUMENT);

  /**
   * Scrolls to the top (smooth unless the user prefers reduced motion — see the global
   * `scroll-behavior` rule) and moves focus to the main content so keyboard users land there too.
   */
  protected scrollToTop(): void {
    this.document.defaultView?.scrollTo({ top: 0 });
    this.document.getElementById('main')?.focus({ preventScroll: true });
  }
}
