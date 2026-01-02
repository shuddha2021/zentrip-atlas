import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenTrip Atlas",
  description: "Discover the best travel destinations for every month",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="j-JpW26Lawchqhk2J6uie2D24iUI6GwS10jmYamIdXU"
        />
      </head>
      <body className="antialiased text-gray-900">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
