# Image Upload Feature Documentation

## Overview
The Planet Nine Classes platform includes a comprehensive image upload system for course creation and management. This feature allows admins and tutors to upload course images and banners directly through the web interface.

## Features

### ✅ **Working Features**
- **File Upload API**: `/api/upload` - Handles file uploads with security validation
- **File Serving API**: `/api/uploads/[filename]` - Serves uploaded files with proper content types
- **Admin Course Creation**: Image upload integrated in course creation form
- **Image Preview**: Real-time preview of uploaded images
- **Security Validation**: File type and size validation
- **Docker Integration**: Files saved to mounted volume for persistence

### 🔒 **Security Features**
- **File Type Validation**: Only allows image files (JPEG, PNG, GIF, WebP, SVG)
- **File Size Limit**: Maximum 10MB per file
- **Unique Filenames**: Timestamp-based naming to prevent conflicts
- **Content Type Detection**: Proper MIME type handling for file serving
- **Directory Security**: Files saved outside web root

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (image file)

Response:
{
  "success": true,
  "url": "/api/uploads/1760426933007-logo.png",
  "filename": "1760426933007-logo.png"
}
```

### Serve File
```
GET /api/uploads/[filename]

Response:
- File content with appropriate Content-Type header
- Cache-Control: public, max-age=31536000 (1 year)
```

## Usage in Course Creation

### Admin Panel Integration
The image upload feature is integrated into the admin course creation form with two upload fields:

1. **Course Card Image** (Recommended: 400x300px)
   - Used for course listings and cards
   - Shows preview after upload
   - Stored in `imageUrl` field

2. **Course Banner Image** (Recommended: 1200x400px)
   - Used for course detail pages
   - Shows preview after upload
   - Stored in `bannerUrl` field

### Frontend Implementation
```typescript
const handleImageUpload = async (file: File, type: 'imageUrl' | 'bannerUrl') => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    if (type === 'imageUrl') {
      setUploadingImage(true)
    } else {
      setUploadingBanner(true)
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const result = await response.json()
      setNewCourse({ ...newCourse, [type]: result.url })
      toast.success('Image uploaded successfully')
    } else {
      const error = await response.json()
      toast.error(error.error || 'Upload failed')
    }
  } catch (error) {
    toast.error('Upload failed')
  } finally {
    setUploadingImage(false)
    setUploadingBanner(false)
  }
}
```

## File Storage

### Docker Configuration
```yaml
volumes:
  - ./uploads:/app/uploads
```

### File Structure
```
uploads/
├── 1760426933007-logo.png
├── 1760426933008-banner.jpg
└── ...
```

### File Naming Convention
- Format: `{timestamp}-{original-filename}`
- Example: `1760426933007-logo.png`
- Prevents filename conflicts
- Maintains original file extension

## Security Considerations

### File Validation
- **Allowed Types**: image/jpeg, image/png, image/gif, image/webp, image/svg+xml
- **Size Limit**: 10MB maximum
- **Filename Sanitization**: Timestamp prefix prevents path traversal

### Content Type Detection
The file serving API automatically detects content type based on file extension:
- `.jpg`, `.jpeg` → `image/jpeg`
- `.png` → `image/png`
- `.gif` → `image/gif`
- `.webp` → `image/webp`
- `.svg` → `image/svg+xml`
- `.pdf` → `application/pdf`
- `.txt` → `text/plain`

## Error Handling

### Upload Errors
- **No file**: "No file uploaded"
- **Invalid type**: "Invalid file type. Only images are allowed."
- **File too large**: "File too large. Maximum size is 10MB."
- **Server error**: "Failed to upload file"

### Serving Errors
- **File not found**: 404 status
- **Server error**: 500 status

## Performance Optimizations

### Caching
- Files served with `Cache-Control: public, max-age=31536000`
- 1-year browser cache for uploaded images
- Reduces server load for frequently accessed images

### File Size Management
- 10MB limit prevents server overload
- Compressed image formats recommended
- Automatic cleanup of old files (can be implemented)

## Testing

### Manual Testing
1. **Upload Test**:
   ```bash
   curl -X POST http://localhost:3002/api/upload \
     -F "file=@/path/to/image.png" \
     -H "Content-Type: multipart/form-data"
   ```

2. **Serve Test**:
   ```bash
   curl -I http://localhost:3002/api/uploads/filename.png
   ```

### Integration Testing
- Course creation with image upload
- Image preview functionality
- File serving and caching
- Error handling for invalid files

## Troubleshooting

### Common Issues

1. **File not accessible after upload**
   - Check Docker volume mapping
   - Verify file permissions
   - Check file serving API

2. **Upload fails with "Invalid file type"**
   - Verify file MIME type
   - Check allowed types list
   - Ensure file is actually an image

3. **File too large error**
   - Check file size (must be < 10MB)
   - Compress image if needed
   - Consider increasing limit if necessary

### Debug Steps
1. Check Docker logs: `docker logs test-academy-app`
2. Verify file exists: `ls -la uploads/`
3. Test API directly: `curl -X POST /api/upload`
4. Check browser network tab for errors

## Future Enhancements

### Planned Features
- **Image Compression**: Automatic compression on upload
- **Multiple Formats**: Support for more image formats
- **Batch Upload**: Upload multiple images at once
- **Image Editing**: Basic crop/resize functionality
- **CDN Integration**: Serve images from CDN
- **Cleanup Service**: Automatic cleanup of unused files

### Security Improvements
- **Virus Scanning**: Scan uploaded files for malware
- **Image Validation**: Verify uploaded files are valid images
- **Rate Limiting**: Limit uploads per user/time period
- **Access Control**: Restrict file access by user role

## Configuration

### Environment Variables
```env
# File upload settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp,image/svg+xml
UPLOAD_DIR=uploads
```

### Next.js Configuration
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost'],
  },
  // Add file size limit
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}
```

---

**Last Updated**: October 14, 2025
**Status**: ✅ Fully Functional
**Security Level**: High
