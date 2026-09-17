import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ikukamo-now",
  description: "今すぐ行ける全国お出かけ候補",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
