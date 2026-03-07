import Link from "next/link";
import { Clock } from "lucide-react";

export const metadata = {
    title: "Order Now | Yoramen",
    description: "Online ordering coming soon.",
};

export default function OrderPage() {
    return (
        <div className="pt-28 pb-24 min-h-screen bg-rice-paper flex items-center justify-center">
            <div className="max-w-xl mx-auto px-6 lg:px-8 w-full">

                <div className="bg-warm-white rounded-2xl p-10 md:p-16 border border-light-border text-center">

                    <div className="w-16 h-16 rounded-full bg-section-warm border border-light-border flex items-center justify-center mx-auto mb-8">
                        <Clock size={28} className="text-brand-red" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-serif text-sumi mb-4">Online Ordering</h1>
                    <p className="text-lg text-brand-red italic font-serif mb-4">Coming Soon</p>
                    <div className="jp-divider mb-8"></div>

                    <p className="text-stone text-sm mb-10 max-w-sm mx-auto leading-relaxed">
                        We are currently integrating with our POS provider to bring you a seamless online ordering experience. In the meantime, please visit us in-store.
                    </p>

                    <Link href="/menu" className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3.5 rounded-full text-sm uppercase tracking-[0.12em] font-medium transition-all hover-rise">
                        Explore Our Menu
                    </Link>
                </div>

            </div>
        </div>
    );
}
