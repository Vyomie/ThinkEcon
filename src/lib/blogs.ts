export type BlogPost = { slug: string; title: string; summary: string; body: string; cover: string | null };

export async function getPosts(): Promise<BlogPost[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return [];
  const response = await fetch(`${base}/rest/v1/blog_posts?published=eq.true&select=slug,title,summary,body,cover&order=created_at.desc`, { headers: { apikey: key }, cache: "no-store" });
  return response.ok ? response.json() : [];
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}
