"use client";

import { useEffect, useRef } from "react";

export default function InstagramEmbed({
  embedCode,
  className,
}: {
  embedCode: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !embedCode) return;

    container.innerHTML = embedCode;

    // dangerouslySetInnerHTML / innerHTML doesn't execute scripts — re-create each one so they run
    container.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = true;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [embedCode]);

  if (!embedCode) return null;

  return <div ref={containerRef} className={className} />;
}
