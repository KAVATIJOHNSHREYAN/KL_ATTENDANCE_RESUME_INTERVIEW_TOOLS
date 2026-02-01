import type { ReactNode } from "react"
import "@/app/globals.css"
import { Poppins, Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Footer } from "@/components/footer"
import { Metadata } from "next"

// Force static generation
// export const dynamic = "force-static"

// Font for headings
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
})

// Font for body text
const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
})

export const metadata: Metadata = {
  title: "KL University Attendance Calculator",
  description: "Calculate your attendance percentage and check eligibility for KL University exams based on university policy. Simple and LTPS calculators available.",
  generator: 'Next.js',
  applicationName: 'KL University Attendance Calculator',
  referrer: 'origin-when-cross-origin',
  keywords: ['KL University', 'attendance calculator', 'exam eligibility', 'university attendance', 'LTPS calculator', 'KL ERP', 'KL University ERP', 'Student Portal', 'Condonation', 'Detention', 'Attendance Percentage'],
  authors: [{ name: 'KL University' }],
  creator: 'KL University',
  publisher: 'KL University',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://klattendance.vercel.app'),
  openGraph: {
    title: 'KL University Attendance Calculator',
    description: 'Calculate your attendance percentage and check eligibility for KL University exams based on university policy.',
    url: 'https://klattendance.vercel.app',
    siteName: 'KL University Attendance Calculator',
    images: [
      {
        url: '/KL_University_logo.svg',
        width: 800,
        height: 600,
        alt: 'KL University Attendance Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KL University Attendance Calculator',
    description: 'Calculate your attendance percentage and check eligibility for KL University exams based on university policy.',
    images: ['/KL_University_logo.svg'],
  },
  verification: {
    google: 'YKmd0c6z13AOdpU7THbo1wqIqG4BBzjilNPhP-5_bps',
  },
  icons: {
    icon: '/KL_University_Favicon.svg',
    shortcut: '/KL_University_Favicon.svg',
    apple: '/KL_University_Favicon.svg',
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: 'any',
        url: '/KL_University_Favicon.svg',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className={`${poppins.variable} ${outfit.variable} font-outfit overflow-x-hidden flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Header />
          <main className="container mx-auto px-4 sm:px-6 py-8 pt-20 md:pt-24 flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}