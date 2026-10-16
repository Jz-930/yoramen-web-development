"use client";

import { useRef, useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export type ContactContentProps = {
  content: {
    header: {
      eyebrow: string;
      title: string;
      description: string;
    };
    infoCard: {
      title: string;
      description: string;
      generalLabel: string;
      partnershipsLabel: string;
      generalEmail: string;
      partnershipsEmail: string;
    };
    form: {
      nameLabel: string;
      namePlaceholder: string;
      phoneLabel: string;
      phonePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      buttonLabel: string;
      submittingLabel: string;
      successMessage: string;
      errorMessage: string;
      reservationNote: string;
    };
  };
};

export default function ContactContent({ content }: ContactContentProps) {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const submissionInFlight = useRef(false);
  const lastSubmission = useRef<{ payloadKey: string; submissionId: string } | null>(null);
  const formLocked = formStatus === "submitting" || formStatus === "success";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionInFlight.current || formStatus === "success") return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
      website: String(formData.get("website") ?? ""),
    };
    const payloadKey = JSON.stringify(payload);

    submissionInFlight.current = true;
    setFormStatus("submitting");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    try {
      if (lastSubmission.current?.payloadKey !== payloadKey) {
        lastSubmission.current = { payloadKey, submissionId: crypto.randomUUID() };
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, submissionId: lastSubmission.current.submissionId }),
        signal: controller.signal,
      });
      const result: unknown = await response.json();
      if (!response.ok || typeof result !== "object" || result === null || !("ok" in result) || result.ok !== true) {
        throw new Error("Contact submission was not confirmed");
      }

      setFormStatus("success");
    } catch {
      setFormStatus("error");
    } finally {
      clearTimeout(timeout);
      submissionInFlight.current = false;
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-rice-paper">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">{content.header.eyebrow}</span>
          <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-4">{content.header.title}</h1>
          <div className="jp-divider mb-6"></div>
          <p className="text-base text-stone leading-relaxed">
            {content.header.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
          <div className="bg-warm-white rounded-2xl p-10 md:p-12 border border-light-border">
            <h2 className="text-2xl font-serif text-sumi mb-6">{content.infoCard.title}</h2>
            <p className="text-stone text-sm mb-10 leading-relaxed">
              {content.infoCard.description}
            </p>

            <div className="space-y-8">
              <div className="flex flex-col gap-2">
                <span className="text-brand-red uppercase tracking-[0.15em] text-xs font-medium">{content.infoCard.generalLabel}</span>
                <a href={`mailto:${content.infoCard.generalEmail}`} className="text-lg text-sumi hover:text-brand-red flex items-center gap-3 transition-colors">
                  <Mail size={18} className="text-stone" />
                  {content.infoCard.generalEmail}
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-brand-red uppercase tracking-[0.15em] text-xs font-medium">{content.infoCard.partnershipsLabel}</span>
                <a href={`mailto:${content.infoCard.partnershipsEmail}`} className="text-lg text-sumi hover:text-brand-red flex items-center gap-3 transition-colors">
                  <MessageSquare size={18} className="text-stone" />
                  {content.infoCard.partnershipsEmail}
                </a>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} aria-busy={formStatus === "submitting"} className="space-y-5">
              <fieldset disabled={formLocked} className="space-y-5">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.nameLabel}</label>
                    <input required id="name" name="name" type="text" maxLength={100} autoComplete="name" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder={content.form.namePlaceholder} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.phoneLabel}</label>
                    <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder={content.form.phonePlaceholder} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.emailLabel}</label>
                  <input required id="email" name="email" type="email" maxLength={254} autoComplete="email" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder={content.form.emailPlaceholder} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.messageLabel}</label>
                  <textarea required id="message" name="message" rows={5} maxLength={5000} className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors resize-none placeholder:text-stone/40" placeholder={content.form.messagePlaceholder}></textarea>
                </div>

                <p className="text-xs text-stone leading-relaxed">{content.form.reservationNote}</p>

                <button
                  type="submit"
                  disabled={formLocked}
                  className="w-full bg-brand-red hover:bg-brand-red-hover disabled:bg-stone/30 disabled:cursor-not-allowed text-white py-4 rounded-full text-sm uppercase tracking-[0.12em] font-medium transition-all mt-2"
                >
                  {formStatus === "submitting" ? content.form.submittingLabel : content.form.buttonLabel}
                </button>
              </fieldset>

              {formStatus === "success" && (
                <div role="status" className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
                  {content.form.successMessage}
                </div>
              )}
              {formStatus === "error" && (
                <div role="alert" className="p-4 bg-warm-white border border-brand-red/30 rounded-xl text-sumi text-sm text-center">
                  {content.form.errorMessage}{" "}
                  <a href={`mailto:${content.infoCard.generalEmail}`} className="text-brand-red underline underline-offset-2">
                    {content.infoCard.generalEmail}
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
