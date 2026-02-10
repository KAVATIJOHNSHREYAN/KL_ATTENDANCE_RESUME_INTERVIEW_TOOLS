'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RefreshCw, LogIn, AlertCircle, Loader2, Calendar, BookOpen } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import Script from 'next/script'

type LoginStep = 'login' | 'select-sem'

interface SemesterOption {
  value: string
  label: string
}

export default function LoginPage() {
  const router = useRouter()
  // Login State
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaImage, setCaptchaImage] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  
  // App State
  const [loading, setLoading] = useState(false)
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState('')
  const [step, setStep] = useState<LoginStep>('login')
  
  // Selection State
  const [academicYears, setAcademicYears] = useState<SemesterOption[]>([])
  const [semesters, setSemesters] = useState<SemesterOption[]>([])
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSem, setSelectedSem] = useState('')
  const [csrfToken, setCsrfToken] = useState('')

  const processImageForOCR = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(blob)
      img.src = url
      
      img.onload = () => {
          // Upscale image to improve OCR recognition of small/pixelated text
          // Uniform Scaling (4.0x) preserves horizontal stroke thickness (fixes 't' -> 'l')
          // while Gamma 0.5 handles the thinning of bold text.
          const scaleX = 4.0
          const scaleY = 4.0 
          const padding = 40
          const canvas = document.createElement('canvas')
        canvas.width = (img.width * scaleX) + (padding * 2)
        canvas.height = (img.height * scaleY) + (padding * 2)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          URL.revokeObjectURL(url)
          reject(new Error('Canvas context not available'))
          return
        }
        
        // Fill white background first (for padding)
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Removed Blur: It reduced visibility too much
        
        // Use high quality scaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, padding, padding, img.width * scaleX, img.height * scaleY)
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Preprocess: Red Channel Inversion + Linear Contrast Boost
        // Goal: Restore visibility while maintaining separation
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          
          // 1. Red Channel Inversion
          // Pink (R=255) -> 0 (Black)
          // Black (R=0) -> 255 (White)
          let val = 255 - r
          
          // 2. Contrast Boost (Linear Level Adjustment)
          // Previous Gamma 0.5 washed out the text (gray).
          // We need to make the text BLACK again.
          // Cut off bottom noise (imperfections in pink) and stretch.
          // val = (val - black_point) * gain
          
          val = (val - 40) * 1.3
          
          // Clamp
          if (val < 0) val = 0
          if (val > 255) val = 255
          
          data[i] = val
          data[i + 1] = val
          data[i + 2] = val
          // Alpha remains unchanged
        }
         
         // Removed Sharpening
         
         ctx.putImageData(imageData, 0, 0)
        const base64 = canvas.toDataURL('image/png')
        URL.revokeObjectURL(url)
        resolve(base64)
      }
      
      img.onerror = (err) => {
        URL.revokeObjectURL(url)
        reject(err)
      }
    })
  }

  const fetchCaptcha = async (preserveError = false) => {
    setCaptchaLoading(true)
    if (!preserveError) setError(null)
    setCaptcha('') // Clear previous captcha
    
    try {
      const response = await fetch('/api/captcha')
      if (!response.ok) throw new Error('Failed to load captcha')
      
      const sid = response.headers.get('x-session-id')
      if (sid) setSessionId(sid)

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setCaptchaImage(imageUrl)

      // Auto-solve captcha with fallback strategy
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      
      reader.onloadend = async () => {
        const originalBase64 = reader.result as string
        let processedBase64: string | null = null

        try {
          processedBase64 = await processImageForOCR(blob)
        } catch (processErr) {
          console.warn('Image preprocessing failed', processErr)
        }

        // Helper to call API
        const solve = async (img: string) => {
            const res = await fetch('/api/solve-captcha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: img })
            })
            return await res.json()
        }

        let solvedText = ''

        // 1. Try Processed Image first (Optimized for OCR)
        if (processedBase64) {
            try {
                const data = await solve(processedBase64)
                if (data.success && data.text) {
                    solvedText = data.text
                }
            } catch (e) { console.error('Processed OCR failed', e) }
        }

        // 2. If failed, fallback to Original Image
        if (!solvedText) {
            console.log('Processed image yielded no text, trying original...')
            try {
                const data = await solve(originalBase64)
                if (data.success && data.text) {
                    solvedText = data.text
                }
            } catch (e) { console.error('Original OCR failed', e) }
        }

        if (solvedText) {
            setCaptcha(solvedText)
        }
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load CAPTCHA. Please try again.')
    } finally {
      setCaptchaLoading(false)
    }
  }

  useEffect(() => {
    fetchCaptcha()
    // Check for saved credentials
    const savedUser = Cookies.get('remember_username')
    const savedPass = Cookies.get('remember_password')
    if (savedUser && savedPass) {
      setUsername(savedUser)
      setPassword(savedPass)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password || !captcha) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          username,
          password,
          captcha
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Handle "Remember Me"
      if (rememberMe) {
        Cookies.set('remember_username', username, { expires: 30 }) // 30 days
        Cookies.set('remember_password', password, { expires: 30 }) // 30 days
      } else {
        Cookies.remove('remember_username')
        Cookies.remove('remember_password')
      }

      // Update Session & Token
      if (data.sessionId) setSessionId(data.sessionId)
      setCsrfToken(data.csrfToken)
      
      // Set Options
      setAcademicYears(data.academicYears || [])
      setSemesters(data.semesters || [])
      
      // Set Defaults (Try to pick meaningful defaults)
      const savedYear = Cookies.get('remember_academic_year')
      const savedSem = Cookies.get('remember_semester')

      if (data.academicYears && data.academicYears.length > 0) {
          const foundYear = savedYear && data.academicYears.find((y: SemesterOption) => y.value === savedYear)
          if (foundYear) {
              setSelectedYear(savedYear)
          } else {
              // Default to the last one (usually latest)
              setSelectedYear(data.academicYears[data.academicYears.length - 1].value)
          }
      }
      if (data.semesters && data.semesters.length > 0) {
          const foundSem = savedSem && data.semesters.find((s: SemesterOption) => s.value === savedSem)
          if (foundSem) {
              setSelectedSem(savedSem)
          } else {
              // Default to Even sem if available (usually 2), else last one
              const evenSem = data.semesters.find((s: SemesterOption) => s.label.toLowerCase().includes('even'))
              setSelectedSem(evenSem ? evenSem.value : data.semesters[data.semesters.length - 1].value)
          }
      }

      // Move to next step
      setStep('select-sem')

    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials and try again.')
      // Refresh captcha on failure
      fetchCaptcha(true)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchAttendance = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
        const response = await fetch('/api/fetch-attendance', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'x-session-id': sessionId 
            },
            body: JSON.stringify({ 
                csrfToken, 
                academicYear: selectedYear, 
                semesterId: selectedSem 
            })
        })
        
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch attendance')
            
        if (data.attendanceData && data.attendanceData.length > 0) {
            // Store in localStorage (preferred for larger data) and Cookie (fallback/middleware)
            // Construct object to match Dashboard expectation (supporting both camelCase and snake_case)
            const storageData = JSON.stringify({
                attendance_data: data.attendanceData,
                attendanceData: data.attendanceData,
                studentName: 'Student'
            });
            
            localStorage.setItem('attendanceData', storageData);
            Cookies.set('attendanceData', storageData, { expires: 1/24 }); // Might fail if too large
            
            // Save preferences
            Cookies.set('remember_academic_year', selectedYear, { expires: 365 })
            Cookies.set('remember_semester', selectedSem, { expires: 365 })

            router.push('/dashboard')
        } else {
            throw new Error('No results found')
        }
    } catch (err: any) {
        setError(err.message)
    } finally {
        setLoading(false)
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'KL ERP Login',
    description: 'Secure login to KL University ERP to fetch attendance and timetable details automatically.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Script
        id="login-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="gradient-glow">
          <Card className="w-full shadow-lg border-red-500/20 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pt-6">
              <div className="relative inline-block mb-2 mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold font-poppins">
                  KL ERP Attendance Calculator
                </h1>
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <CardDescription className="font-outfit">
                {step === 'login' 
                  ? 'Enter your credentials to access attendance details' 
                  : 'Select Academic Year and Semester'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Student ID</Label>
                    <Input
                      id="username"
                      placeholder="Enter your ID Number"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      className="border-red-500/20 focus:border-red-500/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="border-red-500/20 focus:border-red-500/50"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-red-500/20 text-red-600 focus:ring-red-500/50 accent-red-600"
                    />
                    <Label 
                      htmlFor="rememberMe" 
                      className="text-sm font-normal text-muted-foreground cursor-pointer select-none"
                    >
                      Remember me
                    </Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="captcha">Captcha</Label>
                    <div className="flex gap-2">
                      <Input
                        id="captcha"
                        placeholder="Enter Captcha"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        disabled={loading}
                        className="flex-1 border-red-500/20 focus:border-red-500/50"
                      />
                      <div className="relative w-32 h-10 bg-muted rounded-md overflow-hidden flex items-center justify-center border border-red-500/20">
                        {captchaLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        ) : captchaImage ? (
                          <img 
                            src={captchaImage} 
                            alt="Captcha" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">No Image</span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fetchCaptcha()}
                        disabled={loading || captchaLoading}
                        className="border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
                      >
                        <RefreshCw className={`h-4 w-4 ${captchaLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 text-center">
                      Note: Auto-fill is experimental and may not work for all captchas. Please verify before logging in.
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleFetchAttendance} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <div className="relative">
                      <select
                        id="academicYear"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full h-10 rounded-md border border-red-500/20 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        disabled={loading}
                      >
                        {academicYears.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <div className="relative">
                      <select
                        id="semester"
                        value={selectedSem}
                        onChange={(e) => setSelectedSem(e.target.value)}
                        className="w-full h-10 rounded-md border border-red-500/20 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        disabled={loading}
                      >
                        {semesters.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <BookOpen className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium mt-4" 
                    type="submit" 
                    disabled={loading}
                  >
                     {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching Attendance...
                      </>
                    ) : (
                      <>
                        Get Attendance
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground"
                    onClick={() => setStep('login')}
                    disabled={loading}
                  >
                    Back to Login
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center text-xs text-muted-foreground text-center font-outfit">
              Note: This connects to the university ERP system. Your credentials are processed securely.
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
