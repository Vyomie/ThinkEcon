import { InteractiveSupply } from "@/components/interactive-supply";
import { InteractiveGrowth } from "@/components/interactive-growth";
import { discussionImage } from "@/lib/discussion-media";

export function ArticleContent({ body }: { body: string | string[] }) {
  const blocks = Array.isArray(body) ? body : body.split(/\n\s*\n/);
  return <div className="article-body">{blocks.map((block) => {
    if (block.startsWith("image:")) return <div key={block} className="article-image" style={{ backgroundImage: `url(https://images.unsplash.com/${block.slice(6)}?auto=format&fit=crop&w=1400&q=85)` }} />;
    if (block.startsWith("localimage:")) {
      const source = discussionImage(block.slice(11));
      return source ? <div key={block} className="article-image" style={{ backgroundImage: `url(${source})` }} /> : null;
    }
    if (block === "interactive:supply") return <InteractiveSupply key={block} />;
    if (block === "interactive:growth") return <InteractiveGrowth key={block} />;
    const [heading, ...paragraphs] = block.split("\n");
    return <section key={block}>{heading.startsWith("## ") && <h2>{heading.slice(3)}</h2>}{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>;
  })}</div>;
}
