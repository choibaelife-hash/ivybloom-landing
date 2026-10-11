type FAQItem = { key?: string; _key?: string; question?: string; answer?: string };

export default function JournalFAQ({ items }: { items: FAQItem[] }) {
  if (!items.length) return null;
  return (
    <section aria-label="Frequently asked questions" style={{ marginTop: "3rem", background: "rgba(188,142,83,0.045)", borderRadius: "16px", padding: "1.8rem 2rem" }}>
      <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#bc8e53", margin: "0 0 1.2rem" }}>FAQ</p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((item, i) => (
          <div key={item.key || item._key || i} id={item.key || item._key ? `faq-${item.key || item._key}` : undefined}
            style={{ padding: "1rem 0", borderBottom: i < items.length - 1 ? "0.5px solid rgba(35,25,22,0.09)" : "none" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#231916", lineHeight: 1.5, margin: "0 0 0.4rem" }}>{item.question}</h3>
            <p style={{ fontSize: "13px", color: "rgba(35,25,22,0.72)", lineHeight: 1.75, margin: 0 }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
