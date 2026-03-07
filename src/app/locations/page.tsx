import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
    title: "Locations | Yoramen",
    description: "Find store addresses, business hours, contact details, and directions to your nearest Yoramen location.",
};

export default function LocationsPage() {
    const address = "2024 Japanese Ramen St, Culinary District, CA 90210";

    return (
        <div className="pt-28 pb-24 min-h-screen bg-section-warm">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-16">
                    <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Visit</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-4">Locations</h1>
                    <div className="jp-divider mb-6"></div>
                    <p className="text-base text-stone max-w-xl mx-auto leading-relaxed">
                        Visit us in person and enjoy your bowl at its best, right out of the kitchen.
                    </p>
                </div>

                {/* Location Card */}
                <div className="flex flex-col lg:flex-row bg-warm-white rounded-2xl overflow-hidden border border-light-border mx-auto max-w-5xl shadow-sm">

                    {/* Info Side */}
                    <div className="w-full lg:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                        <div className="inline-block bg-brand-red/10 text-brand-red text-xs font-medium px-4 py-1.5 tracking-[0.15em] uppercase rounded-full mb-8 w-max">
                            Flagship Store
                        </div>

                        <h2 className="text-3xl md:text-4xl font-serif text-sumi mb-10">Downtown Flagship</h2>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-4 group">
                                <div className="mt-0.5 w-10 h-10 rounded-full bg-section-warm border border-light-border flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors">
                                    <MapPin className="text-brand-red" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-[0.15em] text-stone mb-1.5 font-medium">Address</h4>
                                    <span className="block text-sumi text-base">{address}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="mt-0.5 w-10 h-10 rounded-full bg-section-warm border border-light-border flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors">
                                    <Clock className="text-brand-red" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-[0.15em] text-stone mb-1.5 font-medium">Hours</h4>
                                    <span className="block text-sumi text-base">Mon-Sun: 11:30 AM - 10:00 PM</span>
                                    <p className="text-xs text-brand-red mt-1.5 italic">* Peak hours 12PM-1PM & 6PM-8PM may involve a wait.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="mt-0.5 w-10 h-10 rounded-full bg-section-warm border border-light-border flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors">
                                    <Phone className="text-brand-red" size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs uppercase tracking-[0.15em] text-stone mb-1.5 font-medium">Phone</h4>
                                    <span className="block text-sumi text-base">(555) 123-4567</span>
                                </div>
                            </div>
                        </div>

                        <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="w-full text-center bg-brand-red hover:bg-brand-red-hover text-white py-3.5 rounded-full text-sm uppercase tracking-[0.12em] font-medium transition-all hover-rise">
                            Get Directions
                        </a>
                    </div>

                    {/* Map Side */}
                    <div className="w-full lg:w-1/2 h-[350px] lg:h-auto relative bg-section-warm">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102005.10111100589!2d-118.2505508823528!3d34.0522345097894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA!5e0!3m2!1sen!2sus!4v1709793135111!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        ></iframe>
                    </div>

                </div>

            </div>
        </div>
    );
}
