import EnglishOrderInterceptModal from "../../(.)order/page";
import { requireTargetLocale, type LocaleRouteProps } from "@/app/_localeRoute";

export const dynamic = "force-dynamic";

export default async function LocalizedOrderInterceptModal({ params }: LocaleRouteProps) {
  await requireTargetLocale(params);
  return <EnglishOrderInterceptModal />;
}
