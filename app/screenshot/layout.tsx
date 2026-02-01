import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Screenshot Attendance Calculator | KL University",
  description: "Upload your attendance screenshot to automatically calculate percentage and check eligibility. OCR-powered attendance analysis.",
  keywords: ['Screenshot Attendance', 'OCR Attendance', 'Image to Attendance', 'KL University Screenshot'],
  alternates: {
    canonical: '/screenshot',
  },
}

export default function ScreenshotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
