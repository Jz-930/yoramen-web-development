"use client";

import { useState } from "react";
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
    };
  };
};

export default function ContactContent({ content }: ContactContentProps) {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
    }, 1500);
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.nameLabel}</label>
                  <input required id="name" type="text" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder={content.form.namePlaceholder} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.phoneLabel}</label>
                  <input id="phone" type="tel" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder={content.form.phonePlaceholder} />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.emailLabel}</label>
                <input required id="email" type="email" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder={content.form.emailPlaceholder} />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">{content.form.messageLabel}</label>
                <textarea required id="message" rows={5} className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors resize-none placeholder:text-stone/40" placeholder={content.form.messagePlaceholder}></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus !== "idle"}
                className="w-full bg-brand-red hover:bg-brand-red-hover disabled:bg-stone/30 disabled:cursor-not-allowed text-white py-4 rounded-full text-sm uppercase tracking-[0.12em] font-medium transition-all mt-2"
              >
                {formStatus === "submitting" ? content.form.submittingLabel : content.form.buttonLabel}
              </button>

              {formStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
                  {content.form.successMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
