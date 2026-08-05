'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calculator, BookOpen, GraduationCap, Camera, LogIn, Sparkles, ArrowRight, ShieldCheck, Cpu } from "lucide-react"
import Script from 'next/script'
import { motion } from 'framer-motion'

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
        name: 'Kavati John Shreyan',
        url: 'https://github.com/KAVATIJOHNSHREYAN'
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
    <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16 w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen Attendance System</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-poppins tracking-tight text-foreground"
        >
          Master Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-cyan-400">Attendance</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground font-outfit font-light mt-4 px-2"
        >
          Skip the guesswork. Automatically sync with KL ERP or manually project your exam eligibility with beautiful, visual calculators.
        </motion.p>
      </div>

      {/* Main Grid: Hero ERP Card + Manual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full mb-16">
        
        {/* Featured ERP Sync Card (Takes 1 full column on desktop but stands out visually) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-6 p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent backdrop-blur-md relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full filter blur-[80px] pointer-events-none" />
          
          <div className="md:col-span-3 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <LogIn className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">Recommended Option</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins mb-3">Secure ERP Automated Sync</h2>
              <p className="text-muted-foreground font-outfit mb-6 text-base leading-relaxed">
                Connect directly and securely to the KL ERP. Auto-fetch subject details, conducted hours, and current timetable. Get real-time predictive analytics instantly.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-foreground/80 font-outfit">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                  <span>Secure Local Processing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground/80 font-outfit">
                  <Cpu className="h-4.5 w-4.5 text-emerald-500" />
                  <span>Real-time Timetable Analysis</span>
                </div>
              </div>
            </div>
            
            <div>
              <Link href="/login" prefetch={false}>
                <Button size="lg" className="px-8 shadow-md hover:shadow-lg transition-all group">
                  Connect ERP Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-2 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/40 pt-6 md:pt-0 md:pl-8 z-10">
            <h3 className="font-semibold text-foreground font-poppins mb-4">What you get:</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">1</span>
                <span className="text-muted-foreground">Instantly pulls actual registered attendance data.</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">2</span>
                <span className="text-muted-foreground">Detailed view of LTPS components for all courses.</span>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">3</span>
                <span className="text-muted-foreground">Timetable integration predicts future margins.</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Secondary Grid: Manual Calculators */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Simple Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col h-full"
          >
            <div className="gradient-glow h-full">
              <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/40 bg-card/75 backdrop-blur-sm rounded-2xl p-2">
                <CardHeader>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-3">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-poppins font-semibold text-xl">Simple Calculator</CardTitle>
                  <CardDescription className="font-outfit text-sm">
                    Enter basic totals to find percentages.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow font-outfit text-sm text-muted-foreground">
                  Quickly calculate percentage by supplying overall conducted classes and attended classes. Ideal for a fast check.
                </CardContent>
                <CardFooter className="pt-2">
                  <Link href="/simple" prefetch={false} className="w-full">
                    <Button variant="outline" className="w-full">Open Calculator</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </motion.div>

          {/* LTPS Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col h-full"
          >
            <div className="gradient-glow h-full">
              <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/40 bg-card/75 backdrop-blur-sm rounded-2xl p-2">
                <CardHeader>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-3">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-poppins font-semibold text-xl">LTPS Calculator</CardTitle>
                  <CardDescription className="font-outfit text-sm">
                    Weight-based component calculation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow font-outfit text-sm text-muted-foreground">
                  Compute weighted attendance across Lecture (1.0), Tutorial (0.25), Practical (0.5), and Skilling (0.25) sections.
                </CardContent>
                <CardFooter className="pt-2">
                  <Link href="/ltps" prefetch={false} className="w-full">
                    <Button variant="outline" className="w-full">Open LTPS</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </motion.div>

          {/* OCR Screenshot Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col h-full"
          >
            <div className="gradient-glow h-full">
              <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/40 bg-card/75 backdrop-blur-sm rounded-2xl p-2">
                <CardHeader>
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-3">
                    <Camera className="h-6 w-6" />
                  </div>
                  <CardTitle className="font-poppins font-semibold text-xl">Screenshot OCR</CardTitle>
                  <CardDescription className="font-outfit text-sm">
                    Extract attendance from images.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow font-outfit text-sm text-muted-foreground">
                  Upload screenshot reports directly. Our server-side OCR will automatically extract subject names and hours to save manual input.
                </CardContent>
                <CardFooter className="pt-2">
                  <Link href="/screenshot" prefetch={false} className="w-full">
                    <Button variant="outline" className="w-full">Open Scanner</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Info / Policy Visualizer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="w-full max-w-5xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          <Card className="bg-card/45 backdrop-blur-sm border-border/40 rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-6 w-6 text-blue-500" />
                <CardTitle className="font-poppins font-bold text-lg">Attendance Policy Highlights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 font-outfit">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/15 p-1.5 rounded-lg mt-0.5 text-green-600 dark:text-green-400 font-bold text-xs">
                  85%
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Standard Requirement</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Minimum 85% attendance is required for most programs to write regular examinations without any penalties.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/15 p-1.5 rounded-lg mt-0.5 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  75%
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Condonation Range (75-85%)</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Permitted to write exams upon paying a condonation fee. Medical or extracurricular certificates should be submitted.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500/15 p-1.5 rounded-lg mt-0.5 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  70%
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Law Programs Policy</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">For BBA-LLB, LLB, and LLM: Minimum 70% is standard. The condonation window operates between 65% and 70%.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/45 backdrop-blur-sm border-border/40 rounded-2xl flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-full border-2 border-red-500/80 flex items-center justify-center text-red-500 font-bold text-xs">
                    !
                  </div>
                  <CardTitle className="font-poppins font-bold text-lg">Critical Warnings & Detention</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 font-outfit">
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-1">Detention Risk (&lt;75%)</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Students holding less than 75% attendance (65% for Law) are automatically detained and will not be permitted to take examinations.
                  </p>
                </div>

                <div className="space-y-2.5 mt-2">
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>Absolutely no relaxation below 75% under any standard condition.</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    <span>Submit official medical or duty certificates promptly.</span>
                  </div>
                </div>
              </CardContent>
            </div>
            
            <CardFooter className="pt-2">
              <p className="text-[10px] text-muted-foreground/60 italic border-t border-border/30 pt-2.5 w-full">
                * This calculator is for reference only. Always cross-reference with official ERP portals.
              </p>
            </CardFooter>
          </Card>
          
        </div>
      </motion.div>
    </div>
  )
}
