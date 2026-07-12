import { Sparkles } from "lucide-react";

type SpecialOffersEmptyStateProps = {
  kicker: string;
  title: string;
  description: string;
};

export default function SpecialOffersEmptyState({
  kicker,
  title,
  description,
}: SpecialOffersEmptyStateProps) {
  return (
    <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-stone/10 bg-white/85 px-6 py-16 text-center shadow-[0_24px_70px_-50px_rgba(30,24,20,0.45)] backdrop-blur-sm md:px-12 md:py-20">
        <div
          aria-hidden="true"
          className="absolute -right-14 -top-20 h-52 w-52 rounded-full border-[26px] border-brand-red/[0.035]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full border border-sumi/[0.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-red/35 to-transparent"
        />

        <div className="relative mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em] text-brand-red">
            <span className="h-px w-8 bg-brand-red/35" />
            <Sparkles size={15} strokeWidth={1.6} aria-hidden="true" />
            <span>{kicker}</span>
            <span className="h-px w-8 bg-brand-red/35" />
          </div>

          <h3 className="font-serif text-4xl leading-tight text-sumi md:text-5xl">
            {title}
          </h3>

          <div className="my-7 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-14 bg-stone/20" />
            <span className="h-2.5 w-2.5 rotate-45 border border-brand-red/70" />
            <span className="h-px w-14 bg-stone/20" />
          </div>

          <p className="mx-auto max-w-xl text-sm leading-7 text-stone md:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
