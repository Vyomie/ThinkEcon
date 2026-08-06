"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const departments = [
  { title: "Editorial", href: "/blog", image: "photo-1455390582262-044cdead277a", caption: "Newsletters, magazines, articles, and blogs." },
  { title: "Podcasts", href: "/podcasts", image: "photo-1590602847861-f357a9332bbc", caption: "Conversations worth hearing." },
  { title: "Discussion", href: "/discussion", image: "photo-1528605248644-14dd04022da1", caption: "Debates and ideas that deserve time." },
];

export function DepartmentScroller() {
  const cards = useRef<Array<HTMLAnchorElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateActiveDepartment = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let next = 0;
      let nearest = Number.POSITIVE_INFINITY;

      cards.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < nearest) {
          nearest = distance;
          next = index;
        }
      });
      setActive((current) => current === next ? current : next);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveDepartment);
    };

    updateActiveDepartment();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="department-scroll">
    <div className="department-morph-layer">
      <div className="department-morph" aria-live="polite">
        <div key={departments[active].title} className="department-morph-copy">
          <h2>{departments[active].title}</h2>
          <span>{departments[active].caption}</span>
        </div>
      </div>
    </div>
    <div className="department-scroll-items">
      {departments.map((department, index) => <Link
        href={department.href}
        key={department.title}
        ref={(element) => { cards.current[index] = element; }}
        data-department-index={index}
        className="department-card"
        aria-label={`Explore ${department.title}`}
      >
        <div className="department-scroll-image" style={{ backgroundImage: `url(https://images.unsplash.com/${department.image}?auto=format&fit=crop&w=1800&q=85)` }}/>
      </Link>)}
    </div>
  </section>;
}
