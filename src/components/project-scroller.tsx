"use client";

import { useEffect, useRef, useState } from "react";

const projects = [
  { title: "Editorial", image: "photo-1499750310107-5fef28a66643", caption: "Research made readable." },
  { title: "Podcasts", image: "photo-1590602847861-f357a9332bbc", caption: "Conversations worth hearing." },
  { title: "Research Projects", image: "photo-1454165804606-c3d57bc86b40", caption: "Questions pursued properly." },
  { title: "Outreach & Events", image: "photo-1517048676732-d65bc937f952", caption: "Ideas brought into the room." },
];

export function ProjectScroller() {
  const [active, setActive] = useState(0);
  const items = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.5).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.index));
    }, { threshold: [0.51, 0.75] });
    items.current.forEach((item) => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return <section className="project-scroll" id="projects">
    <div className="project-scroll-title"><h2 key={projects[active].title}>{projects[active].title}</h2><span>{projects[active].caption}</span></div>
    <div className="project-scroll-items">
      {projects.map((project, index) => <article key={project.title} data-index={index} ref={(node) => { items.current[index] = node; }} className={active === index ? "is-current" : ""}>
        <div className="project-scroll-image" style={{ backgroundImage: `url(https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=1600&q=85)` }} />
      </article>)}
    </div>
  </section>;
}
