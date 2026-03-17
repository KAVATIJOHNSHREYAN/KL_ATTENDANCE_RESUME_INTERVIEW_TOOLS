'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calculator, BookOpen, GraduationCap, Camera, LogIn } from "lucide-react"
import Script from 'next/script'

// Force static generation for export

export default function WelcomePage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'KL University Attendance Calculator',
      url: 'https://klattendance.vercel.app/',
      description: 'Calculate your attendance percentage and check eligibility for KL University exams based on the University attendance policy.',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      publisher: {
        '@type': 'Person',
        name: 'Jayakanth Kamisetti',
        url: 'https://jayakanthkamisetti.com'
      },
      about: {
        '@type': 'Thing',
        name: 'KL University attendance policy and exam eligibility'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the minimum attendance required at KL University?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The minimum attendance required for most programs is 85%. For Law programs (BBA-LLB, LLB, LLM), the minimum is 70%.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is Condonation in KL University?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Condonation is a fine that allows students with 75-85% attendance to write exams. For Law programs, this range is 65-70%. Attendance below these thresholds leads to detention.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Medical Certificate accepted for low attendance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, medical certificates are required for attendance consideration, but they typically apply only within the condonation range. No relaxation is given below 75% (65% for Law) under any circumstances.'
          }
        }
      ]
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div 
        className="text-center mb-8 sm:mb-12 w-full px-2"
      >
        <div className="relative inline-block mb-6">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground drop-shadow-sm letter-spacing-tight"
          >
            Attendance Calculator
          </h1>
          <div
            className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-600 rounded-full"
          />
        </div>
        <p 
          className="text-lg sm:text-xl text-muted-foreground font-outfit font-light max-w-2xl mx-auto px-2"
        >
          Calculate your attendance percentage and check eligibility for exams based on the University attendance policy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full max-w-[90rem] px-2">
        <div
          className="flex flex-col h-full transition-transform hover:scale-[1.02]"
        >
          <div className="gradient-glow h-full">
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-red-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 group hover:cursor-pointer">
                  <LogIn className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                  <CardTitle className="relative font-poppins font-semibold">
                    ERP Login
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </CardTitle>
                </div>
                <CardDescription className="font-outfit">
                  Connect to KL ERP to fetch data automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Securely login to university ERP</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Auto-fetch attendance and timetable</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Check eligibility without manual entry</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-2">
                <div className="w-full">
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">Login to ERP</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div
          className="flex flex-col h-full transition-transform hover:scale-[1.02]"
        >
          <div className="gradient-glow h-full">
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-red-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 group hover:cursor-pointer">
                  <Calculator className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                  <CardTitle className="relative font-poppins font-semibold">
                    Simple Attendance Calculator
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </CardTitle>
                </div>
                <CardDescription className="font-outfit">
                  Quick calculation of your attendance percentage
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Enter total classes and classes attended</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Get instant calculation of attendance percentage</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>See eligibility status with color-coded alerts</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-2">
                <div className="w-full">
                  <Link href="/simple">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">Use Simple Calculator</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div
          className="flex flex-col h-full transition-transform hover:scale-[1.02]"
        >
          <div className="gradient-glow h-full">
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-red-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 group hover:cursor-pointer">
                  <BookOpen className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                  <CardTitle className="relative font-poppins font-semibold">
                    LTPS Calculator
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </CardTitle>
                </div>
                <CardDescription className="font-outfit">
                  Calculate attendance with different component weights
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Enter attendance for each component (Lecture, Tutorial, Practical, Skilling)</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>See individual component percentages</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Get the final weighted attendance calculation</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-2">
                <div className="w-full">
                  <Link href="/ltps">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">Use LTPS Calculator</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div
          className="flex flex-col h-full transition-transform hover:scale-[1.02]"
        >
          <div className="gradient-glow h-full">
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-red-500/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2 group hover:cursor-pointer">
                  <Camera className="h-6 w-6 text-red-500 group-hover:scale-110 transition-transform" />
                  <CardTitle className="relative font-poppins font-semibold">
                    Screenshot Calculator
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                  </CardTitle>
                </div>
                <CardDescription className="font-outfit">
                  Upload attendance screenshots for automated calculation
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Upload attendance report screenshots</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Automatic OCR text extraction</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Subject-wise LTPS calculation</span>
                  </li>
                  <li className="flex items-start gap-2 font-outfit">
                    <span className="text-red-500">•</span>
                    <span>Save and manage multiple reports</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto pt-2">
                <div className="w-full">
                  <Link href="/screenshot">
                    <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">Use Screenshot Calculator</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <div
        className="mt-8 sm:mt-12 w-full max-w-5xl px-2"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-red-500/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-6 w-6 text-red-500" />
                <CardTitle className="font-poppins">Attendance Policy Highlights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/10 p-2 rounded-full mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Standard Requirement (≥85%)</h3>
                  <p className="text-sm text-muted-foreground font-outfit">Minimum 85% attendance is required for most university programs to be eligible for exams without fines.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-yellow-500/10 p-2 rounded-full mt-1">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Condonation Range (75-85%)</h3>
                  <p className="text-sm text-muted-foreground font-outfit">Students in this range may be permitted to write exams upon payment of a condonation fee. Medical certificates are often required.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500/10 p-2 rounded-full mt-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Law Programs Special Policy</h3>
                  <p className="text-sm text-muted-foreground font-outfit">For BBA-LLB, LLB, and LLM: Minimum 70%. Condonation range is 65-70%.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-red-500/10">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full border-2 border-red-500 flex items-center justify-center">
                  <span className="text-red-500 font-bold text-xs">!</span>
                </div>
                <CardTitle className="font-poppins">Critical Warnings & Detention</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <h3 className="font-semibold text-red-600 dark:text-red-400 font-poppins mb-1">Detention Risk (&lt;75%)</h3>
                <p className="text-sm text-muted-foreground font-outfit">
                  Students with less than 75% attendance (65% for Law) are generally <strong>detained</strong> from writing examinations.
                </p>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground font-outfit">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>No relaxation below 75% under any circumstances.</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground font-outfit">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>Medical certificates must be submitted promptly.</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground font-outfit">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                    <span>Regular monitoring is the student&apos;s responsibility.</span>
                 </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4 italic border-t border-border pt-2">
                * This calculator is for reference only. Always verify with official university records.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
