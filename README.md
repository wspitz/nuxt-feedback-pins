# 📌 nuxt-feedback-pins

Visual feedback pins for Nuxt prototypes — let clients comment directly on the page, Figma-style.

Built by [POINTED. Digital Services](https://pointed.at) for streamlined prototype reviews.

## Features

- **Pin comments** at exact XY positions on any page
- **Threaded replies** on each pin
- **Per-route storage** in JSON files — no database needed
- **Simple auth** with a shared password
- **Resolve/unresolve** pins when feedback is addressed
- **Zero config UI** — just install and set a password
- **Scoped CSS** — won't interfere with your prototype styles
- **Responsive pins** — positions stored as percentages

## Quick Start

```bash
# yarn
yarn add nuxt-feedback-pins

# npm
npm install nuxt-feedback-pins

# pnpm
pnpm add nuxt-feedback-pins
```

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-feedback-pins'],

  feedbackPins: {
    password: 'your-secret-password',
  },
})
```

That's it! The feedback button automatically appears in the bottom-right
corner of every page — no changes to your `app.vue` or layouts needed.

## Configuration

```ts
export default defineNuxtConfig({
  feedbackPins: {
    // Required: shared password for client access
    password: 'your-secret-password',

    // Where to store feedback JSON files (default: ./feedback-data)
    storagePath: './feedback-data',

    // Enable/disable the module (default: true)
    enabled: true,

    // Accent color for pins and UI (default: #FF6B35)
    accentColor: '#FF6B35',

    // Default author name (default: Gast)
    defaultAuthor: 'Gast',

    // Max pins per page (default: 50)
    maxPinsPerPage: 50,

    // Session cookie name (default: fp-session)
    cookieName: 'fp-session',

    // Session duration in hours (default: 24)
    sessionDuration: 24,
  },
})
```

## How It Works

1. Client opens the prototype and clicks the 💬 button
2. Enters the shared password → session is set
3. Clicks anywhere on the page to place a pin
4. Writes a comment → pin appears at that position
5. Others can click pins to reply (threads)
6. Pins can be marked as resolved ✓

### Storage

Comments are stored as JSON files in `./feedback-data/` (configurable), one file per route:

```
feedback-data/
├── _index.json          # / (homepage)
├── about.json           # /about
└── about--team.json     # /about/team
```

These files are human-readable and can be committed to Git for reference.

### Removing for Production

Simply remove the module from `nuxt.config.ts` before deploying to production:

```ts
export default defineNuxtConfig({
  modules: [
    // 'nuxt-feedback-pins',  ← comment out or remove
  ],
})
```

Or use the `enabled` flag:

```ts
feedbackPins: {
  enabled: process.env.NODE_ENV !== 'production',
}
```

## API Endpoints

The module registers these server routes:

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/feedback/auth` | Check session status |
| `POST` | `/api/feedback/auth` | Login with password |
| `GET` | `/api/feedback?route=/path` | Get pins for a route |
| `POST` | `/api/feedback` | Create a new pin |
| `PATCH` | `/api/feedback` | Reply, resolve, unresolve, or delete a pin |

## Development

```bash
# Install dependencies
yarn install

# Prepare the module
yarn dev:prepare

# Start playground
yarn dev

# Build the module
yarn build
```

## Security notes & limitations

**`nuxt-feedback-pins` is designed for prototype reviews, not for
public-facing production sites.** Please keep the following in mind:

- **Auth is shared-password only.** Use a strong password and put the
  prototype behind additional protection (HTTP basic auth, VPN, access
  list, staging-only deployment). Do not expose it on a public URL.
- **Sessions are kept in memory** on the Nuxt/Nitro server. A server
  restart logs everyone out. In multi-instance setups you need sticky
  sessions (or don't use this module).
- **Storage is a flat-file JSON directory** on the server's filesystem.
  That means it only works in environments where the server process can
  write to disk (local dev, self-hosted Node, Docker with a volume).
  Serverless platforms like Vercel or Netlify won't persist the files.
- Login attempts are rate-limited (10 / minute / IP) and the password is
  compared in constant time, but there is no account lockout, no audit
  log, and no encryption-at-rest for the stored comments. Treat the
  comment files as you would any source-controlled prototype asset.
- Comments are rendered through Vue's text interpolation, which escapes
  HTML by default. Do not add custom `v-html` usage in forked components.

If any of those constraints don't fit your use case, this probably isn't
the right tool — consider a hosted option instead.

## License

MIT — [POINTED. Digital Services GmbH](https://pointed.at)
