import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixel State, Bendigo website agency",
  description:
    "Pixel State builds websites Bendigo businesses actually own. Level the playing field with a fixed quote, full code handover and no lock in."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
