import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalePathPipe } from '../../core/i18n/current-locale';

@Component({
  selector: 'app-not-found-content',
  imports: [LocalePathPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section not-found">
      <div class="container container--narrow">
        <p class="not-found__code" aria-hidden="true">404</p>
        <h1>We couldn’t find that {{ what() }}</h1>
        <p class="lead">It may have been moved or renamed. Try one of these instead:</p>
        <div class="cluster">
          <a class="btn btn--primary" [routerLink]="backLink() | localePath">{{ backLabel() }}</a>
          <a class="btn" [routerLink]="'/' | localePath">Back to home</a>
          <a class="btn btn--ghost" [routerLink]="'/contact' | localePath">Contact us</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .not-found {
      text-align: center;
      min-height: 60vh;
      display: grid;
      align-items: center;
    }
    .not-found__code {
      font-family: var(--font-display);
      font-size: clamp(6rem, 4rem + 10vw, 12rem);
      font-weight: 800;
      line-height: 1;
      margin: 0;
      color: transparent;
      -webkit-text-stroke: 2px var(--c-accent-line);
    }
    .lead {
      margin-inline: auto;
    }
    .cluster {
      justify-content: center;
      margin-top: var(--sp-6);
    }
  `,
})
export class NotFoundContent {
  readonly what = input('page');
  readonly backLink = input('/');
  readonly backLabel = input('Go back');
}
