import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsappButton } from '../shared/ui/whatsapp-button';
import { SiteFooter } from './site-footer/site-footer';
import { SiteHeader } from './site-header/site-header';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, SiteHeader, SiteFooter, WhatsappButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    <app-site-footer />
    <app-whatsapp-button />
  `,
  styles: `
    main {
      display: block;
      min-height: 60vh;
      outline: none;
    }
  `,
})
export class PublicLayout {}
