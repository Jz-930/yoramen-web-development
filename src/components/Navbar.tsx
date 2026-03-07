"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Menu", href: "/menu" },
        { name: "Our Story", href: "/about" },
        { name: "Gallery", href: "/gallery" },
        { name: "Locations", href: "/locations" },
        { name: "Contact Us", href: "/contact" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "glassmorphism py-3" : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/logo-full-w.webp"
                            alt="Yoramen Logo"
                            width={160}
                            height={56}
                            className="object-contain w-auto h-10 md:h-12"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm uppercase tracking-widest hover:text-brand-red transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/order"
                            className="bg-brand-red hover:bg-brand-red-light text-white px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-all hover-lift"
                        >
                            Order Now
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-rice-paper"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden glassmorphism absolute top-full left-0 w-full h-screen flex flex-col pt-10 px-6 gap-6 items-center border-t border-white/5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xl font-serif tracking-widest hover:text-brand-red transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/order"
                        className="bg-brand-red hover:bg-brand-red-light text-white px-8 py-3 mt-4 rounded-full text-lg font-serif tracking-widest transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Order Now
                    </Link>
                </div>
            )}
        </header>
    );
}
