import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Dashboard | KL University Attendance Calculator",
  description: "View your attendance dashboard, check subject-wise attendance, and analyze your eligibility status.",
  keywords: ['Student Dashboard', 'Attendance Analysis', 'Subject-wise Attendance', 'KL University Dashboard'],
  alternates: {
    canonical: '/dashboard',
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    }
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
