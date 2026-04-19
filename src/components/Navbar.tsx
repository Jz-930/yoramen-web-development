"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Determine if the current page has a dark hero background initially
    // Currently, all pages (including Home) use light backgrounds naturally.
    const isDarkBackgroundPath = false; 
    
    // Switch logo dynamically
    const logoSrc = (isDarkBackgroundPath && !isScrolled) ? "/images/logo-full-w.webp" : "/images/logo-full.webp";

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
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
                    ? "frosted-nav py-3 shadow-sm"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src={logoSrc}
                            alt="Yoramen Logo"
                            width={140}
                            height={48}
                            className="object-contain w-auto h-9 md:h-10"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[13px] tracking-[0.12em] text-stone hover:text-sumi transition-colors duration-300 uppercase"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/order"
                            className="bg-brand-red hover:bg-brand-red-hover text-white px-6 py-2.5 rounded-full text-[13px] tracking-[0.12em] uppercase transition-all hover-rise"
                        >
                            Order Now
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-sumi"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-rice-paper/95 backdrop-blur-lg absolute top-full left-0 w-full h-screen flex flex-col pt-12 px-8 gap-7 items-center border-t border-light-border">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg tracking-[0.15em] text-sumi hover:text-brand-red transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="/order"
                        className="bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3 mt-4 rounded-full text-base tracking-[0.12em] uppercase transition-all"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Order Now
                    </Link>
                </div>
            )}
        </header>
    );
}
