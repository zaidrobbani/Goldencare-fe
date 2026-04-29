import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-none bg-surface-container-low ">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6 w-full">
        <div className="text-lg font-bold text-primary ">Goldencare</div>
        <nav className="flex flex-wrap justify-center gap-8">
          <a
            className="text-slate-500 hover:text-primary transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-slate-500 hover:text-primary transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-slate-500 hover:text-primary transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Accessibility
          </a>
          <a
            className="text-slate-500 hover:text-primary transition-colors font-headline text-xs uppercase tracking-widest"
            href="#"
          >
            Contact Support
          </a>
        </nav>
        <div className="text-slate-500 font-headline text-xs uppercase tracking-widest opacity-100">
          © 2024 Goldencare. Nurturing Precision with Compassion.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
