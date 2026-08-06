import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { InteractiveSupply } from "@/components/interactive-supply";
import { InteractiveGrowth } from "@/components/interactive-growth";
import { discussionImage } from "@/lib/discussion-media";

export function ArticleContent({ body }: { body: string | string[] }) {
  const content = Array.isArray(body) ? body.join("\n\n") : body;
  const blocks = content.split(/\n\s*\n/);

  return <div className="article-body">{blocks.map((block, index) => {
    if (block.startsWith("image:")) return <div key={`${block}-${index}`} className="article-image" role="img" aria-label="Article illustration" style={{ backgroundImage: `url(https://images.unsplash.com/${block.slice(6)}?auto=format&fit=crop&w=1400&q=85)` }} />;
    if (block.startsWith("localimage:")) {
      const source = discussionImage(block.slice(11));
      return source ? <div key={`${block}-${index}`} className="article-image" role="img" aria-label="Article illustration" style={{ backgroundImage: `url(${source})` }} /> : null;
    }
    if (block === "interactive:supply") return <InteractiveSupply key={`${block}-${index}`} />;
    if (block === "interactive:growth") return <InteractiveGrowth key={`${block}-${index}`} />;
    return <ReactMarkdown key={index} remarkPlugins={[remarkGfm]} skipHtml>{block}</ReactMarkdown>;
  })}</div>;
}
