import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Welcome | KL University Attendance Calculator",
  description: "Get started with the KL University Attendance Calculator. Choose between Simple, LTPS, or Screenshot calculators to check your exam eligibility.",
  alternates: {
    canonical: '/welcome',
  },
}

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
