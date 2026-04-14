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

    // Local dev: directory for JSON files (default: ./feedback-data)
    storagePath: './feedback-data',

    // Optional: override the storage driver (see "Storage" section below)
    // storage: { driver: 'vercelKV' },

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

Under the hood, the module uses [Nitro's unstorage](https://unstorage.unjs.io/)
to persist pins. The storage layer is pluggable — out of the box it writes JSON
files to `./feedback-data/`, but you can swap in any unstorage driver (Vercel
KV, Upstash Redis, Cloudflare KV, S3, …) for serverless hosts.

#### Local development (default)

Nothing to configure. Pins land in `./feedback-data/` as JSON files, one per
route:

```
feedback-data/
├── _index.json          # / (homepage)
├── about.json           # /about
└── about--team.json     # /about/team
```

These files are human-readable and can be committed to Git for reference.

#### Deploying to Vercel (Vercel KV)

Serverless filesystems are ephemeral — you **must** switch to a persistent
backend. The easiest option on Vercel is **Vercel KV** (Redis under the hood):

1. **Create a KV database** in your Vercel project:
   Dashboard → Storage → Create Database → KV → link it to your project.
   Vercel automatically injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   environment variables into your deployment.

2. **Point the module at it** in `nuxt.config.ts`:

   ```ts
   export default defineNuxtConfig({
     modules: ['nuxt-feedback-pins'],
     feedbackPins: {
       password: process.env.FEEDBACK_PASSWORD,
       storage: { driver: 'vercelKV' },
     },
   })
   ```

3. Deploy. Pins now persist in Vercel KV and survive cold starts.

#### Deploying anywhere else (Upstash Redis)

For Netlify, Cloudflare, self-hosted Node, or anything else, **Upstash Redis**
is the universal choice — free tier, two env vars, works everywhere:

1. Sign up at [upstash.com](https://upstash.com/), create a Redis database,
   and copy `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` into your
   host's environment variables.

2. Configure the module:

   ```ts
   feedbackPins: {
     password: process.env.FEEDBACK_PASSWORD,
     storage: {
       driver: 'upstash',
       url: process.env.UPSTASH_REDIS_REST_URL,
       token: process.env.UPSTASH_REDIS_REST_TOKEN,
     },
   }
   ```

Any other [unstorage driver](https://unstorage.unjs.io/drivers) works the same
way — just pass its config under `storage`.

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
- **Storage is pluggable via Nitro unstorage.** The default driver writes
  JSON files to disk — fine for local dev, self-hosted Node, or Docker
  with a volume. For serverless platforms (Vercel, Netlify, Cloudflare)
  you must configure a cloud driver (e.g. Vercel KV, Upstash Redis). See
  the *Storage* section above.
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
