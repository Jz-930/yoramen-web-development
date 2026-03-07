import Link from "next/link";
import { Copy, MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
    title: "Locations | Yoramen",
    description: "Find store addresses, business hours, contact details, and directions to your nearest Yoramen location.",
};

export default function LocationsPage() {
    const address = "2024 Japanese Ramen St, Culinary District, CA 90210";

    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Locations</h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Visit us in person and enjoy your bowl at its best, right out of the kitchen.
                    </p>
                </div>

                {/* High-end Location Layout */}
                <div className="flex flex-col lg:flex-row bg-[#0E1721] rounded-3xl overflow-hidden border border-white/5 mx-auto max-w-6xl shadow-2xl">

                    {/* Info Side */}
                    <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                        <div className="inline-block bg-brand-red/10 border border-brand-red/30 px-4 py-1.5 rounded-full text-brand-red-light text-xs uppercase tracking-widest font-semibold mb-8 w-max">
                            Flagship Store
                        </div>

                        <h2 className="text-4xl md:text-5xl font-serif text-white mb-10">Downtown Flagship</h2>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-4 group">
                                <div className="mt-1 w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                                    <MapPin className="text-gold group-hover:text-brand-ink transition-colors duration-300" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-semibold">Address</h4>
                                    <span className="block text-gray-300 font-light text-lg leading-relaxed">{address}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="mt-1 w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                                    <Clock className="text-gold group-hover:text-brand-ink transition-colors duration-300" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-semibold">Hours</h4>
                                    <span className="block text-gray-300 font-light text-lg">Mon-Sun: 11:30 AM - 10:00 PM</span>
                                    <p className="text-sm text-brand-red-light mt-2 italic">* Peak hours 12PM-1PM & 6PM-8PM may involve a wait.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="mt-1 w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 group-hover:bg-gold transition-colors duration-300">
                                    <Phone className="text-gold group-hover:text-brand-ink transition-colors duration-300" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-semibold">Phone</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="block text-gray-300 font-light text-lg">(555) 123-4567</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="w-full text-center bg-brand-red hover:bg-brand-red-light text-white py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all hover-lift">
                            Get Directions
                        </a>
                    </div>

                    {/* Map Side */}
                    <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative bg-brand-ink">
                        {/* The filter makes the standard google map look dark and cinematic */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102005.10111100589!2d-118.2505508823528!3d34.0522345097894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1709793135111!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "grayscale(100%) invert(92%) contrast(83%) hue-rotate(180deg)" }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        ></iframe>
                        <div className="absolute inset-0 pointer-events-none border-l border-white/10 hidden lg:block"></div>
                    </div>

                </div>

            </div>
        </div>
    );
}
