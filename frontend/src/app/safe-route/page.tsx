"use client";

import React, { useEffect } from "react";

export default function SafeRoutePage() {

  useEffect(() => {
    document.body.classList.remove("antigravity-scroll-lock");
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] relative overflow-hidden bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
      {}
      <iframe 
        src="/safe-route/index.html" 
        title="SAFE-ROUTE: Satellite Risk & Rescue Locator"
        className="absolute inset-0 w-full h-full border-none rounded-xl"
        allow="geolocation"
      />
    </div>
  );
}
