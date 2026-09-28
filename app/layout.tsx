import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: [ "200", "300", "400", "500", "600", "700", "800",],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "NextStep — Know what to do next",
  description:
    "Turn complicated opportunity documents into personalized requirements, eligibility insights, and actionable checklists.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${plusJakarta.variable} antialiased`}>
        {children}

        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}