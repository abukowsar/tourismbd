"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

const links = [
  { href: "/#destinations", label: "Destinations" },
  { href: "/#planner", label: "Trip planner" },
  { href: "/#guide", label: "Travel guide" },
  { href: "/#safety", label: "Safety" },
  { href: "/#registration", label: "Register" },
];

export default function SiteHeader({ solid = false }) {
  const [scrolled, setScrolled] = useState(solid);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (solid) {
      return undefined;
    }

    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-solid" : ""}${open ? " is-open" : ""}`}>
      <a className="brand" href="/" aria-label="Tourism BD home">
        <img className="brand-logo" src="/assets/logo.png" alt="" aria-hidden="true" />
        <span>
          Tourism BD
          <small>Your safe journey partner</small>
        </span>
      </a>

      <nav id="primary-nav" aria-label="Primary navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a className="nav-cta" href="/login" onClick={() => setOpen(false)}>
          Login
        </a>
      </nav>

      <a className="header-sos" href="tel:999" aria-label="Call national emergency 999">
        <Icon name="phone" size={16} />
        999
      </a>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
    </header>
  );
}
