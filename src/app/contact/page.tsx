"use client";

import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("submitting");
        setTimeout(() => {
            setFormStatus("success");
        }, 1500);
    };

    return (
        <div className="pt-28 pb-24 min-h-screen bg-rice-paper">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Page Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <span className="text-brand-red text-xs tracking-[0.25em] uppercase font-medium block mb-4">Reach Out</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-sumi mb-4">Contact Us</h1>
                    <div className="jp-divider mb-6"></div>
                    <p className="text-base text-stone leading-relaxed">
                        Partnerships, feedback, and suggestions are all welcome. We read every message carefully.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">

                    {/* Contact Info Side */}
                    <div className="bg-warm-white rounded-2xl p-10 md:p-12 border border-light-border">
                        <h2 className="text-2xl font-serif text-sumi mb-6">Get in Touch</h2>
                        <p className="text-stone text-sm mb-10 leading-relaxed">
                            Whether you want to share your dining experience, inquire about catering, or just say hello, drop us a line.
                        </p>

                        <div className="space-y-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-brand-red uppercase tracking-[0.15em] text-xs font-medium">General Inquiries</span>
                                <a href="mailto:hello@yoramen.com" className="text-lg text-sumi hover:text-brand-red flex items-center gap-3 transition-colors">
                                    <Mail size={18} className="text-stone" />
                                    hello@yoramen.com
                                </a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-brand-red uppercase tracking-[0.15em] text-xs font-medium">Partnerships & PR</span>
                                <a href="mailto:press@yoramen.com" className="text-lg text-sumi hover:text-brand-red flex items-center gap-3 transition-colors">
                                    <MessageSquare size={18} className="text-stone" />
                                    press@yoramen.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">Name</label>
                                    <input required id="name" type="text" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder="Your name" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">Phone</label>
                                    <input id="phone" type="tel" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder="(optional)" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">Email</label>
                                <input required id="email" type="email" className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-stone/40" placeholder="you@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs uppercase tracking-[0.12em] text-stone font-medium block">Message</label>
                                <textarea required id="message" rows={5} className="w-full bg-warm-white border border-light-border rounded-xl px-5 py-3.5 text-sumi focus:outline-none focus:border-brand-red/50 transition-colors resize-none placeholder:text-stone/40" placeholder="What's on your mind?"></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus !== "idle"}
                                className="w-full bg-brand-red hover:bg-brand-red-hover disabled:bg-stone/30 disabled:cursor-not-allowed text-white py-4 rounded-full text-sm uppercase tracking-[0.12em] font-medium transition-all mt-2"
                            >
                                {formStatus === "submitting" ? "Sending..." : "Send Message"}
                            </button>

                            {formStatus === "success" && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
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
