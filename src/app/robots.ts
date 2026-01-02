import { MetadataRoute } from "next";
import { getBaseUrl, shouldNoIndex } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  // If NOINDEX is set, disallow all
  if (shouldNoIndex()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/_next/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
