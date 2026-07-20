"use client";

import { useEffect, useState } from "react";

export function ScrollToRsvp() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const rsvp = document.getElementById("rsvp");
    if (!rsvp) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hide once RSVP is on screen; show again when it's fully out of view (back on info).
        setVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(rsvp);
    return () => observer.disconnect();
  }, []);

  function scrollToRsvp() {
    document.getElementById("rsvp")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToRsvp}
      className={`scroll-to-rsvp lg:hidden ${visible ? "is-visible" : ""}`}
      aria-label="Scroll to RSVP"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className="scroll-to-rsvp-label">RSVP</span>
      <span aria-hidden className="scroll-to-rsvp-chevron">
        ↓
      </span>
    </button>
  );
}
