export function RinglyMark() {
  return (
    <div className="flex items-center gap-3" aria-label="Ringly">
      <div className="relative grid h-9 w-9 place-items-center rounded-[13px] bg-primary shadow-[0_0_20px_var(--color-primary)] opacity-90">
        <span className="absolute h-[18px] w-[18px] rounded-full border-[3px] border-white" />
        <span className="absolute h-[7px] w-[7px] rounded-full bg-white" />
        <span className="absolute -right-0.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white" />
      </div>
      <span className="text-[21px] font-bold tracking-[-0.05em] text-foreground lg:text-white">ringly</span>
    </div>
  );
}
