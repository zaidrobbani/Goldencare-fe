"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Material UI Icons
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RecommendIcon from "@mui/icons-material/Recommend";
import AnalyticsIcon from "@mui/icons-material/Analytics";

const Aesthetic = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Left side Masonry Images & Cards
      gsap.from(".masonry-col-1 .masonry-item", {
        scrollTrigger: {
          trigger: ".masonry-grid",
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
      });

      gsap.from(".masonry-col-2 .masonry-item", {
        scrollTrigger: {
          trigger: ".masonry-grid",
          start: "top 70%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
      });

      // Right side textual content
      const tlText = gsap.timeline({
        scrollTrigger: {
          trigger: ".aesthetic-text-content",
          start: "top 75%",
        },
      });

      tlText
        .from(".aesthetic-title", { x: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(".aesthetic-desc", { x: 50, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(
          ".aesthetic-item",
          { x: 50, opacity: 0, duration: 0.6, stagger: 0.2, ease: "power3.out" },
          "-=0.4"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-surface overflow-hidden" id="solutions">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="masonry-grid grid grid-cols-2 gap-4">
            <div className="masonry-col-1 space-y-4">
              <div className="masonry-item rounded-3xl overflow-hidden h-48">
                <Image
                  alt="Garden walk"
                  className="w-full h-full object-cover"
                  data-alt="An elderly man and a nurse walking through a lush green garden in soft morning light talking and smiling"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTef-qZC0_HftDAy6fzbHHFFjLUDO6Rq3ykXKySTjyVUgdkAEimSjmjyXmyEtLUpddNVxz7XDkHdl7EpSD3AX5IdeMcngQCvQs8JleareuG0qPcXH4cH8QoofIFSXvg7kOXr4rx0PcWX3hc6C9XxRfMro9G_VXLjbJI_NT_G_SSDPOQbIayBivfOJon8fJPVnnll85czeQNj0tTBRldhoxRxrugMFP_WjwU3F49bvJKB-V_DnFR4aVo3qKiuT_sqtD40Blhb_1pUc"
                  width={500}
                  height={500}
                />
              </div>
              <div className="masonry-item bg-tertiary-fixed rounded-3xl p-6 h-64 flex flex-col justify-end">
                <VolunteerActivismIcon
                  fontSize="large"
                  className="text-on-tertiary-fixed-variant mb-4"
                />
                <h4 className="text-on-tertiary-fixed font-bold text-xl">Kindred Connection</h4>
                <p className="text-on-tertiary-fixed-variant text-sm">
                  Building human-centric interfaces for aging.
                </p>
              </div>
            </div>
            <div className="masonry-col-2 space-y-4 pt-8">
              <div className="masonry-item bg-secondary-fixed rounded-3xl p-6 h-64 flex flex-col justify-end">
                <VisibilityIcon fontSize="large" className="text-on-secondary-fixed-variant mb-4" />
                <h4 className="text-on-secondary-fixed font-bold text-xl">Absolute Clarity</h4>
                <p className="text-on-secondary-fixed-variant text-sm">
                  Data visualization that tells the real human story.
                </p>
              </div>
              <div className="masonry-item rounded-3xl overflow-hidden h-48">
                <Image
                  alt="Digital health monitoring"
                  className="w-full h-full object-cover"
                  data-alt="Macro shot of a hand using a tablet displaying a clean minimalist health chart dashboard in soft warm lighting"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb70OwWgRcaXuLV4u53jL6oiUZ27EFnh_lL9EFwUTyaGp6PCaXS0tmJPDLXX9JZzRWP4QCeLo2oUv2v-THPdybnsN8THJrXvGodVfb-FsDUYC9AGqVa9XYYRNNygyG7hEawJ1nqLn_5SapHg8P9rZByfU6JBelMyesoxkH9PCPPebkrI1eXynLKsWgcs4e4x4eMZFpM4Hl7m7agNKcw3COd0_P8favXiGs5opZw6ARP8lHial-rbvMXwAe9PV19vx0RpMXImcXqwE"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="aesthetic-text-content order-1 lg:order-2">
          <h2 className="aesthetic-title text-4xl md:text-5xl font-bold text-on-surface mb-8 leading-tight">
            Nurturing Precision with Every Interaction
          </h2>
          <p className="aesthetic-desc text-on-surface-variant text-lg leading-relaxed mb-8">
            Our design philosophy, &quot;The Digital Sanctuary,&quot; rejects clinical coldness.
            We&apos;ve replaced harsh lines with tonal depth and expansive space, creating an
            environment that calms caregivers and reassures families.
          </p>
          <div className="space-y-6">
            <div className="aesthetic-item flex gap-6 items-start">
              <div className="w-12 h-12 shrink-0 bg-surface-container-highest flex items-center justify-center rounded-full">
                <RecommendIcon className="text-primary" />
              </div>
              <div>
                <h5 className="font-bold text-on-surface text-lg">Organic Aesthetics</h5>
                <p className="text-on-surface-variant">
                  A palette of life-affirming greens and warm paper neutrals.
                </p>
              </div>
            </div>
            <div className="aesthetic-item flex gap-6 items-start">
              <div className="w-12 h-12 shrink-0 bg-surface-container-highest flex items-center justify-center rounded-full">
                <AnalyticsIcon className="text-primary" />
              </div>
              <div>
                <h5 className="font-bold text-on-surface text-lg">Clinical Integrity</h5>
                <p className="text-on-surface-variant">
                  Rigorous data architecture meeting high-level medical standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aesthetic;
