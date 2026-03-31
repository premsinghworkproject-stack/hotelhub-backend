import { CLOUDINARY_URL_PREFIX } from '../constants/cloudinary.constant';

export class ImageUrlTransformer {
  static transform(url: string): string {
    if (!url) return url;
    
    // If URL already starts with Cloudinary prefix, return as-is
    if (url.startsWith(CLOUDINARY_URL_PREFIX)) {
      return url;
    }
    
    // If URL is a relative path or doesn't have full Cloudinary URL, add prefix
    // This handles cases where URL might be stored as just the path
    if (!url.startsWith('http')) {
      // Assuming the URL is a Cloudinary path, construct full URL
      // This is a basic implementation - adjust based on your actual URL structure
      return `${CLOUDINARY_URL_PREFIX}/image/upload/${url}`;
    }
    
    return url;
  }

  static transformArray(urls: string[]): string[] {
    return urls.map(url => this.transform(url));
  }

  static transformHotelImages(images: any[]): any[] {
    return images.map(image => ({
      ...image,
      url: this.transform(image.url),
    }));
  }

  static transformRoomTypeImages(images: any[]): any[] {
    return images.map(image => ({
      ...image,
      url: this.transform(image.url),
    }));
  }

  static transformRoomImages(images: any[]): any[] {
    return images.map(image => ({
      ...image,
      url: this.transform(image.url),
    }));
  }
}
