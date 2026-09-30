# Ιωάννα & Βασίλης — Πρόσκληση Γάμου

Greek wedding invitation site with a forest-green envelope open animation, countdown, family details, and maps for the church, prep addresses, and reception.

**Live URL (after DNS):** [https://gamos.almpertis.com](https://gamos.almpertis.com)

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

```bash
npm run build   # static export into /out
```

## Edit wedding details

All Greek copy and map links live in one file:

- [`src/content/wedding.ts`](src/content/wedding.ts)

Set `contactEmail` there so RSVP / wishes open the guest’s mail app to your address (still free — no backend).

Optional couple photo: drop `public/couple.jpg` in place (the page falls back to a rings placeholder).

## Free hosting — GitHub Pages + subdomain

Cost: **$0** (GitHub free + your existing domain).

### 1. Create / push the GitHub repo

Push this project to GitHub on the `main` branch.

### 2. Enable Pages (Actions)

1. Repo → **Settings** → **Pages**
2. **Source:** GitHub Actions
3. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually)

Until a custom domain is set, the site is available at:

`https://YOUR_GITHUB_USER.github.io/YOUR_REPO_NAME/`

> If you use that `github.io/REPO` URL (no custom domain), set a `basePath` in `next.config.ts` to `/YOUR_REPO_NAME` and rebuild. With **gamos.almpertis.com** you do **not** need a basePath.

### 3. DNS for `gamos.almpertis.com`

At the DNS provider for **almpertis.com**, add:

| Type  | Name  | Value                     |
| ----- | ----- | ------------------------- |
| CNAME | gamos | `YOUR_GITHUB_USER.github.io` |

### 4. Custom domain in GitHub

1. Repo → **Settings** → **Pages** → **Custom domain** → `gamos.almpertis.com`
2. Wait for DNS check
3. Enable **Enforce HTTPS**

Guests then open: **https://gamos.almpertis.com**

## Stack

- Next.js (static export) · TypeScript · Tailwind CSS · Framer Motion
- Google Fonts: Cormorant Garamond (Greek)
- Maps: Google Maps embed iframes (no API key)
