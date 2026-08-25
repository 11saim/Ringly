const nodes = [
  { label: "DATA", x: "9%", y: "24%", color: "#7f9cff" },
  { label: "POLICY", x: "78%", y: "13%", color: "#ffba70" },
  { label: "TOOLS", x: "78%", y: "72%", color: "#bc8cff" },
];

export function SignalOrbit() {
  return (
    <div className="relative mx-auto h-[390px] w-[390px] max-w-full" aria-hidden="true">
      <div className="absolute inset-[3%] rounded-full border border-white/[0.11]" />
      <div className="absolute inset-[17%] rounded-full border border-dashed border-white/[0.12]" />
      <div className="absolute inset-[31%] rounded-full border border-white/[0.1]" />
      <div className="absolute left-1/2 top-1/2 h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2 rounded-[34px] border border-primary/30 bg-primary/[0.12] p-3 shadow-[0_0_50px_var(--color-primary)] backdrop-blur-sm">
        <div className="grid h-full place-items-center rounded-[24px] border border-primary/30 bg-card">
          <div className="relative grid h-12 w-12 place-items-center rounded-[17px] bg-primary">
            <span className="absolute h-[25px] w-[25px] rounded-full border-[4px] border-white" />
            <span className="absolute h-2.5 w-2.5 rounded-full bg-white" />
          </div>
        </div>
      </div>
      {nodes.map((node) => (
        <div key={node.label} className="absolute" style={{ left: node.x, top: node.y }}>
          <span className="absolute -inset-3 rounded-full opacity-40 blur-xl" style={{ background: node.color }} />
          <div className="relative rounded-full border border-white/15 bg-card/85 px-3 py-2 font-mono text-[10px] tracking-[0.13em] text-white/80 backdrop-blur-md">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: node.color }} />{node.label}
          </div>
        </div>
      ))}
      <div className="absolute bottom-[7%] left-[22%] rounded-lg border border-white/10 bg-card/70 px-3 py-2 font-mono text-[10px] text-primary backdrop-blur">↗ ACTIVE</div>
    </div>
  );
}
