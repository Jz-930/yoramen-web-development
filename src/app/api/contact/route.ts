import { handleContactSubmission } from "@/lib/contact-email";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleContactSubmission(request);
}
