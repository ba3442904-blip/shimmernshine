import Script from "next/script";

const PLATFORM_SRC = "https://static.elfsight.com/platform/platform.js";

export default function ElfsightGoogleReviews({
  appId,
  className,
}: {
  appId: string;
  className?: string;
}) {
  if (!appId) return null;

  return (
    <div className={className}>
      <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
      <Script src={PLATFORM_SRC} strategy="lazyOnload" />
    </div>
  );
}
