import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Simple Attendance Calculator | KL University",
  description: "Calculate your simple attendance percentage based on total classes and attended classes. Check your eligibility for exams.",
  alternates: {
    canonical: '/simple',
  },
}

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
