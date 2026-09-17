export default function ProductLoading() {
  return (
    <div style={{ paddingTop: 72, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Breadcrumb skeleton */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32 }}>
          <div className="skeleton" style={{ height: 12, width: 60, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 12, width: 8, borderRadius: 4 }} />
          <div className="skeleton" style={{ height: 12, width: 120, borderRadius: 4 }} />
        </div>

        {/* Main layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* Left: image gallery */}
          <div>
            <div
              className="skeleton"
              style={{ height: 420, borderRadius: 12, marginBottom: 12 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 72, width: 72, borderRadius: 8, flexShrink: 0 }}
                />
              ))}
            </div>
          </div>

          {/* Right: product info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="skeleton" style={{ height: 14, width: 80, borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 34, width: "85%", borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 34, width: "60%", borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 44, width: 140, borderRadius: 6, marginTop: 8 }} />
            <div style={{ marginTop: 8 }}>
              <div className="skeleton" style={{ height: 12, width: 120, borderRadius: 4, marginBottom: 12 }} />
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 12, width: 100, borderRadius: 4 }} />
                </div>
              ))}
            </div>
            <div className="skeleton" style={{ height: 48, borderRadius: 8, marginTop: 8 }} />
            <div className="skeleton" style={{ height: 48, borderRadius: 8 }} />
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
