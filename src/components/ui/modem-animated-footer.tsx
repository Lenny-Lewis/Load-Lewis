"use client";
import React from "react";
import { Link } from "react-router-dom";
import {
  NotepadTextDashed,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  brandName = "YourBrand",
  brandDescription = "Your description here",
  socialLinks = [],
  navLinks = [],
  creatorName,
  creatorUrl,
  brandIcon,
  className,
}) => {
  return (
    <section className={cn("relative w-full mt-0 overflow-hidden", className)}>
      <footer className="border-t border-white/10 bg-background mt-20 relative">
        <div className="max-w-7xl flex flex-col justify-between mx-auto min-h-[30rem] sm:min-h-[35rem] md:min-h-[40rem] relative p-4 py-10">
          <div className="flex flex-col mb-12 sm:mb-20 md:mb-0 w-full z-20">
            <div className="w-full flex flex-col items-center">
              <div className="space-y-2 flex flex-col items-center flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-3xl font-bold">
                    {brandName}
                  </span>
                </div>
                <p className="text-muted-foreground font-semibold text-center w-full max-w-sm sm:w-96 px-4 sm:px-0">
                  {brandDescription}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex mb-8 mt-6 gap-3 sm:gap-4 z-20">
                  {socialLinks.map((link, index) => {
                    const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto");
                    return isExternal ? (
                      <a
                        key={index}
                        href={link.href}
                        className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.06] border border-white/15 text-white/85 hover:text-white hover:bg-white/[0.14] hover:border-white/35 transition-all duration-300 hover:scale-110 shadow-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          {link.icon}
                        </div>
                        <span className="sr-only">{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        key={index}
                        to={link.href}
                        className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.06] border border-white/15 text-white/85 hover:text-white hover:bg-white/[0.14] hover:border-white/35 transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <div className="w-5 h-5 flex items-center justify-center">
                          {link.icon}
                        </div>
                        <span className="sr-only">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {navLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground max-w-full px-4 z-20">
                  {navLinks.map((link, index) => {
                    const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto");
                    return isExternal ? (
                      <a
                        key={index}
                        className="hover:text-foreground duration-300 hover:font-semibold"
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={index}
                        className="hover:text-foreground duration-300 hover:font-semibold"
                        to={link.href}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 md:mt-24 flex flex-col gap-2 md:gap-1 items-center justify-center md:flex-row md:items-center md:justify-between px-4 md:px-0 z-20">
            <p className="text-base text-muted-foreground text-center md:text-left">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            {creatorName && creatorUrl && (
              <nav className="flex gap-4">
                <a
                  href={creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors duration-300 hover:font-medium"
                >
                  Crafted by {creatorName}
                </a>
              </nav>
            )}
          </div>
        </div>

        {/* Large background text */}
        <div 
          className="bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent bg-clip-text text-transparent leading-none absolute left-1/2 -translate-x-1/2 bottom-40 md:bottom-32 font-extrabold tracking-tighter pointer-events-none select-none text-center px-4 z-0"
          style={{
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            maxWidth: '95vw'
          }}
        >
          {brandName.toUpperCase()}
        </div>

        {/* Bottom logo */}
        <div className="absolute hover:border-foreground duration-400 drop-shadow-[0_0px_20px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_0px_20px_rgba(255,255,255,0.3)] bottom-24 md:bottom-20 backdrop-blur-sm rounded-3xl bg-background/60 left-1/2 border-2 border-border flex items-center justify-center p-3 -translate-x-1/2 z-10">
          <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-gradient-to-br from-foreground to-foreground/80 rounded-2xl flex items-center justify-center shadow-lg">
            {brandIcon || (
              <NotepadTextDashed className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />
            )}
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-32 sm:bottom-34 backdrop-blur-sm h-1 bg-gradient-to-r from-transparent via-border to-transparent w-full left-1/2 -translate-x-1/2"></div>

        {/* Bottom shadow */}
        <div className="bg-gradient-to-t from-background via-background/80 blur-[1em] to-background/40 absolute bottom-28 w-full h-24"></div>
      </footer>
    </section>
  );
};
