import Script from "next/script";

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
      <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
      <div className={`elfsight-app-${appId}`} data-elfsight-app-lazy />
    </div>
  );
}
