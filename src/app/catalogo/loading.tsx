export default function CatalogoLoading() {
  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>

      {/* Header skeleton */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-solid)", padding: "28px 24px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div className="skeleton" style={{ height: 10, width: 140, borderRadius: 4, marginBottom: 10 }} />
              <div className="skeleton" style={{ height: 34, width: 260, borderRadius: 6, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: 160, borderRadius: 4 }} />
            </div>
            <div className="skeleton" style={{ height: 42, width: 340, borderRadius: 10 }} />
          </div>
        </div>
      </div>

      {/* Category tabs skeleton */}
      <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-solid)", padding: "10px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 6 }}>
          {[60, 80, 50, 95, 85, 72, 90].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 32, width: w, borderRadius: 20 }} />
          ))}
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div style={{ borderBottom: "1px solid var(--border-solid)", padding: "10px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="skeleton" style={{ height: 32, width: 90, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 32, width: 110, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 32, width: 130, borderRadius: 8 }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="skeleton" style={{ height: 32, width: 150, borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 32, width: 66, borderRadius: 8 }} />
          </div>
        </div>
      </div>

      {/* Products grid skeleton */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              borderRadius: 10, overflow: "hidden",
              background: "var(--bg-card)", border: "1px solid var(--border-solid)",
              opacity: 1 - i * 0.055,
            }}>
              <div className="skeleton" style={{ height: 180 }} />
              <div style={{ padding: "14px 16px 16px" }}>
                <div className="skeleton" style={{ height: 10, width: 80, borderRadius: 4, marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 11, width: "65%", borderRadius: 4, marginBottom: 18 }} />
                <div className="skeleton" style={{ height: 22, width: "45%", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
