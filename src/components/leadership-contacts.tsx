import Link from "next/link";
import { AtSign, Link2, Mail } from "lucide-react";

const leaders = [
  { name: "Vaidehi", role: "President", bio: "Founded ThinkEconomics to connect student research with public policy and real-world questions.", image: "https://i.postimg.cc/L5qYXLJX/IMG-20260626-WA0014.jpg", linkedin: "https://www.linkedin.com/in/think-economics-a534a741a/?isSelfProfile=true", instagram: "https://www.instagram.com/think_economics_", email: "thinkecon@gmail.com" },
  { name: "Swarnika", role: "Vice President", bio: "Leads cross-functional collaboration and helps strengthen research across the community.", image: "https://i.postimg.cc/pd2mjgmZ/IMG-20260626-WA0015.jpg", linkedin: "https://www.linkedin.com/in/swarnika-hada-951974415?utm_source=share_via&utm_content=profile&utm_medium=member_android", instagram: "https://www.instagram.com/kyuna.mi/?utm_source=qr&r=nametag", email: "swarnikahadaa@gmail.com" },
];

export function LeadershipContacts() {
  return <section className="leadership-contacts"><div className="section-title"><h2>Heads.</h2><Link href="/contributors">View all heads</Link></div><div className="leadership-grid">{leaders.map((leader) => <article key={leader.name}><div className="leader-photo" style={{ backgroundImage: `url(${leader.image})` }}/><div><p>{leader.role}</p><h3>{leader.name}</h3><span>{leader.bio}</span><nav><a href={leader.linkedin} aria-label={`${leader.name} on LinkedIn`}><Link2 size={18}/></a><a href={leader.instagram} aria-label={`${leader.name} on Instagram`}><AtSign size={18}/></a><a href={`mailto:${leader.email}`} aria-label={`Email ${leader.name}`}><Mail size={18}/></a></nav></div></article>)}</div></section>;
}
