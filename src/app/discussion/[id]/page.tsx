import { notFound } from "next/navigation";
import { DiscussionReplies } from "@/components/discussion-replies";
import { getDiscussionReplies, getDiscussionThreads } from "@/lib/content-api";
export const dynamic = "force-dynamic";
export default async function DiscussionThread({ params }: { params: Promise<{ id: string }> }) { const id = (await params).id; const thread = (await getDiscussionThreads()).find((item) => item.id === id); if (!thread) notFound(); return <main className="forum-page"><section className="page-hero"><small>{thread.author_name}</small><h1>{thread.title}</h1><p>{thread.body}</p></section><DiscussionReplies threadId={id} initialReplies={await getDiscussionReplies(id)} /></main>; }
