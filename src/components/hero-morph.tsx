"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2400&q=88",
    title: <>Young minds.<br />Public ideas.</>,
    label: "Student-led economics",
  },
  {
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=2400&q=88",
    title: <>Research deeply.<br />Publish clearly.</>,
    label: "Ideas made public",
  },
  {
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=88",
    title: <>Question systems.<br />Shape tomorrow.</>,
    label: "Economics in motion",
  },
] as const;

export function HeroMorph() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <div className="hero-media" aria-hidden="true">
        {slides.map((slide, index) => (
          <div className={`hero-slide ${index === active ? "is-active" : ""}`} key={slide.image}>
            <Image src={slide.image} alt="" fill priority={index === 0} sizes="100vw" />
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="hero-copy-lockup" aria-live="polite">
        <p className="hero-kicker">{slides[active].label}</p>
        <div className="hero-title-stage">
          {slides.map((slide, index) => (
            <h1 className={`hero-morph-title ${index === active ? "is-active" : ""}`} aria-hidden={index !== active} key={slide.label}>
              {slide.title}
            </h1>
          ))}
        </div>
      </div>
      <div className="hero-progress" aria-hidden="true">
        {slides.map((slide, index) => <span className={index === active ? "is-active" : ""} key={slide.label} />)}
      </div>
    </>
  );
}
