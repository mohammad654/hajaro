import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Icon } from './icon/icon';

/**
 * Converts a YouTube / Vimeo URL to a privacy-friendly embed URL, or returns null if the URL is
 * not from an allow-listed provider. Only the extracted video ID is used — never the raw input.
 */
export function toSafeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:') return null;
  const host = parsed.hostname.replace(/^www\./, '');
  const idPattern = /^[A-Za-z0-9_-]{6,20}$/;

  let youtubeId: string | null = null;
  if (host === 'youtu.be') youtubeId = parsed.pathname.slice(1);
  else if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
    youtubeId =
      parsed.searchParams.get('v') ?? parsed.pathname.split('/').filter(Boolean).pop() ?? null;
  }
  if (youtubeId && idPattern.test(youtubeId))
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`;

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const vimeoId = parsed.pathname.split('/').filter(Boolean).pop() ?? '';
    if (/^\d{6,12}$/.test(vimeoId)) return `https://player.vimeo.com/video/${vimeoId}?dnt=1`;
  }
  return null;
}

/**
 * Click-to-load video: nothing from the third-party provider is requested until the visitor
 * chooses to play (better performance and privacy / GDPR).
 */
@Component({
  selector: 'app-video-embed',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (embedUrl()) {
      <div class="video">
        @if (loaded() && safeUrl(); as url) {
          <iframe
            [src]="url"
            [title]="title()"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        } @else {
          <button type="button" class="video__poster" (click)="loaded.set(true)">
            <span class="video__play"><app-icon name="play" [size]="28" /></span>
            <span>Play demonstration video</span>
            <small>Loads content from a third-party video provider</small>
          </button>
        }
      </div>
    }
  `,
  styles: `
    .video {
      position: relative;
      aspect-ratio: 16 / 9;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--c-border);
      background: var(--c-surface-2);
    }
    iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    .video__poster {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--sp-2);
      width: 100%;
      border: 0;
      background:
        radial-gradient(circle at center, rgb(232 176 74 / 12%), transparent 60%), var(--c-surface);
      color: var(--c-text);
      font-weight: 600;
    }
    .video__poster small {
      color: var(--c-text-subtle);
      font-weight: 400;
    }
    .video__play {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--c-accent);
      color: var(--c-on-accent);
    }
  `,
})
export class VideoEmbed {
  private readonly sanitizer = inject(DomSanitizer);
  readonly url = input<string | null | undefined>(null);
  readonly title = input('Exercise demonstration');

  protected readonly loaded = signal(false);
  protected readonly embedUrl = computed(() => toSafeEmbedUrl(this.url()));
  protected readonly safeUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.embedUrl();
    // Safe: URL is rebuilt from a validated ID on an allow-listed host.
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });
}
