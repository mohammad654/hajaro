# Manual test checklist

Run the production build locally first:

```bash
npm run build
NG_ALLOWED_HOSTS=localhost node dist/hajaro/server/server.mjs   # http://localhost:4000
```

To test the contact form email, also set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` and `CONTACT_FROM` (see `.env.example`). Use a test inbox, or a service like Mailtrap.

Use a real phone as well as the browser.

## Languages

- [ ] Open `/` and check that it's Dutch. Open `/en/` and check that it's English.
- [ ] Click every item in the main menu, the "Trainingstools" dropdown and the footer, in both languages. No page shows text in the wrong language. (Allowed: names and gym terms such as Push / Pull / Legs, Biceps, Coaching, Blog.)
- [ ] Use the NL/EN switcher on at least five pages (home, a service, an exercise, a program, a blog article). You land on the same page in the other language, with translated URLs, for example `/diensten/wedstrijdvoorbereiding` ↔ `/en/services/contest-prep`.
- [ ] Choose EN in the switcher, then open `http://localhost:4000/` in the same browser. You're sent to `/en/`. In a private window (no cookie), `/` stays Dutch.
- [ ] Open old URLs and check that each answers with a redirect: `/about` → `/en/about`, `/services/online-personal-training` → `/en/services/online-coaching`, `/nl/services` → `/diensten`, `/coaching` → `/diensten`.
- [ ] Open a page that doesn't exist in both languages (`/bestaat-niet`, `/en/nope`). The 404 page is translated, and DevTools → Network shows status 404.
- [ ] Dates, prices and decimals follow the language: "€ 149", "1,5 min" and BMI "23,4" in Dutch; "1.5 min" in English.

## Contact form (both languages)

- [ ] Submit empty. Each required field shows an error in the page language, and focus moves to the first one.
- [ ] Enter a wrong email ("naam@") and check the error.
- [ ] Message shorter than 20 characters: check the error.
- [ ] Submit correctly. The success message appears ("Bedankt, …" / "Thanks, …") and the email arrives with reply-to set to the visitor and "Website language: nl/en".
- [ ] Without SMTP settings: submitting shows "could not be sent … email <address> directly", and everything you typed is still there.
- [ ] Submit six times quickly. After five you see the "several messages in a short time" message.
- [ ] Open the form from a package (Tarieven → a package button) and check that the package name shows above the form.

## SEO

- [ ] View the page source of a Dutch and an English page:
  - `<html lang="nl">` / `<html lang="en">`
  - a canonical URL
  - three `hreflang` links (nl, en, x-default)
  - `og:locale` and `og:locale:alternate`
- [ ] Every page has its own title and description (check a few with an SEO browser extension).
- [ ] `/sitemap.xml` lists both languages with `xhtml:link` alternates. `/robots.txt` blocks `/dashboard`, `/admin`, `/login` and their `/en/` versions.
- [ ] After deploying: test the home page in Google's Rich Results Test (no errors), share a link in WhatsApp or LinkedIn (image and text show), and add both languages in Search Console.

## Performance

- [ ] Lighthouse mobile on `/`, `/diensten/online-coaching` and `/contact`: Performance is about 86–92, everything else is 100.
- [ ] DevTools → Network on Slow 4G: the first screen appears fast, nothing jumps, and there are no requests to Google Fonts.
- [ ] Response headers: HTML has `content-encoding: br` and `cache-control: no-cache`; `main-*.js` has `max-age=31536000, immutable`.

## Design and accessibility

- [ ] Phone (or DevTools at 360 and 390 px), Dutch: home, services, a service detail, pricing, contact, the muscle chart and login. No sideways scrolling, and long words wrap.
- [ ] Press Tab through the home page and the contact form. The focus is always visible; the skip link appears first.
- [ ] Zoom to 200%. Nothing breaks or overlaps.
- [ ] The WhatsApp button is readable (dark text on green). A screen reader announces "Chat via WhatsApp (opent in een nieuw tabblad)".

## Content

- [ ] Read every page aloud once in each language. Fix anything that sounds stiff in `src/locale/messages.nl.xlf` (Dutch) or in the source file (English), then run `npm run i18n` and `npm run i18n:check`.
- [ ] Every item in the TODO-FACT table of `AUDIT_REPORT.md` is filled in or removed.
- [ ] Nothing on the site claims something you can't prove (prices, reply times, competitions, "free" intro).
- [ ] `npm run verify` passes before every deploy.
