"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Fallback: pastikan semua tombol .hero-btn selalu visible sebelum animasi
    const btns = containerRef.current.querySelectorAll(".hero-btn");
    btns.forEach((btn) => {
      (btn as HTMLElement).style.opacity = "1";
      (btn as HTMLElement).style.transform = "none";
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Left column animations
      tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.6 }, "-=0.6")
        .from(
          ".hero-btn",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.15,
            onComplete: () => {
              btns.forEach((btn) => {
                (btn as HTMLElement).style.opacity = "1";
                (btn as HTMLElement).style.transform = "none";
              });
            },
          },
          "-=0.5"
        );

      // Right column animations
      tl.from(
        ".hero-image-bg",
        { scale: 0.8, opacity: 0, rotation: 0, duration: 1, ease: "back.out(1.7)" },
        "-=1"
      )
        .from(".hero-image-main", { scale: 0.8, opacity: 0, duration: 0.8 }, "-=0.8")
        .from(".hero-floating-card", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-217.5 flex items-center overflow-hidden bg-surface"
      id="features"
    >
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        <div className="z-10 relative">
          <span className="hero-badge inline-block px-4 py-1.5 mb-6 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-xs font-bold tracking-widest uppercase">
            Precision Health Management
          </span>
          <h1 className="hero-title text-5xl md:text-7xl font-extrabold text-on-surface leading-[1.1] mb-6 tracking-tight">
            Compassionate Care,{" "}
            <span className="bg-linear-to-r from-primary to-primary-container bg-clip-text text-transparent">
              Digitally Simplified
            </span>
          </h1>
          <p className="hero-desc text-lg md:text-xl text-on-surface-variant mb-10 max-w-xl leading-relaxed">
            The modern sanctuary for elder care management. Empowering administrators, caregivers,
            and families with a unified platform built for trust and precision.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="hero-btn px-8 py-4 bg-linear-to-r from-primary to-primary-container text-on-primary rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Get Started
            </button>
            <button className="hero-btn px-8 py-4 border-2 border-primary/20 text-primary rounded-full font-bold text-lg hover:bg-primary/5 transition-colors">
              Watch the Story
            </button>
          </div>
        </div>
        <div className="relative h-125 lg:h-150 flex items-center justify-center">
          <div className="hero-image-bg absolute inset-0 bg-surface-container-highest/50 rounded-[4rem] rotate-3 -z-10"></div>
          <div className="hero-image-main w-full h-full rounded-[3.5rem] overflow-hidden shadow-2xl relative">
            <Image
              alt="Professional caregiving"
              className="w-full h-full object-cover"
              data-alt="Close-up of a young female caregiver holding an elderly patient's hand with gentle compassion in a sunlit warm living room"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8RZ9uFbOi9ogZzC8CxdxTUu5vEvVGdee5qTDCXIfmh-_8O3ktf0rBtJrF9AY19beBLccHeG7VrRSFjhbkzAEMUzGUiE6b81vmUEsuID9pdoUWix1bHbbgVHVVSKKpKiCdoyqHLT4ANTcpSLFa1XB-SW46ZNFXgnOcxj1uTCrjTnIGHEh0mW2YPz4zHdHHasSGUsONNV9OC-I441kEGuFNlrYs95TDqvT91ntUc5kMSpzO-TWqVdeKAgG2Pk1xQ_po8fTf2a_r8BM"
              width={600}
              height={600}
            />
            <div className="hero-floating-card absolute bottom-8 left-8 right-8 bg-surface-container-lowest/90 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Precision Health Snapshot</p>
                  <p className="text-xs text-on-surface-variant">
                    Real-time vitals and mood tracking active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
