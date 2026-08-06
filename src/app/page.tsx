import Link from "next/link";
import { DepartmentScroller } from "@/components/department-scroller";
import { LeadershipContacts } from "@/components/leadership-contacts";
import { getPosts } from "@/lib/blogs";
import { getEvents, getPodcasts, mediaUrl } from "@/lib/content-api";

function embed(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export default async function Home() {
  const [posts, podcasts, events] = await Promise.all([getPosts(), getPodcasts(), getEvents()]);
  const blog = posts[0];
  const podcast = podcasts[0];
  const event = events[0];

  return <main>
    <section className="hero">
      <div className="hero-media" />
      <div className="hero-shade" />
      <div className="hero-copy-lockup">
        <p className="hero-kicker">Student-led economics</p>
        <h1>Young minds.<br />Public ideas.</h1>
      </div>
      <div className="hero-bottom"><p>ThinkEconomics is where students research, publish, discuss, and build a sharper view of the world.</p><Link href="/contact" className="cta">Join ThinkEconomics</Link></div>
    </section>
    <section className="ribbon"><div>{Array(3).fill("Research • Editorial • Podcasts • Public Policy • Design • Outreach • ").join("")}</div></section>
    <section className="statement" id="about"><h2>Economics is not only theory. It is how people make choices, build systems, and shape everyday life.</h2></section>
    <DepartmentScroller />
    <section className="latest"><h2>Latest.</h2><div>
      {blog ? <Link href={`/blog/${blog.slug}`}><div style={{ backgroundImage: `url(${mediaUrl(blog.cover, "photo-1456324504439-367cee3b3c32")})` }} /><h3>{blog.title}</h3></Link> : null}
      {podcast ? <article className="latest-podcast-card"><iframe src={embed(podcast.video_url)} title={podcast.title} allowFullScreen /><Link href="/podcasts"><h3>{podcast.title}</h3></Link></article> : null}
      {event ? <Link href={`/events/${event.slug}`}><div style={{ backgroundImage: `url(${mediaUrl(event.image_url, "photo-1497366754035-f200968a6e72")})` }} /><h3>{event.title}</h3></Link> : null}
    </div></section>
    <LeadershipContacts />
  </main>;
}
