"use client";

import DOMPurify from "isomorphic-dompurify";

export default function ArticleContent({ content }: { content: string }) {
  // Sanitize on client side to avoid server-side issues with jsdom
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
