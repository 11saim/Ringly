export function RinglyMark() {
  return (
    <div className="flex items-center gap-3" aria-label="Ringly">
      <div className="relative grid h-9 w-9 place-items-center rounded-[13px] bg-[var(--cedar)]">
        <span className="absolute h-[18px] w-[18px] rounded-full border-[3px] border-white" />
        <span className="absolute h-[7px] w-[7px] rounded-full bg-white" />
      </div>
      <span className="text-[21px] font-bold tracking-[-0.05em] text-[var(--ink)] font-[family-name:var(--font-dm-sans)]">
        Ringly
      </span>
    </div>
  );
}
