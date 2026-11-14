import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/ui/icon/icon';

/** Privacy-friendly share links (plain URLs — no third-party scripts or tracking pixels). */
@Component({
  selector: 'app-share-links',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="share">
      <p class="share__title">Share this article</p>
      <ul>
        @for (link of links(); track link.label) {
          <li>
            <a class="btn btn--sm" [href]="link.href" target="_blank" rel="noopener noreferrer">{{
              link.label
            }}</a>
          </li>
        }
        <li>
          <button type="button" class="btn btn--sm" (click)="copy()">
            <app-icon name="link" [size]="16" /> Copy link
          </button>
        </li>
      </ul>
    </div>
  `,
  styles: `
    .share__title {
      font-size: var(--fs-xs);
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--c-text-subtle);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-2);
    }
  `,
})
export class ShareLinks {
  private readonly toast = inject(ToastService);
  readonly url = input.required<string>();
  readonly title = input.required<string>();

  protected readonly links = computed(() => {
    const u = encodeURIComponent(this.url());
    const t = encodeURIComponent(this.title());
    return [
      { label: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
      { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
      { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
      { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}` },
      { label: 'Email', href: `mailto:?subject=${t}&body=${u}` },
    ];
  });

  protected copy(): void {
    navigator.clipboard
      ?.writeText(this.url())
      .then(() => this.toast.success('Link copied to clipboard.'))
      .catch(() => this.toast.error('Could not copy the link.'));
  }
}
