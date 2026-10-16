This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
