"use client";

export default function About() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About</div>
        <h1 className="mt-4 text-5xl font-extrabold tracking-tight leading-[1.05]">The best salesperson a small business can hire never sleeps and remembers every price.</h1>
        <div className="mt-10 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>Ringly started when we watched a hairdresser miss $2,000 of Saturday bookings because 32 WhatsApp messages piled up during the day and she couldn&apos;t answer them until 9pm.</p>
          <p>The technology to answer those messages instantly — in her voice, with her prices, on her calendar — already existed. It just hadn&apos;t been packaged for someone who runs a business rather than a Kubernetes cluster.</p>
          <p>So we built it. Two founders, a growing team, and a very simple rule: if it takes more than ten minutes to set up, we haven&apos;t finished.</p>
        </div>
      </section>
      <section className="bg-[color:var(--surface-2)] border-y border-border py-16">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-3 gap-6">
          {[
            { n: "500+", l: "Businesses on the platform" },
            { n: "3.2M", l: "Messages answered last month" },
            { n: "$14M", l: "In bookings & orders influenced" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-white p-8">
              <div className="font-mono text-4xl font-bold">{s.n}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
