export function ConfidenceBar({ level }: { level: 1 | 2 | 3 }) {
  const colors = ["bg-warning", "bg-warning", "bg-success"];
  return (
    <div className="flex gap-0.5" title={`Confidence: ${level}/3`}>
      {[1, 2, 3].map((n) => (
        <div key={n} className={`h-3 w-1 rounded-sm ${n <= level ? colors[level - 1] : "bg-border"}`} />
      ))}
    </div>
  );
}
