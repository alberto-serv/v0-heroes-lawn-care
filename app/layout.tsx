import type React from "react"
import type { Metadata } from "next"
import { Instrument_Sans } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
})

export const metadata: Metadata = {
  title: "Heroes Lawn Care - Professional Lawn Care Services in The Woodlands, TX",
  description:
    "Professional lawn care and landscaping services for residential and commercial properties in The Woodlands, TX and surrounding areas.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", instrumentSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
