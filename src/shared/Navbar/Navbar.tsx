"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import {useRouter} from "next/navigation";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Roles", href: "#roles" },
  { name: "Solutions", href: "#solutions" },
  { name: "About", href: "#about" },
];

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("#features");
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      // Get all sections based on navLinks
      const sections = navLinks.map((link) => {
        const id = link.href.substring(1);
        const element = document.getElementById(id);
        return { id, element };
      });

      // Find the section currently in view
      let currentSection = "#features";
      const scrollPosition = window.scrollY + 150; // Offset for fixed navbar

      for (const section of sections) {
        if (section.element) {
          const sectionTop = section.element.offsetTop;
          const sectionHeight = section.element.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = `#${section.id}`;
          }
        }
      }

      // Check if we've reached the very bottom of the page
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (Math.ceil(window.scrollY + clientHeight) >= scrollHeight - 150) {
        currentSection = navLinks[navLinks.length - 1].href;
      }

      setActiveLink(currentSection);
    };

    // Calculate once on mount to handle initial load
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;

    // Calculate active element's position
    const activeIndex = navLinks.findIndex((link) => link.href === activeLink);
    if (activeIndex === -1) return;

    // Get all links
    const links = navRef.current.querySelectorAll("a");
    const activeEl = links[activeIndex] as HTMLElement;

    if (activeEl) {
      // Allow fonts to load and render before calculating using requestAnimationFrame occasionally
      requestAnimationFrame(() => {
        gsap.to(indicatorRef.current, {
          x: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }
  }, [activeLink]);

  return (
    <header className="sticky top-0 w-full z-50 bg-[#f7fce3]/80 backdrop-blur-md shadow-sm border-none">
      <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Image src="/Icon.png" alt="Logo" width={36} height={36} className="rounded-xl" />
          <span className="text-2xl font-extrabold text-primary tracking-tighter">Goldencare</span>
        </div>
        <nav ref={navRef} className="hidden md:flex gap-8 relative items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveLink(link.href)}
              className={`pb-1 font-headline text-sm tracking-wide transition-colors duration-200 z-10 ${
                activeLink === link.href
                  ? "text-primary font-bold"
                  : "text-slate-600 hover:text-primary font-medium"
              }`}
            >
              {link.name}
            </a>
          ))}
          {/* Animated Indicator */}
          <div
            ref={indicatorRef}
            className="absolute bottom-0 h-0.5 bg-primary rounded-full z-0"
            style={{ left: 0, width: 0 }}
          />
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-slate-600 font-medium text-sm active:scale-95 transition-transform hover:text-primary duration-300 cursor-pointer" onClick={() => router.push("/login")}>
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
