import debateOne from "../../public/discussion/debate-1-web.jpg";
import debateTwo from "../../public/discussion/debate-2-web.jpg";
import debateThree from "../../public/discussion/debate-3-web.jpg";
import { mediaUrl } from "@/lib/content-api";

const discussionMedia: Record<string, string> = { "debate-1": debateOne.src, "debate-2": debateTwo.src, "debate-3": debateThree.src };

export function discussionMediaUrl(value: string | null | undefined, fallback: string) {
  if (value?.startsWith("local:")) return discussionMedia[value.slice(6)] || mediaUrl(null, fallback);
  return mediaUrl(value, fallback);
}

export function discussionImage(name: string) { return discussionMedia[name]; }
