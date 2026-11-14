import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CoachingType, ExperienceLevel } from '../models';

/** An enquiry from the contact form, as sent to the server. */
export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly goals: readonly string[];
  readonly coachingType: CoachingType;
  readonly experience: ExperienceLevel;
  readonly message: string;
  readonly wantsConsultation: boolean;
  readonly preferredTime?: string;
  /** What the visitor was looking at (package, service or program), if anything. */
  readonly context?: string;
  /** Language of the page the form was sent from, so the reply can be in the same language. */
  readonly language: string;
  /** Honeypot field, see the contact form. */
  readonly website: string;
}

/**
 * Delivers contact-form enquiries. The form depends on this abstraction only, so the delivery
 * channel (own server endpoint, CRM, booking tool) can be swapped in app.config.ts.
 */
export abstract class ContactGateway {
  abstract send(request: ContactRequest): Observable<void>;
}

/** Posts to the site's own server, which emails the enquiry (src/server/contact.ts). */
@Injectable()
export class HttpContactGateway extends ContactGateway {
  private readonly http = inject(HttpClient);

  send(request: ContactRequest): Observable<void> {
    return this.http.post(environment.contactEndpoint, request).pipe(map(() => undefined));
  }
}
