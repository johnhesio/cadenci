export default function MetricCard({ icon: Icon, label, value, hint, accent = "pine" }) {
  const accentClasses = {
    pine: "bg-pine/10 text-pine",
    gold: "bg-gold/15 text-gold",
    sage: "bg-sage/15 text-sage",
    rose: "bg-rose/15 text-rose",
  };

  return (
    <div className="rounded-xl border border-line bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentClasses[accent]}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-3 font-mono text-2xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}
