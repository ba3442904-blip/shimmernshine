"use client";

import { useEffect } from "react";

const PLATFORM_SRC = "https://static.elfsight.com/platform/platform.js";

export default function ElfsightGoogleReviews({
  appId,
  className,
}: {
  appId: string;
  className?: string;
}) {
  useEffect(() => {
    if (!appId) return;

    const existing = document.querySelector(`script[src="${PLATFORM_SRC}"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = PLATFORM_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  }, [appId]);

  if (!appId) return null;

  return (
    <div className={className}>
      <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
    </div>
  );
}
