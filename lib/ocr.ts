
export async function solveCaptchaWithOCRSpace(base64Image: string): Promise<string> {
  try {
    const formData = new FormData()
    // base64Image is expected to include data:image/png;base64,... prefix or be raw base64.
    // If it's raw base64, we need to add the prefix.
    const imagePayload = base64Image.startsWith('data:') 
      ? base64Image 
      : `data:image/png;base64,${base64Image}`

    formData.append('base64Image', imagePayload)
    formData.append('language', 'eng')
    formData.append('isOverlayRequired', 'false')
    formData.append('detectOrientation', 'true')
    formData.append('isTable', 'false') // Captcha is not a table
    formData.append('OCREngine', '2') // Engine 2 is usually better for numbers/text
    formData.append('scale', 'true')
    formData.append('filetype', 'PNG')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout for captcha

    try {
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
          'apikey': 'K87899142388957' // Using the same free API key
        },
        body: formData,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
    
      if (result.IsErroredOnProcessing) {
        console.error('OCR.space captcha error:', result.ErrorMessage)
        return ''
      }
      
      let extractedText = result.ParsedResults?.[0]?.ParsedText || ''
      
      // Post-processing for captcha
      
      // 1. Map numbers to likely letters (common OCR misinterpretations for this specific captcha font)
      extractedText = extractedText
        .replace(/0/g, 'o')
        .replace(/1/g, 'l')
        .replace(/2/g, 'z')
        .replace(/3/g, 'e')
        .replace(/4/g, 'a')
        .replace(/5/g, 's')
        .replace(/6/g, 'b')
        .replace(/7/g, 't')
        .replace(/8/g, 'b')
         .replace(/9/g, 'g')
         .replace(/vv/g, 'w')
 
       // 2. Convert to Lowercase (User instruction: all captchas are lowercase)
       extractedText = extractedText.toLowerCase()

       // 3. Remove spaces, newlines, and non-alphabetic characters
       // Strict filter for English lowercase letters only
       extractedText = extractedText.replace(/[^a-z]/g, '').trim()
       
       return extractedText
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('OCR.space captcha fetch failed:', fetchError)
      return ''
    }
  } catch (error) {
    console.error('Captcha OCR failed:', error)
    return ''
  }
}
