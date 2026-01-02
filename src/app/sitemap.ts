import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getBaseUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/explorer`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
  
  // Where to go in month pages (1-12)
  const monthPages: MetadataRoute.Sitemap = Array.from({ length: 12 }, (_, i) => ({
    url: `${baseUrl}/where-to-go-in/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  
  // Best time to visit country pages
  let countryPages: MetadataRoute.Sitemap = [];
  try {
    const countries = await prisma.country.findMany({
      select: { code: true },
    });
    
    countryPages = countries.map((country) => ({
      url: `${baseUrl}/best-time-to-visit/${country.code.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap: Failed to fetch countries", error);
  }
  
  return [...staticPages, ...monthPages, ...countryPages];
}
