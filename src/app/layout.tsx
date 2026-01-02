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
      <body className="antialiased text-gray-900">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
