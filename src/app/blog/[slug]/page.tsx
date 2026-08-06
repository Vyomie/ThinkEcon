import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/comment-section";
import { ArticleContent } from "@/components/article-content";
import { getPost, postDate, readingMinutes } from "@/lib/blogs";
import { mediaUrl } from "@/lib/content-api";

export const dynamic = "force-dynamic";

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="journal-article-page">
      <article>
        <header className="article-masthead">
          <Link href="/blog"><ArrowLeft size={17} /> Back to journal</Link>
          <p className="eyebrow">ThinkEconomics journal</p>
          <h1>{post.title}</h1>
          <p className="article-summary">{post.summary}</p>
          <div className="article-byline"><span>ThinkEconomics Editorial</span><time>{postDate(post.created_at)}</time><span><Clock3 size={15} /> {readingMinutes(post.body)} min read</span></div>
        </header>
        <div className="article-cover" role="img" aria-label="Article cover" style={{ backgroundImage: `url(${mediaUrl(post.cover, "photo-1456324504439-367cee3b3c32")})` }} />
        <ArticleContent body={post.body} />
      </article>
      <CommentSection postSlug={post.slug} enabled={Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)} />
    </main>
  );
}
