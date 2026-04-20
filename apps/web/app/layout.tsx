import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Alpine Forge — RAG demo",
  description: "A retrieval-augmented chat over a small product catalog and support docs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-primary text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
