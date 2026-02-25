import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "ERP Login | KL University Attendance Calculator",
  description: "Login to KL University ERP to fetch your attendance and timetable details automatically.",
  keywords: ['KL ERP Login', 'Student Portal Login', 'KL University Login', 'ERP Attendance', 'Secure Login'],
  alternates: {
    canonical: '/login',
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

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
