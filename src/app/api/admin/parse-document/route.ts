import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const adminEmails = new Set(["thinkecon@gmail.com", "vyom1907patel@gmail.com"]);
const maxFileSize = 12 * 1024 * 1024;
const maxArticleLength = 250_000;

async function isAdmin() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  return Boolean(email && adminEmails.has(email));
}

function cleanPdfText(value: string) {
  return value
    .replace(/\u0000/g, "")
    .replace(/-\n(?=\p{Ll})/gu, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a Markdown or PDF file." }, { status: 400 });
  if (file.size > maxFileSize) return NextResponse.json({ error: "Files must be 12 MB or smaller." }, { status: 413 });

  const extension = file.name.toLowerCase().split(".").pop();
  try {
    let body = "";
    let pages: number | null = null;

    if (extension === "md" || extension === "markdown" || file.type === "text/markdown") {
      body = (await file.text()).trim();
    } else if (extension === "pdf" || file.type === "application/pdf") {
      const { extractText } = await import("unpdf");
      const result = await extractText(new Uint8Array(await file.arrayBuffer()), { mergePages: true });
      body = cleanPdfText(result.text);
      pages = result.totalPages;
    } else {
      return NextResponse.json({ error: "Only .md, .markdown, and .pdf files are supported." }, { status: 415 });
    }

    if (!body) return NextResponse.json({ error: "No readable text was found in this file." }, { status: 422 });
    if (body.length > maxArticleLength) return NextResponse.json({ error: "The extracted article is too long. Keep it under 250,000 characters." }, { status: 413 });

    return NextResponse.json({ body, fileName: file.name, pages });
  } catch {
    return NextResponse.json({ error: "This document could not be converted. Scanned PDFs need OCR before upload." }, { status: 422 });
  }
}
