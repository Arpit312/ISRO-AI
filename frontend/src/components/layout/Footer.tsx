export default function Footer() {
  return (
    <footer className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--color-text-muted)]">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-[var(--color-text-tertiary)]">
            NOVA-SYNC
          </span>{" "}
          — ISRO LISS-IV Cloud Removal Engine
        </p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            All systems operational
          </span>
          <span className="text-[var(--color-border)]">|</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
