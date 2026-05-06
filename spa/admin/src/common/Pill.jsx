/* ─────────────────────────────────────────────
   Pill badge component
───────────────────────────────────────────── */
const Pill = ({ label, className }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border ${className}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
    {label}
  </span>
);

export default Pill;