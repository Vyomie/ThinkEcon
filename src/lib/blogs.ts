export type BlogPost = { slug: string; title: string; summary: string; body: string; cover: string | null; created_at: string };

export function readingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function postDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export async function getPosts(): Promise<BlogPost[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return [];
  try {
    const response = await fetch(`${base}/rest/v1/blog_posts?published=eq.true&select=slug,title,summary,body,cover,created_at&order=created_at.desc`, {
      headers: { apikey: key },
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    return response.ok ? response.json() : [];
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}
