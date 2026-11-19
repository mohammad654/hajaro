import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FOOTER_NAV } from '../../core/config/navigation.config';
import { SITE_CONFIG } from '../../core/config/site.config';
import { Icon } from '../../shared/ui/icon/icon';
import { Logo } from '../../shared/ui/logo';
import { WHATSAPP_PATH, whatsappHref } from '../../shared/ui/whatsapp-button';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-site-footer',
  imports: [LocalePathPipe, RouterLink, Icon, Logo],
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
}
