This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Public-page caching and CPU usage

All 28 public routes (English, French, Traditional Chinese, and Japanese) are prerendered. Their root layouts use `dynamic="error"` and `revalidate=false`; published Sanity data has a shared permanent cache tag. Ordinary visits reuse static HTML without rendering or querying Sanity. After the last publication has been quiet for ten minutes, a durable job invalidates the tag and root layout; the next request regenerates once and subsequent requests reuse that result. Redeployments and platform cache eviction can also cause regeneration.

The only timed refreshes correspond to an explicitly configured promotion start/end or a translation grace-period deadline. Once a deadline passes, it is no longer scheduled. There is no recurring ten-minute refresh. CMS fetch errors fail regeneration instead of permanently caching fallback content. Localized fallback redirects are also static. A lightweight locale proxy canonicalizes uppercase paths and preserves query parameters through fallback redirects; it does not load CMS data. Studio, contact submissions, and the authenticated webhook remain dynamic.

### Sanity publication webhook

Manage **Yoramen Website CMS**, project `08xf72v9`, dataset `production`, under the **Jz-930** organization. Sign in to Sanity using **Continue with GitHub**, account **Jz-930**. The Google login with the same email is a different Sanity identity and does not have this project's permissions.

`Refresh published Yoramen pages` sends POST requests to `https://www.yoramen.ca/api/revalidate`. The same random `SANITY_REVALIDATE_SECRET` must be set in Vercel Production and the webhook's Secret field; never expose it via a `NEXT_PUBLIC_` variable or commit it. The handler verifies Sanity's HMAC, project, dataset, document type, and operation before clearing caches. It responds with HTTP 202 only after persisting the event. A single Vercel Workflow actor waits for ten full minutes after the newest event; additional publications extend the deadline, while retries of the same signed revision do not. Old timers re-check the newest deadline before doing anything. The actor uses durable sleep and remains suspended while idle: no polling cron, long-lived HTTP request, or in-memory timeout. A signed callback to `/api/revalidate/commit` performs the actual invalidation after the quiet window. Draft and release-version changes are excluded. Create, update, delete, and unpublish are covered. Changes to revision metadata alone do not refresh the site.

Filter:
```groq
_type in ["siteSettings","homePage","aboutPage","galleryPage","contactPage","menuPage","orderPage","menuCategory","menuItem","promotion","location","localizationConfig","translationBundle"] && !(_id in path("drafts.**")) && !(_id in path("versions.**")) && (delta::operation() != "update" || !delta::changedOnly((_rev, _updatedAt)))
```

Projection:
```groq
{_id, _type, _rev, _updatedAt, "projectId": sanity::projectId(), "dataset": sanity::dataset(), "operation": delta::operation()}
```

Keep webhook drafts and versions disabled. If publication does not appear, inspect Sanity webhook delivery attempts before clearing caches or redeploying. The automatic cache update depends on successful delivery; there is deliberately no polling fallback.

Next 16.1.6 has an upstream duplicate `Location` header bug on the first regenerated redirect ([#82117](https://github.com/vercel/next.js/issues/82117)). `postinstall` applies a narrow, version-checked template fix. Review and remove it when upgrading to a version with the upstream fix. `scripts/check-publication-refresh.mjs` sends two signed test publications 45 seconds apart, verifies no invalidation at the first deadline, then checks all 28 paths after the second deadline (about eleven minutes total); run with `CHECK_BASE_URL` and the local secret loaded via `node --env-file=.env.local`. This test invalidates caches but does not edit CMS content.

After building, run `node scripts/check-public-cache.mjs`. It expects all 28 routes to have no timed expiry (the current content has no future deadline); if editors schedule a future event, inspect the corresponding finite expiry against that deadline. Set `CHECK_BASE_URL` to a local production server to additionally check page responses, locale redirects, robots, unknown paths, invalid contact requests, and unsigned webhook rejection. Run `node --test scripts/test-published-content-webhook.mjs scripts/test-content-transitions.mjs scripts/test-contact-email.mjs` for handler and deadline regression checks. These checks send no email. `node --test scripts/test-publication-debounce.mjs` also covers timer resets, duplicate and out-of-order deliveries, arrivals during a commit, and early/forged callback rejection. The local-only `PUBLICATION_TEST_QUIET_MS` can shorten integration tests; Vercel deployments always use 600,000 ms. Keep System Environment Variables enabled in Vercel so the SDK uses managed durable storage, and inspect the project Workflows page if delivery is queued but not applied.

## Contact form email delivery

The contact form posts to `/api/contact`. The website is configured to send only to **info@yoramen.ca**, with the customer's email as `Reply-To`. The browser cannot choose the recipient. The server supports a comma-separated `CONTACT_TO_EMAILS` list, but production should contain this single address to conserve the email quota. A successful form submission is a message/reservation request, not a confirmed reservation.

### Setup

1. Create a free [Resend account](https://resend.com) and [verify a sending subdomain](https://resend.com/docs/dashboard/domains/introduction), such as `notifications.yoramen.ca`, using the DNS records Resend provides. Keep the existing inbound mailbox DNS records intact. No additional mailbox purchase is required for the sender address.
2. Create a Resend API key with Sending Access. Copy `.env.example` to `.env.local` if a local file does not already exist. Set `RESEND_API_KEY`, a bare verified `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAILS=info@yoramen.ca`. Never commit `.env.local` or put these values in public client environment variables.
3. Set the same three variables in the Vercel project's Production environment and deploy the change. Restart the local dev server after local configuration changes. Preview environments should use test recipients or leave sending unconfigured.
4. Submit an explicitly identified test request after configuration and check the **info@yoramen.ca inbox**, its spam folder, and Resend delivery status before treating the feature as live. API acceptance does not guarantee inbox delivery.

At the time of implementation, [Resend Free](https://resend.com/pricing) includes 3,000 emails/month and 100/day. [Each recipient counts separately](https://resend.com/docs/knowledge-base/account-quotas-and-limits): with one recipient, that is up to 3,000 submissions/month and 100/day, assuming no other email usage. No paid plan or extra database is required for this implementation.

Unconfigured delivery, exhausted provider quota, provider errors, and network failures show a retry/email fallback instead of success; entered text stays in the form. Unchanged retries reuse a provider idempotency key for 24 hours to avoid duplicate mail. There is no separate message database or automatic background retry. Resend's dashboard and the destination mailboxes provide delivery visibility. The endpoint includes input/body limits, a honeypot and same-origin browser checks; these are basic spam defenses, not a distributed rate limiter.

### Local checks

```bash
node --test scripts/test-contact-email.mjs
npm run lint
npm run build
```

The email tests mock the provider; they never send real mail. They require Node 22.18+ or Node 24 for native TypeScript support. On this Windows workspace, use PowerShell 7 for dependency lifecycle scripts if the parent path's `&` interferes with npm's default shell: `npm ci --script-shell=pwsh.exe`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
