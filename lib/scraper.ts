import * as cheerio from 'cheerio';

const ERP_URL = 'https://newerp.kluniversity.in';
const LOGIN_URL = `${ERP_URL}/index.php?r=site%2Flogin`;
const ATTENDANCE_URL = `${ERP_URL}/index.php?r=studentattendance%2Fstudentdailyattendance%2Fsearchgetinput`;
const COURSE_LIST_URL = `${ERP_URL}/index.php?r=studentattendance%2Fstudentdailyattendance%2Fcourselist`;

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface ScraperSession {
  cookies: any[];
  csrfToken: string;
  userAgent: string;
}

export interface CaptchaResponse {
  captchaImage: string; // Base64
  session: ScraperSession;
}

export async function getCaptcha(): Promise<CaptchaResponse> {
  try {
    // 1. Initial Request to Login Page
    const loginRes = await fetch(LOGIN_URL, {
      headers: {
        'User-Agent': USER_AGENT
      }
    });

    const html = await loginRes.text();
    const setCookieHeader = loginRes.headers.get('set-cookie');
    const cookiesMap = parseSetCookie(setCookieHeader);

    // 2. Parse HTML
    const $ = cheerio.load(html);
    
    // Get CSRF Token
    const csrfToken = $('input[name="_csrf"]').val() as string;
    if (!csrfToken) {
      // Try finding it via regex if cheerio fails or structure is different
      const csrfMatch = html.match(/name="_csrf" value="([^"]+)"/);
      if (csrfMatch) {
         // csrfToken = csrfMatch[1]; // variable is const
         throw new Error('CSRF Token found via regex but logic flow needs adjustment - relying on cheerio first');
      }
      throw new Error('CSRF Token not found');
    }

    // Get Captcha Image URL
    const captchaImg = $('#loginFormCaptcha-image');
    const captchaSrc = captchaImg.attr('src');
    
    if (!captchaSrc) {
      throw new Error('Captcha element/source not found');
    }

    const captchaUrl = captchaSrc.startsWith('http') ? captchaSrc : `${ERP_URL}${captchaSrc.startsWith('/') ? '' : '/'}${captchaSrc}`;

    // 3. Fetch Captcha Image
    // Construct cookie header
    const cookieHeader = Object.entries(cookiesMap).map(([k, v]) => `${k}=${v}`).join('; ');

    const imageRes = await fetch(captchaUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Cookie': cookieHeader,
        'Referer': LOGIN_URL
      }
    });

    const imageBuffer = await imageRes.arrayBuffer();
    const captchaBase64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;

    // Update cookies if image response set any
    const imageSetCookie = imageRes.headers.get('set-cookie');
    if (imageSetCookie) {
      const newCookies = parseSetCookie(imageSetCookie);
      Object.assign(cookiesMap, newCookies);
    }

    // Convert cookies map to array format expected by ScraperSession
    const cookies = Object.entries(cookiesMap).map(([name, value]) => ({ name, value }));

    return {
      captchaImage: captchaBase64,
      session: {
        cookies,
        csrfToken,
        userAgent: USER_AGENT
      }
    };
  } catch (error) {
    console.error('getCaptcha Error:', error);
    throw error;
  }
}

export interface SemesterOption {
  value: string;
  label: string;
}

export interface LoginResult {
  success: boolean;
  message: string;
  session: ScraperSession;
  csrfToken: string;
  academicYears: SemesterOption[];
  semesters: SemesterOption[];
}

export async function loginAndFetchSemesters(
  username: string, 
  pass: string, 
  captcha: string, 
  session: ScraperSession
): Promise<LoginResult> {
  // Use HTTP Fetch for Login (faster/stateless)
  const cookieHeader = session.cookies.map(c => `${c.name}=${c.value}`).join('; ');
  
  const params = new URLSearchParams();
  params.append('_csrf', session.csrfToken);
  params.append('LoginForm[username]', username);
  params.append('LoginForm[password]', pass);
  params.append('LoginForm[captcha]', captcha);
  params.append('LoginForm[rememberMe]', '0');
  params.append('login-button', '');

  const loginRes = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Cookie': cookieHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': session.userAgent,
      'Origin': ERP_URL,
      'Referer': LOGIN_URL
    },
    body: params,
    redirect: 'manual' // We want to check the redirect
  });

  let currentCookieHeader = cookieHeader;

  // Check for 302 Redirect (Success)
  if (loginRes.status === 302) {
    const location = loginRes.headers.get('location');
    
    // If redirected to index.php or similar, we are logged in
    const newCookies = parseSetCookie(loginRes.headers.get('set-cookie'));
    currentCookieHeader = mergeCookies(cookieHeader, newCookies);
  } else {
    // Check if we got a 200 OK (which usually means validation error on the page)
    const text = await loginRes.text();
    
    // Check for specific error messages
    if (text.includes('Incorrect username or password') || text.includes('Invalid Username or Password')) {
        throw new Error('Incorrect username or password');
    }
    if (text.includes('verification Code') || text.includes('Invalid Captcha')) {
        throw new Error('Invalid Captcha');
    }
    
    // If it's 200 but not an error we recognize, maybe we are logged in but no redirect?
    // Check for "Logout" link
    if (text.includes('Logout') || text.includes('Sign out')) {
         // We are logged in! Use existing cookies
    } else {
        throw new Error('Login failed: Unknown response or Invalid Credentials');
    }
  }

  // --- Fetch Attendance Page to get Semesters ---
    
  const attendanceRes = await fetch(ATTENDANCE_URL, {
    headers: {
      'Cookie': currentCookieHeader,
      'User-Agent': session.userAgent
    }
  });

  const attendanceHtml = await attendanceRes.text();
  
  // Extract CSRF Token
  const csrfTokenMatch = attendanceHtml.match(/name="_csrf" value="([^"]+)"/);
  const csrfToken = csrfTokenMatch ? csrfTokenMatch[1] : session.csrfToken; // Fallback to session token

  // Parse Academic Years and Semesters
  const $ = cheerio.load(attendanceHtml);
  
  const academicYears: SemesterOption[] = [];
  $('select[name="DynamicModel[academicyear]"] option').each((i, el) => {
    const value = $(el).attr('value');
    const label = $(el).text().trim();
    if (value) academicYears.push({ value, label });
  });

  const semesters: SemesterOption[] = [];
  $('select[name="DynamicModel[semesterid]"] option').each((i, el) => {
    const value = $(el).attr('value');
    const label = $(el).text().trim();
    if (value) semesters.push({ value, label });
  });

  // Update session cookies
  // We need to parse any new cookies from attendanceRes and update session
  const newCookies = parseSetCookie(attendanceRes.headers.get('set-cookie'));
  const updatedCookieString = mergeCookies(currentCookieHeader, newCookies);
  
  // Convert back to array for ScraperSession
  const updatedCookies = updatedCookieString.split('; ').map(c => {
      const [name, value] = c.split('=');
      return { name, value };
  });

  return {
    success: true,
    message: 'Login Successful',
    session: {
        ...session,
        cookies: updatedCookies,
        csrfToken
    },
    csrfToken,
    academicYears,
    semesters
  };
}

export async function fetchAttendanceData(
  session: ScraperSession,
  csrfToken: string,
  academicYear: string,
  semesterId: string
) {
  const cookieHeader = session.cookies.map(c => `${c.name}=${c.value}`).join('; ');

  const ajaxParams = new URLSearchParams();
  ajaxParams.append('_csrf', csrfToken);
  ajaxParams.append('DynamicModel[academicyear]', academicYear);
  ajaxParams.append('DynamicModel[semesterid]', semesterId);
  
  const courseListRes = await fetch(COURSE_LIST_URL, {
    method: 'POST',
    headers: {
        'Cookie': cookieHeader,
        'User-Agent': session.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Origin': ERP_URL,
        'Referer': ATTENDANCE_URL
    },
    body: ajaxParams
  });
  
  const courseListHtml = await courseListRes.text();
  const attendanceData = parseAttendanceHtml(courseListHtml);
  
  return {
    success: true,
    message: 'Attendance Data Fetched Successfully',
    attendanceData: attendanceData
  };
}

// Helper to parse Set-Cookie headers
function parseSetCookie(setCookieHeader: string | null) {
  if (!setCookieHeader) return {};
  const cookies: Record<string, string> = {};
  
  // Split by comma (handling dates in expires is tricky, but simple split might work for Session IDs)
  // A better way for simple session cookies:
  const parts = setCookieHeader.split(/,(?=\s*[^;]+=[^;]+)/);
  
  parts.forEach(part => {
      const firstSemi = part.indexOf(';');
      const pair = (firstSemi > -1 ? part.substring(0, firstSemi) : part).trim();
      const eq = pair.indexOf('=');
      if (eq > -1) {
          const key = pair.substring(0, eq).trim();
          const value = pair.substring(eq + 1).trim();
          cookies[key] = value;
      }
  });
  return cookies;
}

function mergeCookies(oldCookieString: string, newCookies: Record<string, string>) {
    const cookieMap: Record<string, string> = {};
    
    // Parse old cookies
    oldCookieString.split(';').forEach(c => {
        const [key, value] = c.split('=').map(s => s.trim());
        if (key) cookieMap[key] = value;
    });
    
    // Merge new cookies
    Object.assign(cookieMap, newCookies);
    
    return Object.entries(cookieMap)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
}

function parseAttendanceHtml(html: string) {
    const $ = cheerio.load(html);
    const table = $('table').first();
    const headers: string[] = [];
    const data: any[] = [];

    // Get headers
    // Try standard thead > tr > th
    table.find('thead tr th').each((i, el) => {
        headers.push($(el).text().trim());
    });
    
    // If no headers found, try the first row of the table body or just the first tr
    if (headers.length === 0) {
        const firstRow = table.find('tr').first();
        firstRow.find('th, td').each((i, el) => {
            headers.push($(el).text().trim());
        });
    }

    // Get data
    // If we used the first row as header, we should skip it
    const rows = table.find('tr');
    const startIndex = (table.find('thead').length > 0) ? 0 : 1; 
    // Wait, if using thead, tbody rows start at 0 (relative to tbody) or we just select tbody tr
    
    const bodyRows = table.find('tbody tr');
    const rowsToIterate = bodyRows.length > 0 ? bodyRows : rows.slice(1);

    rowsToIterate.each((i, row) => {
        const rowData: any = {};
        const cells = $(row).find('td');
        
        // Check for "No results found"
        // The ERP displays a single cell spanning columns with this text when no data exists
        if (cells.length === 1 && $(cells[0]).text().trim().includes('No results found')) {
            return; // Skip this row
        }

        // Only process if we have cells matching headers roughly
        if (cells.length > 0) {
            cells.each((j, cell) => {
                const header = headers[j] || `col_${j}`;
                // Clean up header key to be more friendly (optional)
                // rowData[header] = $(cell).text().trim();
                // Let's keep it simple
                 rowData[header] = $(cell).text().trim();
            });
            data.push(rowData);
        }
    });

    return data;
}
