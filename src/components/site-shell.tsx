"use client";
import Link from "next/link";
import { AtSign, Link2, Menu, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { AuthControls } from "@/components/auth-controls";
const links = [["About", "/#about"], ["Journal", "/blog"], ["Podcasts", "/podcasts"], ["Events", "/events"], ["Discussion", "/discussion"], ["Heads", "/contributors"], ["Contact", "/contact"]];
export function SiteShell({ children, clerkEnabled }: { children: React.ReactNode; clerkEnabled: boolean }) {
  const [open, setOpen] = useState(false);
  return <><header className="topbar"><Link className="identity" href="/">ThinkEconomics</Link><nav className="desktop-nav">{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Open navigation" aria-expanded={open}>{open ? <X size={24}/> : <Menu size={24}/>}</button><AuthControls enabled={clerkEnabled}/></header><aside className={`menu-drawer ${open ? "is-open" : ""}`}><div>{links.map(([label, href], index) => <Link key={href} href={href} onClick={() => setOpen(false)} style={{ "--i": index } as React.CSSProperties}>{label}</Link>)}</div><AuthControls enabled={clerkEnabled}/></aside>{children}<footer className="footer"><div><strong>ThinkEconomics</strong></div><p>Research, editorial work, podcasts, and public conversations.</p><nav aria-label="Social links"><a href="https://www.instagram.com/think_economics_" aria-label="Instagram"><AtSign size={18}/><span>Instagram</span></a><a href="https://www.linkedin.com/in/think-economics-a534a741a/?isSelfProfile=true" aria-label="LinkedIn"><Link2 size={18}/><span>LinkedIn</span></a><Link href="/contributors"><UsersRound size={18}/><span>Heads</span></Link></nav><span>© 2026 ThinkEconomics</span></footer></>;
}
