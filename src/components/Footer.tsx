import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-section-warm pt-20 pb-10 border-t border-light-border">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <Image
                                src="/images/logo/logo-64.webp"
                                alt="Yoramen Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <span className="font-serif text-2xl font-semibold tracking-wider text-sumi">
                                YORAMEN
                            </span>
                        </Link>
                        <p className="text-stone text-sm leading-relaxed">
                            Our most important job is simple: make every bowl right, every day.
                        </p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 className="font-serif text-base mb-6 text-sumi font-semibold">Explore</h4>
                        <ul className="space-y-4 text-sm text-stone">
                            <li>
                                <Link href="/menu" className="hover:text-brand-red transition-colors">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-brand-red transition-colors">
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="hover:text-brand-red transition-colors">
                                    Gallery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Visit */}
                    <div>
                        <h4 className="font-serif text-base mb-6 text-sumi font-semibold">Visit Us</h4>
                        <ul className="space-y-4 text-sm text-stone">
                            <li>
                                <Link href="/locations" className="hover:text-brand-red transition-colors">
                                    Locations
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-brand-red transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/order" className="hover:text-brand-red transition-colors">
                                    Order Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-serif text-base mb-6 text-sumi font-semibold">Connect</h4>
                        <ul className="space-y-4 text-sm text-stone">
                            <li>
                                <a href="#" className="hover:text-brand-red transition-colors">
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-brand-red transition-colors">
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-brand-red transition-colors">
                                    Twitter
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Decorative Divider */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-light-border"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-red/30"></div>
                    <div className="flex-1 h-px bg-light-border"></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-stone">
                    <p>© {new Date().getFullYear()} Yoramen. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-sumi transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-sumi transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
