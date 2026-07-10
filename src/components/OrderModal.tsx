"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import OrderIframe from "./OrderIframe";
import type { OrderPageContent } from "@/sanity/types";
import { textOr } from "@/sanity/fallback";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { textFromDictionary, type TextDictionary } from "@/i18n/client-copy";

export default function OrderModal({
    order,
    copy,
}: {
    order?: OrderPageContent | null;
    copy?: TextDictionary;
}) {
    const router = useRouter();
    const t = (source: string) => textFromDictionary(copy, source);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(true);

    const onDismiss = useCallback(() => {
        setIsOpen(false);
        // Wait for exit animation to complete before routing back
        setTimeout(() => {
            router.back();
        }, 300);
    }, [router]);

    const onClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onDismiss();
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onDismiss();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);    
    }, [onDismiss]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={onClick}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-6 lg:p-12"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it just in case
                    >
                        {/* Header for Modal */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                            <h2 className="text-xl font-serif text-sumi">{t(textOr(order?.title, "Order Online"))}</h2>
                            <button 
                                onClick={onDismiss}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-stone hover:text-sumi"
                                aria-label={t("Close modal")}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Content area: Iframe fills remaining space */}
                        <div className="flex-1 overflow-hidden relative">
                            <OrderIframe order={order} copy={copy} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
