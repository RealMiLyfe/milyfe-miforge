// Thin amber strip on EVERY page while this is a local demo.
// Remove at Go-Live (tracked in docs/brand.md "Deferred to Go-Live").
export default function DemoBanner() {
  return (
    <div
      className="bg-warn px-3 py-1 text-center text-[12px] font-semibold leading-tight text-charcoal"
      role="status"
    >
      Local demo — not live. All data is fake except Client #001 reference.
    </div>
  );
}
