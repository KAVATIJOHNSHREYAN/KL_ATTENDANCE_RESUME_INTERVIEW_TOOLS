import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Screenshot Attendance Calculator | KL University",
  description: "Upload your attendance screenshot to automatically calculate percentage and check eligibility. OCR-powered attendance analysis.",
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
