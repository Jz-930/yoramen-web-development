"use client";

import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("submitting");
        // Simulate API call
        setTimeout(() => {
            setFormStatus("success");
        }, 1500);
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-brand-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Contact Us</h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        Partnerships, feedback, and suggestions are all welcome. We read every message carefully.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto items-start">

                    {/* Contact Info Side */}
                    <div className="bg-[#0E1721] rounded-3xl p-10 md:p-12 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                        <h2 className="text-3xl font-serif text-white mb-8">Get in Touch</h2>
                        <p className="text-gray-400 font-light mb-12 leading-relaxed">
                            Whether you want to share your dining experience, inquire about catering, or just say hello, drop us a line.
                        </p>

                        <div className="space-y-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-gold uppercase tracking-widest text-xs font-semibold">General Inquiries</span>
                                <a href="mailto:hello@yoramen.com" className="text-xl text-white hover:text-brand-red flex items-center gap-3 transition-colors">
                                    <Mail size={20} className="text-gray-500" />
                                    hello@yoramen.com
                                </a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-gold uppercase tracking-widest text-xs font-semibold">Partnerships & PR</span>
                                <a href="mailto:press@yoramen.com" className="text-xl text-white hover:text-brand-red flex items-center gap-3 transition-colors">
                                    <MessageSquare size={20} className="text-gray-500" />
                                    press@yoramen.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-brand-ink">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Name</label>
                                    <input required id="name" type="text" className="w-full bg-[#0E1721] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="Your name" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Phone</label>
                                    <input id="phone" type="tel" className="w-full bg-[#0E1721] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="(optional)" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Email</label>
                                <input required id="email" type="email" className="w-full bg-[#0E1721] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-gold transition-colors" placeholder="you@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-400 font-semibold block">Message</label>
                                <textarea required id="message" rows={5} className="w-full bg-[#0E1721] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-gold transition-colors resize-none" placeholder="What's on your mind?"></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus !== "idle"}
                                className="w-full bg-brand-red hover:bg-brand-red-light disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-5 rounded-full text-sm uppercase tracking-widest font-semibold transition-all mt-4"
                            >
                                {formStatus === "submitting" ? "Sending..." : "Send Message"}
                            </button>

                            {formStatus === "success" && (
                                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center">
                                    Message sent successfully. We will get back to you soon.
                                </div>
                            )}
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
