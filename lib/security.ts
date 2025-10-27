export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedData?: any
}

export class SecurityValidator {
  // Basic HTML sanitization to prevent XSS
  static sanitizeHtml(input: string): string {
    if (typeof input !== 'string') return ''
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  // Validate and sanitize email
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = []
    
    if (!email || typeof email !== 'string') {
      errors.push('Email is required')
      return { isValid: false, errors }
    }

    const sanitizedEmail = this.sanitizeHtml(email).trim()
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      errors.push('Invalid email format')
    }

    if (sanitizedEmail.length > 254) {
      errors.push('Email is too long')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedEmail
    }
  }

  // Validate and sanitize name
  static validateName(name: string): ValidationResult {
    const errors: string[] = []
    
    if (!name || typeof name !== 'string') {
      errors.push('Name is required')
      return { isValid: false, errors }
    }

    const sanitizedName = this.sanitizeHtml(name).trim()
    
    if (sanitizedName.length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    if (sanitizedName.length > 100) {
      errors.push('Name is too long')
    }

    // Check for suspicious patterns
    if (/<script|javascript:|on\w+\s*=/i.test(sanitizedName)) {
      errors.push('Invalid characters detected in name')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedName
    }
  }

  // Validate and sanitize phone number
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = []
    
    if (!phone || typeof phone !== 'string') {
      return { isValid: true, errors, sanitizedData: null }
    }

    const sanitizedPhone = this.sanitizeHtml(phone).trim()
    const cleanedPhone = sanitizedPhone.replace(/[^\d+]/g, '')
    
    if (cleanedPhone.length < 10) {
      errors.push('Phone number must be at least 10 digits')
    }

    if (cleanedPhone.length > 15) {
      errors.push('Phone number is too long')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: cleanedPhone
    }
  }

  // Validate and sanitize message content
  static validateMessage(message: string): ValidationResult {
    const errors: string[] = []
    
    // Make message optional - if not provided or empty, return valid with null
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return { isValid: true, errors, sanitizedData: null }
    }

    const sanitizedMessage = this.sanitizeHtml(message).trim()
    
    if (sanitizedMessage.length < 10) {
      errors.push('Message must be at least 10 characters long')
    }

    if (sanitizedMessage.length > 5000) {
      errors.push('Message is too long')
    }

    // Check for suspicious patterns
    if (/<script|javascript:|on\w+\s*=|eval\(|function\(/i.test(sanitizedMessage)) {
      errors.push('Invalid content detected in message')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedMessage
    }
  }

  // Validate and sanitize course title
  static validateCourseTitle(title: string): ValidationResult {
    const errors: string[] = []
    
    if (!title || typeof title !== 'string') {
      errors.push('Course title is required')
      return { isValid: false, errors }
    }

    const sanitizedTitle = this.sanitizeHtml(title).trim()
    
    if (sanitizedTitle.length < 3) {
      errors.push('Course title must be at least 3 characters long')
    }

    if (sanitizedTitle.length > 200) {
      errors.push('Course title is too long')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedTitle
    }
  }

  // Validate and sanitize course description
  static validateCourseDescription(description: string): ValidationResult {
    const errors: string[] = []
    
    if (!description || typeof description !== 'string') {
      errors.push('Course description is required')
      return { isValid: false, errors }
    }

    const sanitizedDescription = this.sanitizeHtml(description).trim()
    
    if (sanitizedDescription.length < 20) {
      errors.push('Course description must be at least 20 characters long')
    }

    if (sanitizedDescription.length > 2000) {
      errors.push('Course description is too long')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedDescription
    }
  }

  // Validate price
  static validatePrice(price: string | number): ValidationResult {
    const errors: string[] = []
    
    if (price === null || price === undefined || price === '') {
      errors.push('Price is required')
      return { isValid: false, errors }
    }

    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    
    if (isNaN(numPrice)) {
      errors.push('Price must be a valid number')
      return { isValid: false, errors }
    }

    if (numPrice < 0) {
      errors.push('Price cannot be negative')
    }

    if (numPrice > 1000000) {
      errors.push('Price is too high')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: numPrice
    }
  }

  // Validate URL
  static validateUrl(url: string): ValidationResult {
    const errors: string[] = []
    
    if (!url || typeof url !== 'string') {
      return { isValid: true, errors, sanitizedData: null }
    }

    const sanitizedUrl = this.sanitizeHtml(url).trim()
    
    if (sanitizedUrl.length === 0) {
      return { isValid: true, errors, sanitizedData: null }
    }

    // Very lenient URL validation - only validate complete URLs
    if (sanitizedUrl.length > 10 && !sanitizedUrl.startsWith('http://') && !sanitizedUrl.startsWith('https://')) {
      // Only validate if it looks like a complete URL but doesn't start with http/https
      if (sanitizedUrl.includes('.') && sanitizedUrl.includes('/')) {
        errors.push('URL must start with http:// or https://')
      }
    }

    if (sanitizedUrl.length > 2000) {
      errors.push('URL is too long')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: sanitizedUrl
    }
  }

  // Rate limiting helper
  static checkRateLimit(ip: string, action: string, windowMs: number = 60000, maxRequests: number = 10): boolean {
    // Simple in-memory rate limiting
    const key = `${ip}:${action}`
    const now = Date.now()
    
    if (!this.rateLimitStore) {
      this.rateLimitStore = new Map()
    }

    const requests = this.rateLimitStore.get(key) || []
    const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return false
    }

    validRequests.push(now)
    this.rateLimitStore.set(key, validRequests)
    
    return true
  }

  private static rateLimitStore: Map<string, number[]> = new Map()
}

// Input validation middleware
export function validateInput(data: any, rules: any): ValidationResult {
  const errors: string[] = []
  const sanitizedData: any = {}

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field]
    
    switch (rule) {
      case 'email':
        const emailResult = SecurityValidator.validateEmail(value)
        if (!emailResult.isValid) {
          errors.push(...emailResult.errors)
        } else {
          sanitizedData[field] = emailResult.sanitizedData
        }
        break
        
      case 'name':
        const nameResult = SecurityValidator.validateName(value)
        if (!nameResult.isValid) {
          errors.push(...nameResult.errors)
        } else {
          sanitizedData[field] = nameResult.sanitizedData
        }
        break
        
      case 'phone':
        const phoneResult = SecurityValidator.validatePhone(value)
        if (!phoneResult.isValid) {
          errors.push(...phoneResult.errors)
        } else {
          sanitizedData[field] = phoneResult.sanitizedData
        }
        break
        
      case 'message':
        const messageResult = SecurityValidator.validateMessage(value)
        if (!messageResult.isValid) {
          errors.push(...messageResult.errors)
        } else {
          sanitizedData[field] = messageResult.sanitizedData
        }
        break
        
      case 'courseTitle':
        const titleResult = SecurityValidator.validateCourseTitle(value)
        if (!titleResult.isValid) {
          errors.push(...titleResult.errors)
        } else {
          sanitizedData[field] = titleResult.sanitizedData
        }
        break
        
      case 'courseDescription':
        const descResult = SecurityValidator.validateCourseDescription(value)
        if (!descResult.isValid) {
          errors.push(...descResult.errors)
        } else {
          sanitizedData[field] = descResult.sanitizedData
        }
        break
        
      case 'price':
        const priceResult = SecurityValidator.validatePrice(value)
        if (!priceResult.isValid) {
          errors.push(...priceResult.errors)
        } else {
          sanitizedData[field] = priceResult.sanitizedData
        }
        break
        
      case 'url':
        const urlResult = SecurityValidator.validateUrl(value)
        if (!urlResult.isValid) {
          errors.push(...urlResult.errors)
        } else {
          sanitizedData[field] = urlResult.sanitizedData
        }
        break
        
      case 'courseId':
        // Basic validation for courseId (should be a non-empty string)
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          errors.push(`${field} is required`)
        } else {
          sanitizedData[field] = value.trim()
        }
        break
        
      default:
        // For unknown field types, just sanitize as basic text
        sanitizedData[field] = SecurityValidator.sanitizeHtml(value)
        break
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  }
}
