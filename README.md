# links.halliewho.com

The "start here" page for the Hallie Who and My Inner Mind ecosystem.

## Where to edit things

- **Prices, talks, booking links, books, the seasonal printable, App Store and YouTube links:** edit `site.config.mjs` in the `halliewho-site` repo. This page reads that file live, so both sites stay in sync. (The CDN can take up to 12 hours to show a change.)
- **Main site address:** at the top of the script in `index.html`, `SITE` points to `https://halliewho-site.vercel.app`. Change it to `https://halliewho.com` after the domain switch.
- **Podcast links (Spotify, Apple, Podbean):** the `PODCAST` block at the top of the script in `index.html`.

## Forms

- `api/subscribe.js` adds people to Mailchimp and tags them with the topics they picked. Needs `MAILCHIMP_API_KEY` and `MAILCHIMP_AUDIENCE_ID` in Vercel.
- `api/collab.js` emails collab messages to halliegracehm@gmail.com through Resend. Needs `RESEND_API_KEY` in Vercel.
