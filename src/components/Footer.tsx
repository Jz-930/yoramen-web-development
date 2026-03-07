import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-[#05090C] pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <Image
                                src="/images/logo/logo-64.webp"
                                alt="Yoramen Logo"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                            <span className="font-serif text-3xl font-bold tracking-wider text-rice-paper">
                                YORAMEN
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Our most important job is simple: make every bowl right, every day.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg mb-6 text-gold">Explore</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
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

                    <div>
                        <h4 className="font-serif text-lg mb-6 text-gold">Visit Us</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
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

                    <div>
                        <h4 className="font-serif text-lg mb-6 text-gold">Connect</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
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

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Yoramen. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
