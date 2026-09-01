import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Pathway — Internship Matches Built Around You",
  description:
    "Find internships matched to your skills, interests, and preferences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lexend:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <NavBar />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
