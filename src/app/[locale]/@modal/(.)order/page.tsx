import EnglishOrderInterceptModal from "@/views/order-modal";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";

export default async function LocalizedOrderInterceptModal({ params }: LocaleRouteProps) {
  const locale = await requireTargetLocale(params);
  return <EnglishOrderInterceptModal locale={locale} />;
}
