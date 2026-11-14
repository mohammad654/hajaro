import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteContentStore } from '../../../core/data-access/site-content.store';
import { MuscleId } from '../../../core/models';
import { AnatomyFigure } from '../../../shared/anatomy/anatomy-figure';
import { Icon } from '../../../shared/ui/icon/icon';
import { HERO_PILLARS } from '../home.content';

@Component({
  selector: 'app-home-hero',
  imports: [RouterLink, AnatomyFigure, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__grid-bg" aria-hidden="true"></div>
      <div class="container hero__inner">
        <div class="hero__copy reveal">
          <p class="eyebrow">{{ content().heroEyebrow }}</p>
          <h1 id="hero-title" class="hero__title">
            {{ content().heroHeadline }}
            <span class="highlight">{{ content().heroHighlight }}</span>
          </h1>
          <p class="hero__lead">{{ content().heroSubheadline }}</p>
          <div class="cluster hero__ctas">
            <a class="btn btn--primary btn--lg" routerLink="/contact">
              Start your transformation <app-icon name="arrow-right" [size]="18" />
            </a>
            <a class="btn btn--lg" routerLink="/programs">Explore training programs</a>
          </div>
          <ul class="hero__pillars">
            @for (pillar of pillars; track pillar.label) {
              <li><app-icon [name]="pillar.icon" [size]="18" /> {{ pillar.label }}</li>
            }
          </ul>
        </div>

        <div class="hero__visual" aria-hidden="true">
          <app-anatomy-figure
            class="hero__figure hero__figure--front"
            view="front"
            [primary]="frontFocus"
            [animated]="true"
          />
          <app-anatomy-figure
            class="hero__figure hero__figure--back"
            view="back"
            [primary]="backFocus"
            [animated]="true"
          />
          <a routerLink="/muscle-chart" class="hero__chart-link" tabindex="-1"
            >Interactive muscle chart →</a
          >
        </div>
      </div>
    </section>
  `,
  styleUrl: './home-hero.scss',
})
export class HomeHero {
  protected readonly content = inject(SiteContentStore).content;
  protected readonly pillars = HERO_PILLARS;
  protected readonly frontFocus: readonly MuscleId[] = [
    'chest',
    'side-delts',
    'front-delts',
    'rectus-abdominis',
    'quadriceps',
  ];
  protected readonly backFocus: readonly MuscleId[] = [
    'lats',
    'traps',
    'glutes',
    'hamstrings',
    'rear-delts',
  ];
}
