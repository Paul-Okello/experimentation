import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "jspsych/css/jspsych.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Experiment",
  description: "Cognition Exersise",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
