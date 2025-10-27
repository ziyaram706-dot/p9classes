# Security Configuration Guide

## Environment Variables Security

### Current Issues
The application currently uses hardcoded secrets in docker-compose.yml which is a security risk.

### Recommended Changes

1. **Create a .env file** (never commit to git):
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:YOUR_SECURE_PASSWORD@localhost:5432/testacademy"

# NextAuth Configuration  
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Security Settings
BCRYPT_ROUNDS="12"
SESSION_MAX_AGE="604800"
```

2. **Generate secure secrets**:
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate database password
openssl rand -base64 32
```

3. **Update docker-compose.yml**:
```yaml
environment:
  - NODE_ENV=production
  - DATABASE_URL=${DATABASE_URL}
  - REDIS_URL=${REDIS_URL}
  - NEXTAUTH_URL=${NEXTAUTH_URL}
  - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
```

## Database Security

### Current Configuration
- Database: PostgreSQL 15
- User: postgres
- Password: postgres123 (INSECURE)
- Port: 5432 (exposed)

### Recommended Changes

1. **Use strong credentials**:
```yaml
environment:
  POSTGRES_DB: testacademy
  POSTGRES_USER: planetnine_user
  POSTGRES_PASSWORD: ${DB_PASSWORD}  # Use environment variable
```

2. **Enable SSL** (for production):
```yaml
environment:
  POSTGRES_SSLMODE: require
```

3. **Restrict network access**:
```yaml
ports:
  - "127.0.0.1:5432:5432"  # Only localhost access
```

## API Security Enhancements

### Rate Limiting
Add to each API route:
```typescript
import { SecurityValidator } from '@/lib/security'

// Check rate limit
const ip = request.headers.get('x-forwarded-for') || 'unknown'
if (!SecurityValidator.checkRateLimit(ip, 'api_endpoint')) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

### Request Size Limits
Add to Next.js config:
```javascript
// next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  // Add request size limit
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
```

## File Upload Security

### Current Implementation
- Basic file upload to /uploads directory
- No file type validation
- No size limits

### Recommended Enhancements

1. **File type validation**:
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

if (!ALLOWED_TYPES.includes(file.type)) {
  return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
}

if (file.size > MAX_SIZE) {
  return NextResponse.json({ error: 'File too large' }, { status: 400 })
}
```

2. **Secure file storage**:
```typescript
// Generate secure filename
const filename = `${Date.now()}-${crypto.randomUUID()}-${file.name}`
const filepath = path.join(process.cwd(), 'secure-uploads', filename)
```

## Monitoring and Logging

### Security Event Logging
Add to critical operations:
```typescript
// Log security events
console.log(JSON.stringify({
  timestamp: new Date().toISOString(),
  event: 'user_login',
  userId: user.id,
  ip: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent')
}))
```

### Error Handling
```typescript
// Don't expose sensitive information
catch (error) {
  console.error('Database error:', error) // Log internally
  return NextResponse.json(
    { error: 'Internal server error' }, // Generic message to client
    { status: 500 }
  )
}
```

## Production Deployment Security

### HTTPS Configuration
```yaml
# docker-compose.prod.yml
services:
  app:
    environment:
      - NEXTAUTH_URL=https://yourdomain.com
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.app.tls=true"
```

### Security Headers
Add to next.config.js:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

## Backup Security

### Database Backups
```bash
# Encrypted backup
pg_dump -U postgres testacademy | gzip | openssl enc -aes-256-cbc -salt -out backup-$(date +%Y%m%d).sql.gz.enc
```

### File Backups
```bash
# Encrypted file backup
tar -czf - uploads/ | openssl enc -aes-256-cbc -salt -out uploads-backup-$(date +%Y%m%d).tar.gz.enc
```

## Security Checklist

### Before Production Deployment
- [ ] Change all default passwords
- [ ] Generate strong secrets
- [ ] Enable HTTPS
- [ ] Configure security headers
- [ ] Set up monitoring
- [ ] Test backup procedures
- [ ] Review access logs
- [ ] Perform security scan
- [ ] Update all dependencies
- [ ] Document security procedures

### Regular Maintenance
- [ ] Weekly: Check security logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Annually: Penetration testing
