/**
 * Smoke test script.
 * Tests key endpoints when server is running.
 * 
 * Usage: pnpm smoke
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

interface TestResult {
  route: string;
  status: number | string;
  ok: boolean;
  time: number;
}

async function testRoute(route: string): Promise<TestResult> {
  const url = `${BASE_URL}${route}`;
  const start = Date.now();
  
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "ZenTrip-SmokeTest/1.0" },
    });
    
    return {
      route,
      status: response.status,
      ok: response.ok,
      time: Date.now() - start,
    };
  } catch (error) {
    return {
      route,
      status: error instanceof Error ? error.message : "Unknown error",
      ok: false,
      time: Date.now() - start,
    };
  }
}

async function testPostRoute(route: string, body: object): Promise<TestResult> {
  const url = `${BASE_URL}${route}`;
  const start = Date.now();
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "User-Agent": "ZenTrip-SmokeTest/1.0",
      },
      body: JSON.stringify(body),
    });
    
    return {
      route: `POST ${route}`,
      status: response.status,
      ok: response.ok || response.status === 400, // 400 is expected for validation
      time: Date.now() - start,
    };
  } catch (error) {
    return {
      route: `POST ${route}`,
      status: error instanceof Error ? error.message : "Unknown error",
      ok: false,
      time: Date.now() - start,
    };
  }
}

async function main() {
  console.log("\n🧪 ZenTrip Atlas - Smoke Tests\n");
  console.log(`Testing: ${BASE_URL}`);
  console.log("=".repeat(60));
  
  const routes = [
    "/",
    "/explorer",
    "/about",
    "/saved",
    "/country/CO?month=1",
    "/where-to-go-in/1",
    "/where-to-go-in/12",
    "/best-time-to-visit/co",
    "/sitemap.xml",
    "/robots.txt",
  ];
  
  const results: TestResult[] = [];
  
  // Test GET routes
  for (const route of routes) {
    const result = await testRoute(route);
    results.push(result);
    
    const statusStr = typeof result.status === "number" ? result.status : "ERR";
    const icon = result.ok ? "✅" : "❌";
    console.log(`${icon} ${statusStr} ${route} (${result.time}ms)`);
  }
  
  // Test POST routes
  const postTests = [
    { route: "/api/subscribe", body: { email: "test@example.com", sourcePage: "smoke-test" } },
    { route: "/api/track", body: { event: "page_view", path: "/smoke-test" } },
  ];
  
  for (const test of postTests) {
    const result = await testPostRoute(test.route, test.body);
    results.push(result);
    
    const statusStr = typeof result.status === "number" ? result.status : "ERR";
    const icon = result.ok ? "✅" : "❌";
    console.log(`${icon} ${statusStr} ${result.route} (${result.time}ms)`);
  }
  
  console.log("=".repeat(60));
  
  const passed = results.filter((r) => r.ok).length;
  const total = results.length;
  
  console.log(`\n${passed}/${total} tests passed\n`);
  
  if (passed < total) {
    console.log("❌ Some tests failed. Check server logs.\n");
    process.exit(1);
  }
  
  console.log("✅ All smoke tests passed!\n");
}

main().catch((error) => {
  console.error("Smoke test error:", error);
  process.exit(1);
});
