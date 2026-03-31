# Image Upload Implementation Guide

This document outlines the complete image upload functionality implemented for the Hotel Booking GraphQL backend using Cloudinary storage.

## 🚀 Features Implemented

### 1. **Common File Upload Service**
- **Location**: `src/common/services/file-upload.service.ts`
- **Features**:
  - Multiple file upload support
  - Cloudinary integration with automatic folder organization
  - File validation (size, format)
  - Image optimization and transformation
  - Error handling and cleanup

### 2. **Image Models & Migrations**
- **Hotel Images**: `hotel-image.model.ts` ✅ (enhanced with publicId)
- **Room Type Images**: `room-type-image.model.ts` ✅ (enhanced with publicId)  
- **Room Images**: `room-image.model.ts` 🆕 (new implementation)

### 3. **GraphQL Mutations**
- **Hotel**: `createHotelWithImages`, `updateHotelWithImages`
- **Room Type**: `createRoomTypeWithImages`, `updateRoomTypeWithImages`
- **Room**: `createRoomWithImages`, `updateRoomWithImages`

### 4. **Cloudinary Integration**
- **Configuration**: `src/common/constants/cloudinary.constant.ts`
- **Folder Structure**:
  - `hotels/` - Hotel images
  - `room-types/` - Room type images
  - `rooms/` - Room-specific images

## 📁 File Structure

```
src/
├── common/
│   ├── constants/
│   │   └── cloudinary.constant.ts     # Cloudinary config & folders
│   ├── services/
│   │   └── file-upload.service.ts    # Main upload service
│   ├── scalars/
│   │   └── upload.scalar.ts         # GraphQL upload scalar
│   ├── dto/
│   │   └── image-upload.dto.ts      # Common image DTOs
│   └── transformers/
│       └── image-url.transformer.ts # URL transformation
├── modules/
│   ├── hotel/
│   │   ├── hotel-with-images.service.ts
│   │   ├── hotel-with-images.resolver.ts
│   │   └── dto/hotel-with-images.input.ts
│   ├── room-type/
│   │   ├── room-type-with-images.service.ts
│   │   ├── room-type-with-images.resolver.ts
│   │   └── dto/room-type-with-images.input.ts
│   └── room/
│       ├── room-with-images.service.ts
│       ├── room-with-images.resolver.ts
│       └── dto/room-with-images.input.ts
└── database/
    ├── models/
    │   ├── hotel-image.model.ts      # Enhanced with URL transformer
    │   ├── room-type-image.model.ts  # Enhanced with URL transformer
    │   └── room-image.model.ts       # New with URL transformer
    └── migrations/
        ├── 20240331000001-create-room-images.js
        └── 20240331000002-add-publicId-to-image-tables.js
```

## 🔧 Configuration

### Environment Variables
Add these to your `.env` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Upload Configuration
- **Max File Size**: 5MB
- **Allowed Formats**: jpg, jpeg, png, webp, gif
- **Auto Transformation**: Quality optimization, auto-format, size limits

## 📝 GraphQL Usage Examples

### Create Hotel with Images
```graphql
mutation CreateHotelWithImages($input: CreateHotelWithImagesInput!) {
  createHotelWithImages(input: $input) {
    id
    name
    images {
      id
      url
      altText
      isPrimary
      sortOrder
    }
  }
}
```

### Update Room Type Images
```graphql
mutation UpdateRoomTypeWithImages($id: Int!, $input: UpdateRoomTypeWithImagesInput!) {
  updateRoomTypeWithImages(id: $id, input: $input) {
    id
    name
    images {
      id
      url
      altText
      isPrimary
      sortOrder
    }
  }
}
```

## 🎯 Key Features

### 1. **Primary Image Management**
- Automatic primary image enforcement (only one per entity)
- Fallback to first image if no primary set

### 2. **Image Deletion**
- Safe deletion from both Cloudinary and database
- Batch deletion support

### 3. **URL Transformation**
- Automatic Cloudinary URL prefixing
- Consistent URL formatting across all image types

### 4. **Security & Validation**
- File size limits
- Format validation
- User authorization checks

## 🚀 Getting Started

1. **Configure Cloudinary**:
   ```bash
   # Add to .env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

2. **Run Migrations**:
   ```bash
   npm run db:migrate
   ```

3. **Start Development Server**:
   ```bash
   npm run start:dev
   ```

## 🔍 Testing the Implementation

### Test File Upload
Use GraphQL Playground or Postman with multipart form data for file uploads.

### Verify Cloudinary Integration
Check your Cloudinary dashboard to see uploaded files in the correct folders.

### Database Verification
```sql
-- Check hotel images
SELECT * FROM hotel_images;

-- Check room type images  
SELECT * FROM room_type_images;

-- Check room images
SELECT * FROM room_images;
```

## 🛠️ Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all module dependencies are properly imported
2. **Cloudinary Errors**: Verify environment variables are set correctly
3. **Permission Errors**: Check user authentication and hotel ownership
4. **File Upload Fails**: Verify file size and format restrictions

### Debug Tips

- Check server logs for detailed error messages
- Verify Cloudinary configuration in browser dev tools
- Test with small images first to rule out size issues

## 📈 Performance Considerations

- Images are automatically optimized by Cloudinary
- Consider implementing lazy loading for image galleries
- Use CDN for optimal delivery (Cloudinary provides this)

## 🔮 Future Enhancements

- Image watermarking
- Bulk image operations
- Image analytics and usage tracking
- Advanced image transformations (crop, filters, etc.)
- Image compression settings per use case

---

**Implementation Status**: ✅ Complete and Tested
**Build Status**: ✅ Successful
**Migration Status**: ✅ Applied
