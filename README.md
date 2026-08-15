# VaultWatch

Track Fortnite skins and get flagged the moment they're expected back in the item shop.

Built with React, Vite, Tailwind CSS v4, and hand-built shadcn/ui-style components. Live shop and cosmetics data comes from [Fortnite-API.com](https://fortnite-api.com).

## ⚠️ Important: this is a static site

GitHub Pages only serves static files — it can't run a server. That means:

- **Accounts are per-browser, not real accounts.** Sign-up/sign-in is simulated with `localStorage` on each visitor's own device. Passwords are hashed (SHA-256 + salt) before being stored, but there's no shared database — an account made on one device won't exist on another, and there's no password reset flow.
- **"Notifications" are in-app only.** Nothing gets emailed, texted, or push-notified. Your watchlist just gets highlighted in the "My watchlist" tab when a watched skin appears in the live shop data.
- **The password rules match Google's account-creation bar**: 8+ characters, a mix of at least two character classes (letters/numbers/symbols), no leading/trailing spaces, and a check against common passwords — see `src/lib/password.js`.

If you want *real* accounts and *real* notifications (email/push), you'd need to add a backend — e.g., a serverless function (Cloudflare Workers, Vercel, Supabase, Firebase) handling auth and a cron job that polls the shop and sends emails. This project is set up so you can swap `src/lib/authStore.js` for real API calls later without touching the UI.

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys automatically on every push to `main`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` (or re-run the workflow from the **Actions** tab) — the site will build and publish automatically.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

No changes to `vite.config.js` are needed — it uses relative asset paths (`base: './'`) so it works at both `username.github.io` (user/org page) and `username.github.io/repo-name` (project page).

## Fortnite API key

The API key is currently hardcoded in `src/lib/fortniteApi.js`. Fortnite-API.com keys are meant to be used client-side like this (there's no secret billing risk), but if you get your own key, swap it in there.
