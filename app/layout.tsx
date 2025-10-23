import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brandon's Todo App",
  description: "A simple todo app built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen flex-1 p-6 bg-white! select-none`}
      >
        {children}
      </body>
    </html>
  );
}
