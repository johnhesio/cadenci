export default function QuickReplies({ options, onSelect, disabled }) {
  if (!options?.length) return null;
  return (
    <div className="ml-9 flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          disabled={disabled}
          onClick={() => onSelect(opt.value)}
          className="rounded-full border border-pine/40 bg-card px-3.5 py-1.5 text-sm font-medium text-pine transition-colors hover:bg-pine hover:text-paper disabled:pointer-events-none disabled:opacity-40"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
