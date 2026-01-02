import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ZenTrip Atlas - Discover Your Perfect Trip";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)",
            opacity: 0.1,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 60,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 28, color: "white" }}>🌍</span>
            </div>
            <span
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: "#1e293b",
                letterSpacing: "-0.02em",
              }}
            >
              ZenTrip Atlas
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: 32,
              color: "#475569",
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Discover your perfect destination with real climate data
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 48,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 32px",
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: 16,
                border: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 700, color: "#6366f1" }}>24+</span>
              <span style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Destinations</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 32px",
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: 16,
                border: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 700, color: "#14b8a6" }}>12</span>
              <span style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Months Data</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px 32px",
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: 16,
                border: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 700, color: "#f59e0b" }}>100</span>
              <span style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Max Score</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16, color: "#94a3b8" }}>
            Plan your journey with calm confidence
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
