import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "klebe.at — Öffnungszeiten-Aufkleber für Ihr Geschäft",
  description:
    "Professionelle Aufkleber mit Ihren Öffnungszeiten aus Folie statt handgeschriebenem Zettel. Bestellen Sie online, wir kleben in Wien direkt vor Ort.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
