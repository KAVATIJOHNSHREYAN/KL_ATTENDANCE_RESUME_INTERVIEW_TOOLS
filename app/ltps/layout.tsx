import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "LTPS Attendance Calculator | KL University",
  description: "Advanced LTPS (Lecture, Tutorial, Practical, Skilling) attendance calculator for KL University students. Calculate weighted attendance.",
  keywords: ['LTPS Calculator', 'Lecture Tutorial Practical Skilling', 'Weighted Attendance', 'KL University LTPS'],
  alternates: {
    canonical: '/ltps',
  },
}

export default function LTPSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
