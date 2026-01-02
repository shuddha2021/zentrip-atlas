import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";
import { getStaticCountry } from "@/data/countries.static";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const alt = "Country Travel Guide - ZenTrip Atlas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function fToC(f: number): number {
  return Math.round((f - 32) * (5 / 9));
}

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function Image({ params }: PageProps) {
  const { code: rawCode } = await params;
  const code = (rawCode ?? "").toUpperCase().trim();
  
  // Fetch country and current month climate
  const currentMonth = new Date().getMonth() + 1;
  
  // Use static data as fallback for country name/region
  const staticCountry = getStaticCountry(code);
  let countryName = staticCountry?.name ?? code;
  let region = staticCountry?.region ?? "Explore";
  let climate: {
    score: number;
    tempMinF: number;
    tempMaxF: number;
    rainMm: number;
    crowdLevel: string;
    budgetTier: string;
  } | null = null;
  
  try {
    const country = await prisma.country.findUnique({ where: { code } });
    if (country) {
      countryName = country.name;
      region = country.region;
    }
    
    const climateData = await prisma.climate.findUnique({
      where: { countryCode_month: { countryCode: code, month: currentMonth } },
    });
    if (climateData) {
      climate = climateData;
    }
  } catch {
    // Use static defaults
  }

  const score = climate?.score ?? 0;
  const tempRange = climate 
    ? `${fToC(climate.tempMinF)}–${fToC(climate.tempMaxF)}°C` 
    : "—";
  const rainfall = climate?.rainMm ?? 0;
  const crowds = climate?.crowdLevel ?? "moderate";
  const budget = climate?.budgetTier ?? "$$";

  // Score color
  const scoreColor = score >= 85 ? "#059669" : score >= 70 ? "#d97706" : "#64748b";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: 48,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              {countryName}
            </span>
            <span
              style={{
                fontSize: 28,
                color: "#6366f1",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              {region}
            </span>
          </div>
          
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 22, color: "white" }}>🌍</span>
            </div>
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: "#475569",
              }}
            >
              ZenTrip Atlas
            </span>
          </div>
        </div>

        {/* Month badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              background: "#14b8a6",
              borderRadius: 20,
              color: "white",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            {MONTHS[currentMonth - 1]}
          </div>
          <span style={{ color: "#64748b", fontSize: 18 }}>
            Travel conditions
          </span>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flex: 1,
          }}
        >
          {/* Score - larger */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 40px",
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: 24,
              border: "2px solid rgba(0, 0, 0, 0.06)",
              minWidth: 180,
            }}
          >
            <span style={{ fontSize: 72, fontWeight: 700, color: scoreColor }}>
              {score}
            </span>
            <span style={{ fontSize: 16, color: "#64748b", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Travel Score
            </span>
          </div>

          {/* Other stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", gap: 16 }}>
              {/* Temperature */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px 28px",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 20,
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 32, fontWeight: 700, color: "#be123c" }}>
                  {tempRange}
                </span>
                <span style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                  Temperature
                </span>
              </div>

              {/* Rainfall */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px 28px",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 20,
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 32, fontWeight: 700, color: "#1d4ed8" }}>
                  {rainfall}mm
                </span>
                <span style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                  Rainfall
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              {/* Crowds */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px 28px",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 20,
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 700, color: "#475569", textTransform: "capitalize" }}>
                  {crowds}
                </span>
                <span style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                  Crowds
                </span>
              </div>

              {/* Budget */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px 28px",
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 20,
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>
                  {budget}
                </span>
                <span style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                  Budget Tier
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 24,
          }}
        >
          <span style={{ fontSize: 16, color: "#94a3b8" }}>
            Plan your journey with calm confidence • zentripatlas.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
