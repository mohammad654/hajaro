import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Breadcrumbs, Crumb } from './breadcrumbs';
import { MediaFrame } from './media-frame';

/**
 * Standard header for inner pages: breadcrumbs, eyebrow, the page's single H1 and a lead paragraph,
 * with an optional photo beside the text (or behind it, with `imageBackground`), or a placeholder.
 */
@Component({
  selector: 'app-page-hero',
  imports: [NgOptimizedImage, Breadcrumbs, MediaFrame],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="page-hero"
      [class.page-hero--media]="!imageBackground() && (imageSrc() || imagePlaceholder())"
      [class.page-hero--bg]="imageBackground() && imageSrc()"
    >
      @if (imageBackground() && imageSrc()) {
        <div class="page-hero__bg">
          <img
            [ngSrc]="imageSrc()"
            alt=""
            fill
            priority
            sizes="100vw"
            [style.object-position]="imagePosition()"
          />
        </div>
      }
      <div class="container page-hero__inner">
        <div class="reveal">
          @if (breadcrumbs().length) {
            <app-breadcrumbs [items]="breadcrumbs()" />
          }
          @if (eyebrow()) {
            <p class="eyebrow">{{ eyebrow() }}</p>
          }
          <h1>{{ title() }}</h1>
          @if (lead()) {
            <p class="lead">{{ lead() }}</p>
          }
          <ng-content />
        </div>
        @if (!imageBackground() && (imageSrc() || imagePlaceholder())) {
          <app-media-frame
            [src]="imageSrc()"
            [alt]="imageAlt()"
            ratio="3 / 2"
            [position]="imagePosition()"
            [priority]="true"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        }
      </div>
    </header>
  `,
  styles: `
    @use 'mixins' as *;

    .page-hero {
      position: relative;
      padding: calc(var(--sp-8) + var(--sp-4)) 0 var(--sp-8);
      background:
        radial-gradient(60% 120% at 85% 0%, var(--c-accent-glow), transparent 60%),
        linear-gradient(180deg, var(--c-bg-elevated), var(--c-bg));
      border-bottom: 1px solid var(--c-border);
      overflow: hidden;
    }
    .page-hero::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      z-index: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--c-accent-line), transparent);
    }
    h1 {
      max-width: 18ch;
    }
    .page-hero--bg {
      display: grid;
      align-items: center;
      min-height: clamp(360px, 52vh, 540px);
    }
    .page-hero__bg {
      position: absolute;
      inset: 0;
    }
    .page-hero__bg img {
      object-fit: cover;
    }
    /* Darken the photo so the text stays readable; lighter on the right on wide screens. */
    .page-hero__bg::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, var(--c-scrim), var(--c-scrim-strong));
    }
    .page-hero--bg .page-hero__inner {
      position: relative;
    }
    .page-hero--bg .lead {
      color: var(--c-text);
    }
    .lead {
      margin-bottom: 0;
    }
    .page-hero--media .page-hero__inner {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--sp-6);
    }
    app-media-frame {
      max-width: 640px;
    }
    @include up($bp-lg) {
      .page-hero--media .page-hero__inner {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--sp-7);
        align-items: center;
      }
      app-media-frame {
        max-width: none;
      }
      .page-hero__bg::after {
        background:
          linear-gradient(
            90deg,
            var(--c-bg) 0%,
            var(--c-scrim-strong) 38%,
            var(--c-scrim-soft) 100%
          ),
          linear-gradient(0deg, var(--c-bg), transparent 35%);
      }
    }
  `,
})
export class PageHero {
  readonly title = input.required<string>();
  readonly eyebrow = input('');
  readonly lead = input('');
  readonly breadcrumbs = input<readonly Crumb[]>([]);
  readonly imageSrc = input('');
  readonly imageAlt = input('');
  readonly imagePosition = input('center');
  readonly imagePlaceholder = input(false);
  /** Show the photo as a darkened background behind the text instead of beside it. */
  readonly imageBackground = input(false);
}
