import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { getPosts, postDate, readingMinutes } from "@/lib/blogs";
import { mediaUrl } from "@/lib/content-api";

export const dynamic = "force-dynamic";

export default async function Blog() {
  const posts = await getPosts();
  const [featured, ...morePosts] = posts;

  return (
    <main className="journal-page">
      <header className="journal-hero">
        <p className="eyebrow">The ThinkEconomics journal</p>
        <h1>Ideas with<br />room to breathe.</h1>
        <p>Student research, sharp explainers, and considered arguments about the systems shaping everyday life.</p>
      </header>

      {featured ? (
        <>
          <Link className="journal-feature" href={`/blog/${featured.slug}`}>
            <div className="journal-feature-image" style={{ backgroundImage: `url(${mediaUrl(featured.cover, "photo-1456324504439-367cee3b3c32")})` }} />
            <div className="journal-feature-copy">
              <span>Latest essay</span>
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
              <div className="journal-meta"><time>{postDate(featured.created_at)}</time><span><Clock3 size={15} /> {readingMinutes(featured.body)} min read</span></div>
              <strong>Read the essay <ArrowUpRight size={18} /></strong>
            </div>
          </Link>

          {morePosts.length ? <section className="journal-archive">
            <div className="journal-section-heading"><p className="eyebrow">More from the journal</p><span>{morePosts.length} {morePosts.length === 1 ? "essay" : "essays"}</span></div>
            <div className="journal-grid">{morePosts.map((post, index) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <div className="journal-card-image" style={{ backgroundImage: `url(${mediaUrl(post.cover, index % 2 ? "photo-1521737604893-d14cc237f11d" : "photo-1523240795612-9a054b0db644")})` }} />
                <div className="journal-card-copy">
                  <div className="journal-meta"><time>{postDate(post.created_at)}</time><span>{readingMinutes(post.body)} min</span></div>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <strong>Read article <ArrowUpRight size={17} /></strong>
                </div>
              </Link>
            ))}</div>
          </section> : null}
        </>
      ) : (
        <section className="journal-empty"><span>01</span><h2>The first idea is being written.</h2><p>New essays will appear here as soon as they are published.</p></section>
      )}
    </main>
  );
}
