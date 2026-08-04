"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  { title: "Editorial", description: "Newsletters, magazines, articles, and blogs.", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=85" },
  { title: "Podcasts", description: "Student-led conversations on economics and current affairs.", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=85" },
  { title: "Research", description: "Research projects and paper support across economics, business, and public policy.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85" },
  { title: "Discussion", description: "A space for thoughtful questions, debate, and public conversation.", image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=85" },
  { title: "Social Media", description: "The team that carries ThinkEconomics into the wider conversation.", image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1600&q=85" },
  { title: "Design", description: "Visual stories, infographics, presentations, and identity.", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=85" },
  { title: "Outreach", description: "Events, speakers, partnerships, and conversations beyond the classroom.", image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=1600&q=85" },
  { title: "Tech & Operations", description: "The systems, workflows, and platforms that keep the work moving.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=85" },
];

export function ProjectShowcase({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0); const items = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const updateTitle = () => {
      const midpoint = window.innerHeight / 2;
      const index = items.current.findIndex((item) => {
        if (!item) return false;
        const bounds = item.getBoundingClientRect();
        return bounds.top <= midpoint && bounds.bottom >= midpoint;
      });
      if (index >= 0) setActive(index);
    };
    updateTitle();
    window.addEventListener("scroll", updateTitle, { passive: true });
    window.addEventListener("resize", updateTitle);
    return () => { window.removeEventListener("scroll", updateTitle); window.removeEventListener("resize", updateTitle); };
  }, []);
  return <section className={`project-showcase ${compact ? "is-compact" : ""}`}><div className="project-sticky"><small>Departments</small><h2 key={projects[active].title} className="morph-title">{projects[active].title}</h2><p key={projects[active].description} className="morph-copy">{projects[active].description}</p></div><div className="project-images">{projects.map((project, index) => <article ref={(item) => { items.current[index] = item; }} data-index={index} key={project.title}><div style={{ backgroundImage: `url(${project.image})` }}/><span>{String(index + 1).padStart(2, "0")}</span></article>)}</div></section>;
}
