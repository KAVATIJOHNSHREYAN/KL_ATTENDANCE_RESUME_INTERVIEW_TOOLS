import { NextRequest, NextResponse } from 'next/server'
import { loginAndFetchSemesters, ScraperSession } from '@/lib/scraper'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, captcha } = body
    
    // Get session ID from header (preferred) or body (fallback)
    const sessionId = request.headers.get('x-session-id') || body.sessionId

    if (!username || !password || !captcha) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!sessionId) {
      // Fallback to mock login if no session ID provided (and user knows it's mock)
      // But for now, we enforce session ID because we need cookies
      return NextResponse.json(
        { success: false, message: 'Session expired. Please refresh captcha.' },
        { status: 400 }
      )
    }

    // Decode session
    let session: ScraperSession
    try {
      const sessionStr = Buffer.from(sessionId, 'base64').toString('utf-8')
      session = JSON.parse(sessionStr)
    } catch (e) {
      console.error('Session parsing failed:', e);
      return NextResponse.json(
        { success: false, message: 'Invalid session. Please refresh captcha.' },
        { status: 400 }
      )
    }

    // Attempt Login
    const result = await loginAndFetchSemesters(username, password, captcha, session)

    // Encode updated session
    const updatedSessionId = Buffer.from(JSON.stringify(result.session)).toString('base64')

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      sessionId: updatedSessionId, // Send back updated session with new cookies
      csrfToken: result.csrfToken,
      academicYears: result.academicYears,
      semesters: result.semesters,
      studentName: 'Student' // Placeholder, could be scraped
    })

  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Login failed' 
      },
      { status: 401 }
    )
  }
}
