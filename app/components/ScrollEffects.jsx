"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

export default function ScrollEffects() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    function onScroll() {
      setShowTop(window.scrollY > 900);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${showTop ? " is-visible" : ""}`}
      aria-label="Back to top"
      tabIndex={showTop ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <Icon name="up" size={20} />
    </button>
  );
}
