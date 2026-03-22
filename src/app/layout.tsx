import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { ReduxProvider } from "@/components/ReduxProvider";
import GlobalSessionHydrator from "@/components/auth/GlobalSessionHydrator";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "TIVIT | Secure Access Experience",
  description: "Aplicação Next.js com autenticação segura, BFF server-side e dashboards por role.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-app-bg font-sans text-app-fg antialiased">
        <ThemeProvider>
          <ReduxProvider>
            <GlobalSessionHydrator />
            <div className="relative min-h-screen overflow-x-clip">
              <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-tivit-red/10 blur-3xl" />
                <div className="absolute bottom-[-8rem] right-[-5rem] h-72 w-72 rounded-full bg-info/10 blur-3xl" />
              </div>
              <Header />
              <main className="mx-auto flex w-full max-w-7xl flex-1 px-[var(--space-shell)] pb-12 pt-6 sm:pt-8">
                {children}
              </main>
            </div>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
