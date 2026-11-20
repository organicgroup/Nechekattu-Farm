# Nechekattu Farm — complete website

A complete, responsive static website in HTML5, CSS3 and vanilla JavaScript. All fonts, photographs, compiled Tailwind CSS, GSAP and ScrollTrigger files are included locally. No frontend framework, account, API key or build step is required to view it.

## Open the website

1. Extract this ZIP first.
2. Open `index.html` in Chrome, Edge, Firefox or Safari.
3. Keep the `assets` folder and the other HTML pages beside `index.html`.

Optional: from the extracted folder, run `python3 -m http.server 8080`, then visit `http://localhost:8080`. On Windows, use `python` instead of `python3` if that is your installed command. A local server is useful for development, but not required for browsing the supplied files.

## Included pages

| Page | File |
|---|---|
| Home | `index.html` |
| Our Farm / About | `about.html` |
| Coffee | `coffee.html` |
| Spices | `spices.html` |
| Sustainability & Biodiversity | `sustainability.html` |
| Farm Experiences | `experiences.html` |
| Visit Us / Enquiry | `contact.html` |
| Privacy notice | `privacy.html` |
| Visitor terms | `terms.html` |
| Photography credits | `credits.html` |

## Add official contact details

Edit `assets/js/config.js` with any text editor. Fill the empty strings with **confirmed** details:

- `email`: official visitor-enquiry email.
- `phone`: official phone, with country code.
- `whatsappNumber`: WhatsApp number with country code, digits only.
- `instagramUrl` and `facebookUrl`: official HTTPS profile URLs.
- `websiteUrl`: final HTTPS site origin; optional.
- `mapsUrl`: replace the town-level map with a confirmed farm pin when available.

The map anchors currently point to Vandiperiyar as an area, not to a fabricated farm location. The map configuration updates links in the browser. Replace the matching Google Maps links in the HTML pages as well if you want the new destination available without JavaScript. Phone, email, WhatsApp and social links are activated from the config file. No personal contact details have been invented.

## How the enquiry form works

The form validates required fields, email, phone number, date, visitor count and consent. It builds a readable visit enquiry and opens a preview.

- **Copy Enquiry** copies the message. If a browser blocks clipboard access, **Download .txt** remains available.
- **Download .txt** creates a local text file.
- Once a valid official email is configured, **Email Enquiry** opens the visitor's email client with a prepared draft.
- Once a valid WhatsApp number is configured, **Open WhatsApp** opens a prepared message to that number.

There is no backend and no automatic delivery. The visitor must send the draft in the selected service. No enquiry is called a confirmed booking. With empty contact details, the visitor is told honestly that the message has not been sent and can be copied or downloaded. The website does not retain enquiry data in browser storage.

For automatic delivery or a booking database, connect your own form service/backend and update the privacy notice to reflect the final setup.

## Design and interactions

- Forest green, warm ivory, cream and muted gold palette.
- Locally bundled Manrope and Playfair Display fonts.
- Responsive desktop navigation and keyboard-accessible mobile menu.
- GSAP hero and scroll reveals, with reduced-motion support.
- Six-stage coffee timeline with tab, keyboard and next/previous controls.
- Photo lightbox with previous/next, keyboard navigation and Escape.
- Fourteen-bird regional gallery, with habitat filters.
- Expandable visitor FAQ, smooth anchor scrolling and back-to-top control.
- Form validation, enquiry preview, local copy/download and configurable email/WhatsApp.
- Semantic HTML, page descriptions, Open Graph metadata, alt text and lazy-loaded images.

## Edit the content and styles

Each HTML page contains its complete content and shared header/footer markup, so links work directly from a local folder. When changing shared navigation or footer text, apply that edit across the HTML files.

- Main layout, responsive rules and palette: `assets/css/style.css`.
- Fonts: `assets/css/fonts.css` and `assets/fonts/`.
- Interactions, timeline copy and form logic: `assets/js/main.js`.
- Contacts and profile links: `assets/js/config.js`.
- Photographs: `assets/images/`.

Tailwind CSS is already compiled. If you add new Tailwind utility classes, run `npm install` followed by `npm run build:css` from this folder. Tailwind 3.4.17 is pinned in `package.json`; no npm installation is needed merely to view or upload the site.

## Upload to your hosting

Upload the contents of this folder to the static web root on your hosting (for example, `public_html` on a typical cPanel setup), keeping paths unchanged. Start with `index.html`. HTTPS hosting is recommended.

Before accepting enquiries, add official contacts and arrival directions, confirm operational details with the farm owner, and replace illustrative photos with original farm photography when available. The supplied leaf-and-coffee mark is a new typographic brand treatment, not an owner-provided official logo.

For production SEO, set the real absolute canonical URLs and `og:image` URLs directly in each page's `<head>` once the domain is known. `websiteUrl` also updates these in browsers, but crawlers that do not execute JavaScript need the static tags. Add your real sitemap after the domain is confirmed. No invented domain, coordinates, fees, opening hours, certifications or production volumes are included.

## Photography and licences

Owner-supplied photographs now document Nechekattu Farm's landscape, coffee, people and visitor experiences, and are identified as farm originals on the site. Wildlife and some crop or regional reference images remain illustrative; they do not prove farm-specific wildlife sightings or identify coffee varieties. The entire regional bird list is included with cautious wording. The approximate 2-hectare grassland and November–January indicative harvest window come from the supplied farm brief.

See `IMAGE_CREDITS.md`, `IMAGE_CREDITS.json` and `credits.html` for each source, author, licence and change notice. Creative Commons share-alike terms continue to apply to adapted images where indicated. Preserve those credits when retaining the supplied imagery.

See `THIRD_PARTY_NOTICES.md` for software and font licence links.

## Content sources

Farm-specific copy and crop lists: the user-supplied website brief.

Regional geography was checked against these primary sources on 19 November 2026:

- Kerala Tourism — Vandiperiyar: https://www.keralatourism.org/destination/vandiperiyar-idukki/436/
- UPASI Tea Research Foundation — Vandiperiyar: https://www.upasitearesearch.org/vandiperiyar/
- Idukki District administration — Thekkady / Periyar: https://idukki.gov.in/tourist-place/periyar-tiger-reserve-thekkady/

Farm-specific wildlife occurrence, visitor availability and exact entrance directions must be confirmed by the owner. No wildlife sighting or activity is guaranteed.
