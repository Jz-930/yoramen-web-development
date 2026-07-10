"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";

export type SpecialOffer = {
  title: string;
  price: string;
  desc: string;
  img: string;
  availabilityText: string;
  href?: string;
};

type SpecialOffersCarouselProps = {
  offers: SpecialOffer[];
  ariaLabel?: string;
};

const AUTO_SCROLL_PIXELS_PER_SECOND = 24;
const AUTO_SCROLL_RESUME_DELAY = 1200;

export default function SpecialOffersCarousel({ offers, ariaLabel = "Special offers" }: SpecialOffersCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const autoScrollLeftRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const autoPausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const dragStateRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasDragged: false,
  });
  const preventClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const normalizeTargetScrollLeft = useCallback((scrollLeft: number) => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return scrollLeft;

    return ((scrollLeft % loopWidth) + loopWidth) % loopWidth;
  }, []);

  const normalizeScrollPosition = useCallback(() => {
    const track = trackRef.current;
    const loopWidth = loopWidthRef.current;
    if (!track || loopWidth <= 0) return;

    autoScrollLeftRef.current = normalizeTargetScrollLeft(
      autoScrollLeftRef.current || track.scrollLeft,
    );
    if (Math.abs(track.scrollLeft - autoScrollLeftRef.current) > 1) {
      track.scrollLeft = autoScrollLeftRef.current;
    }
  }, [normalizeTargetScrollLeft]);

  useEffect(() => {
    const track = trackRef.current;
    const firstSet = firstSetRef.current;
    if (!track || !firstSet) return;

    const updateLoopWidth = () => {
      loopWidthRef.current = firstSet.scrollWidth;
      normalizeScrollPosition();
    };

    updateLoopWidth();

    const resizeObserver = new ResizeObserver(updateLoopWidth);
    resizeObserver.observe(firstSet);
    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
    };
  }, [offers.length, normalizeScrollPosition]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || offers.length <= 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const tick = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      if (!autoPausedRef.current && loopWidthRef.current > 0) {
        autoScrollLeftRef.current += (elapsed / 1000) * AUTO_SCROLL_PIXELS_PER_SECOND;
        normalizeScrollPosition();
        track.scrollLeft = autoScrollLeftRef.current;
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
      animationFrameRef.current = null;
      lastFrameTimeRef.current = null;
    };
  }, [offers.length, normalizeScrollPosition]);

  const pauseAutoScroll = () => {
    autoPausedRef.current = true;
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const scheduleAutoScrollResume = () => {
    if (offers.length <= 1) return;

    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      autoPausedRef.current = false;
      lastFrameTimeRef.current = null;
    }, AUTO_SCROLL_RESUME_DELAY);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;

    const track = trackRef.current;
    if (!track) return;

    pauseAutoScroll();
    dragStateRef.current = {
      isDown: true,
      startX: event.clientX,
      scrollLeft: track.scrollLeft,
      hasDragged: false,
    };
    track.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const dragState = dragStateRef.current;
    if (!track || !dragState.isDown) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 4) {
      dragState.hasDragged = true;
      preventClickRef.current = true;
      setIsDragging(true);
    }

    if (dragState.hasDragged) {
      autoScrollLeftRef.current = normalizeTargetScrollLeft(dragState.scrollLeft - deltaX);
      track.scrollLeft = autoScrollLeftRef.current;
    }
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current.isDown = false;
    setIsDragging(false);
    scheduleAutoScrollResume();

    if (dragStateRef.current.hasDragged) {
      window.setTimeout(() => {
        preventClickRef.current = false;
      }, 0);
    }
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!preventClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    preventClickRef.current = false;
  };

  const renderOfferCard = (offer: SpecialOffer, idx: number, isClone = false) => (
    <div
      key={`${isClone ? "clone" : "offer"}-${offer.title}-${idx}`}
      data-offer-card
      role={isClone ? undefined : "listitem"}
      className="shrink-0 w-[82vw] sm:w-[360px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col"
    >
      <div className="relative h-[220px] w-full">
        <Image src={offer.img} alt={isClone ? "" : offer.title} fill draggable={false} className="object-cover pointer-events-none" />
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-serif text-sumi font-medium min-w-0">{offer.title}</h3>
          <span className="text-brand-red font-semibold text-lg shrink-0">{offer.price}</span>
        </div>
        <p className="text-stone text-sm leading-relaxed mb-6">{offer.desc}</p>
        <div className="mt-auto">
          {offer.href && !isClone ? (
            <Link href={offer.href} className="inline-block border-b border-black text-xs tracking-widest uppercase pb-1 font-medium hover:text-brand-red hover:border-brand-red transition-colors">
              {offer.availabilityText}
            </Link>
          ) : (
            <span className="inline-block border-b border-black text-xs tracking-widest uppercase pb-1 font-medium">
              {offer.availabilityText}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-10 w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-gray-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-gray-50 to-transparent" />
        <div
          ref={trackRef}
          aria-label={ariaLabel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={handleClickCapture}
          className={`flex overflow-x-auto hide-scrollbar px-6 lg:px-[max(2rem,calc((100vw-72rem)/2+2rem))] pb-8 cursor-grab active:cursor-grabbing ${
            isDragging ? "select-none" : ""
          }`}
          style={{ touchAction: "pan-y" }}
        >
          <div ref={firstSetRef} role="list" className="flex gap-6 shrink-0 pr-6">
            {offers.map((offer, idx) => renderOfferCard(offer, idx))}
          </div>
          {offers.length > 1 && (
            <div aria-hidden="true" className="flex gap-6 shrink-0 pr-6">
              {offers.map((offer, idx) => renderOfferCard(offer, idx, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
