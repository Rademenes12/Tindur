import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tindur | Operator Dashboard",
  description: "Zarządzaj swoimi wycieczkami i rezerwacjami",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 lg:pl-64 flex flex-col">
            <Header />
            <main className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}