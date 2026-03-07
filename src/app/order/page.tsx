import Link from "next/link";
import { Hammer } from "lucide-react";

export const metadata = {
    title: "Order Now | Yoramen",
    description: "Online ordering coming soon.",
};

export default function OrderPage() {
    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-ink flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

                <div className="bg-[#0E1721] rounded-3xl p-10 md:p-16 border border-white/5 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-red/10 transition-colors duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-gold/10 transition-colors duration-700"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                            <Hammer size={32} className="text-gold" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">Online Ordering</h1>
                        <p className="text-2xl text-gold italic font-serif mb-6">Coming Soon</p>

                        <p className="text-gray-400 font-light mb-12 max-w-md mx-auto leading-relaxed">
                            We are currently integrating with our POS provider to bring you a seamless online ordering experience. In the meantime, please visit us in-store.
                        </p>

                        <Link href="/menu" className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all hover-lift">
                            Explore Our Menu
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
