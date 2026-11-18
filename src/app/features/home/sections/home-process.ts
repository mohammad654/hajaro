import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { COACHING_STEPS } from '../home.content';

@Component({
  selector: 'app-home-process',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section" aria-labelledby="process-title">
      <div class="process__bg" aria-hidden="true">
        <img ngSrc="images/home/louisbauer-sports-1882719_1920.jpg" alt="" fill sizes="100vw" />
      </div>
      <div class="container">
        <div class="section-head section-head--center">
          <p class="eyebrow" i18n>How coaching works</p>
          <h2 id="process-title" i18n>From intro to your first check-in</h2>
        </div>
        <ol class="steps">
          @for (step of steps; track step.title; let i = $index) {
            <li class="card step">
              <span class="step__num" aria-hidden="true">{{
                (i + 1).toString().padStart(2, '0')
              }}</span>
              <h3>{{ step.title }}</h3>
              <p class="text-muted text-small">{{ step.description }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: `
    .process__bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
    .process__bg img {
      object-fit: cover;
      object-position: 30% 70%;
    }
    /* Fades into the page at the edges and keeps the heading readable. */
    .process__bg::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        var(--c-bg),
        rgb(11 11 12 / 60%) 35%,
        rgb(11 11 12 / 60%) 70%,
        var(--c-bg)
      );
    }
    .container {
      position: relative;
    }
    .step {
      background: color-mix(in srgb, var(--c-surface) 82%, transparent);
    }
    .steps {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: var(--sp-5);
    }
    @media (min-width: 640px) {
      .steps {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1080px) {
      .steps {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .step__num {
      display: block;
      font-family: var(--font-display);
      font-size: var(--fs-3xl);
      font-weight: 800;
      line-height: 1;
      color: transparent;
      -webkit-text-stroke: 1.5px var(--c-accent);
      margin-bottom: var(--sp-4);
    }
    .step h3 {
      font-size: var(--fs-lg);
    }
    .step p {
      margin: 0;
    }
  `,
})
export class HomeProcess {
  protected readonly steps = COACHING_STEPS;
}
