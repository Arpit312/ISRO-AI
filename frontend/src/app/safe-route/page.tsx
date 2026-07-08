"use client";

import React, { useEffect } from "react";

export default function SafeRoutePage() {
  // Suppress scroll lock behavior from parent AppShell if necessary
  useEffect(() => {
    document.body.classList.remove("antigravity-scroll-lock");
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] relative overflow-hidden bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
      {/* We serve the standalone Safe-Route HTML app inside an iframe to guarantee 
          it remains entirely independent from the Next.js React hydration cycle, 
          as requested by the user. */}
      <iframe 
        src="/safe-route/index.html" 
        title="SAFE-ROUTE: Satellite Risk & Rescue Locator"
        className="absolute inset-0 w-full h-full border-none rounded-xl"
        allow="geolocation"
      />
    </div>
  );
}
