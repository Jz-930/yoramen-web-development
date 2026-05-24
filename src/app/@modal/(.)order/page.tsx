import OrderModal from "@/components/OrderModal";
import { fetchOrderPage } from "@/sanity/fetchers";

export const dynamic = "force-dynamic";

export default async function OrderInterceptModal() {
    const order = await fetchOrderPage();
    return <OrderModal order={order} />;
}
