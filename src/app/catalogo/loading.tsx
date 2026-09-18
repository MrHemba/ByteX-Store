export default function CatalogoLoading() {
  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header skeleton */}
        <div style={{ marginBottom: 32 }}>
          <div className="skeleton" style={{ height: 12, width: 160, borderRadius: 4, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 30, width: 280, borderRadius: 6, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 14, width: 200, borderRadius: 4 }} />
        </div>

        {/* Category pills skeleton */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {[70, 90, 60, 80, 85, 75, 130].map((w, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 32, width: w, borderRadius: 20 }}
            />
          ))}
        </div>

        {/* Products grid skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                borderRadius: 10,
                overflow: "hidden",
                background: "var(--bg-card)",
                border: "1px solid var(--border-solid)",
                opacity: 1 - i * 0.055,
              }}
            >
              <div className="skeleton" style={{ height: 196 }} />
              <div style={{ padding: "14px 16px 16px" }}>
                <div className="skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 8 }} />
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
