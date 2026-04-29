"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    // Fallback: pastikan button selalu visible sebelum animasi
    const btns = sectionRef.current.querySelectorAll(".cta-btn");
    btns.forEach((btn) => {
      (btn as HTMLElement).style.opacity = "1";
      (btn as HTMLElement).style.transform = "scale(1)";
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      tl.from(".cta-box", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
        .from(
          ".cta-title",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .from(
          ".cta-desc",
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .from(
          ".cta-btn",
          {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: "back.out(1.5)",
            onComplete: () => {
              btns.forEach((btn) => {
                (btn as HTMLElement).style.opacity = "1";
                (btn as HTMLElement).style.transform = "scale(1)";
              });
            },
          },
          "-=0.3"
        );

      gsap.to(".cta-blur-1", {
        y: -30,
        x: -20,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(".cta-blur-2", {
        y: 30,
        x: 20,
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-24 bg-surface">
      <div className="max-w-5xl mx-auto px-8">
        <div className="cta-box bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="cta-blur-1 absolute top-0 right-0 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="cta-blur-2 absolute bottom-0 left-0 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="cta-title text-4xl md:text-5xl font-bold text-on-primary mb-6 relative z-10">
            Start Your Care Journey Today
          </h2>
          <p className="cta-desc text-on-primary-container/90 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Join hundreds of facilities that have transitioned to a more human, more efficient way
            of managing elder care.
          </p>
          <div className="cta-btn flex justify-center gap-4 relative z-10">
            <button className="bg-surface-container-lowest text-primary px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
