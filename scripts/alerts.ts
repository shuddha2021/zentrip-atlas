/**
 * Alerts runner script.
 * Reads active subscribers and prints what would be sent.
 * 
 * Usage: pnpm alerts:run
 * 
 * In production, wire this to a cron job.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("\n🔔 ZenTrip Atlas - Alerts Runner\n");
  console.log("=".repeat(50));
  
  // Get active, confirmed subscribers
  const subscribers = await prisma.emailSubscriber.findMany({
    where: {
      isActive: true,
      confirmedAt: { not: null },
    },
    orderBy: { createdAt: "desc" },
  });
  
  console.log(`\n📧 Found ${subscribers.length} active subscriber(s)\n`);
  
  if (subscribers.length === 0) {
    console.log("No subscribers to notify. Exiting.\n");
    return;
  }
  
  // Get current month's top destinations
  const currentMonth = new Date().getMonth() + 1;
  const topDestinations = await prisma.climate.findMany({
    where: { month: currentMonth },
    orderBy: { score: "desc" },
    take: 3,
    include: { country: true },
  });
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = monthNames[currentMonth - 1];
  
  console.log(`📅 Current month: ${monthName}`);
  console.log(`🌍 Top destinations this month:`);
  topDestinations.forEach((d, i) => {
    console.log(`   ${i + 1}. ${d.country.name} (score: ${d.score})`);
  });
  console.log("");
  
  // Simulate sending emails
  console.log("📨 Would send emails to:\n");
  
  for (const sub of subscribers) {
    console.log(`   To: ${sub.email}`);
    console.log(`   Subject: Your ${monthName} Travel Picks from ZenTrip Atlas`);
    console.log(`   Content: Top picks - ${topDestinations.map(d => d.country.name).join(", ")}`);
    console.log(`   Subscribed from: ${sub.sourcePage || "unknown"}`);
    console.log("");
  }
  
  console.log("=".repeat(50));
  console.log("\n✅ Dry run complete. No emails were actually sent.");
  console.log("   To send real emails, configure RESEND_API_KEY.\n");
}

main()
  .catch((error) => {
    console.error("Error running alerts:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
