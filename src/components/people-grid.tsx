"use client";
import { useState } from "react";
import { people } from "@/lib/content";
const images = ["photo-1494790108377-be9c29b29330", "photo-1534528741775-53994a69daeb", "photo-1551836022-d5d88e9218df", "photo-1544717305-2782549b5136", "photo-1519085360753-af0119f7cbe7", "photo-1488426862026-3ee34a7d66df", "photo-1500648767791-00dcc994a43e", "photo-1531123897727-8f129e1688ce", "photo-1524504388940-b1c1722653e1", "photo-1535713875002-d1d0cf377fde", "photo-1507003211169-0a1dd7228f2d"];
export function PeopleGrid() {
  const [selected, setSelected] = useState<number | null>(null);
  const person = selected === null ? null : people[selected];
  const image = selected === null ? "" : `https://images.unsplash.com/${images[selected]}?auto=format&fit=crop&w=1400&q=85`;

  return <div className="people-grid">
    {person && <article className="person-stage" style={{ backgroundImage: `url(${image})` }}>
      <div className="person-stage-shade" />
      <button className="person-stage-close" onClick={() => setSelected(null)} aria-label="Close profile">Close</button>
      <div className="person-stage-copy"><p>{person[1]}</p><h3>{person[0]}</h3><p className="person-stage-bio">{person[2]}</p></div>
    </article>}
    <div className="people-cards">{people.map(([name, role], index) => <button className="person-card" key={name} onClick={() => setSelected(index)} aria-label={`Open ${name}'s profile`} style={{ backgroundImage: `url(https://images.unsplash.com/${images[index]}?auto=format&fit=crop&w=1000&q=80)` }}><div className="person-copy"><p>{role}</p><h3>{name}</h3></div></button>)}</div>
  </div>;
}
