"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CoreRole = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    // Fallback: pastikan semua card visible sebelum animasi
    const cards = sectionRef.current.querySelectorAll(".role-card");
    cards.forEach((card) => {
      (card as HTMLElement).style.opacity = "1";
      (card as HTMLElement).style.transform = "translateY(0)";
    });

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(".role-header", {
        scrollTrigger: {
          trigger: ".role-header",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Cards stagger animation
      gsap.from(".role-card", {
        scrollTrigger: {
          trigger: ".role-cards-container",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.2)",
        onComplete: () => {
          // Pastikan semua card visible setelah animasi
          cards.forEach((card) => {
            (card as HTMLElement).style.opacity = "1";
            (card as HTMLElement).style.transform = "translateY(0)";
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="roles" className="py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <div className="role-header text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-on-surface mb-4">The Triad of Care</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
            One ecosystem designed to bridge the gap between facility management and clinical
            excellence.
          </p>
        </div>
        <div className="role-cards-container grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="role-card bg-surface-container-lowest p-10 rounded-[2.5rem] group hover:shadow-2xl transition-all duration-500 border border-outline-variant/5">
            <div className="w-16 h-16 bg-primary-fixed flex items-center justify-center rounded-2xl mb-8 group-hover:rotate-6 transition-transform">
              <CorporateFareIcon fontSize="large" className="text-on-primary-fixed-variant" />
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-4">Administrator</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Master the complexities of modern care facility operations. From staff rostering to
              sophisticated health indexing and compliance analytics.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <CheckCircleIcon fontSize="small" className="text-primary" />
                Facility Operations Management
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <CheckCircleIcon fontSize="small" className="text-primary" />
                Data-Driven Health Indexing
              </li>
            </ul>
          </div>
          <div className="role-card bg-primary-container p-10 rounded-[2.5rem] text-on-primary shadow-xl shadow-primary/20 lg:scale-[1.05] relative z-10 transition-transform duration-500">
            <div className="w-16 h-16 bg-surface-container-lowest/20 flex items-center justify-center rounded-2xl mb-8">
              <HealthAndSafetyIcon fontSize="large" className="text-on-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Caregiver</h3>
            <p className="text-on-primary-container/80 leading-relaxed mb-6">
              Focus more on the person, less on the paperwork. Simplify daily recording, vitals
              logging, and ensure seamless handovers with zero friction.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <CheckCircleIcon fontSize="small" className="text-on-primary-container" />
                Tap-to-Record Vitals
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircleIcon fontSize="small" className="text-on-primary-container" />
                Digital Shift Handover Logs
              </li>
            </ul>
          </div>
          <div className="role-card bg-surface-container-lowest p-10 rounded-[2.5rem] group hover:shadow-2xl transition-all duration-500 border border-outline-variant/5">
            <div className="w-16 h-16 bg-secondary-container flex items-center justify-center rounded-2xl mb-8 group-hover:rotate-6 transition-transform">
              <FamilyRestroomIcon fontSize="large" className="text-on-secondary-container" />
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-4">Family</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Peace of mind through transparency. Stay connected with real-time health snapshots,
              detailed visit logs, and secure messaging with staff.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <CheckCircleIcon fontSize="small" className="text-secondary" />
                Real-time Health Snapshots
              </li>
              <li className="flex items-center gap-3 text-sm text-on-surface">
                <CheckCircleIcon fontSize="small" className="text-secondary" />
                Direct Care Communication
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreRole;
