import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {
    // You can inject ConfigService if you need to access environment variables
    // or other configuration settings.
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      // Verification of the file
      if (!file || !file.buffer || !file.originalname) {
        throw new HttpException('Invalid file', 400);
      }

      const isProduction = this.configService.get('NODE_ENV') === 'production';

      return isProduction
        ? this.uploadToCloudinary(file)
        : this.uploadLocalFile(file);
    } catch (error) {
      console.error('Error to uploadFile:', error);
      throw new HttpException('Error to upload file', 500);
    }
  }
  private async uploadLocalFile(file: Express.Multer.File): Promise<string> {
    // Create directory if it doesn't exist
    const uploadPath = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadPath, { recursive: true });

    // Generate unique file name
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    const fullPath = path.join(uploadPath, fileName);

    // Save file
    await fs.writeFile(fullPath, file.buffer);

    return fileName;
  }

  private async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    // Convert buffer to readable stream
    const stream = Readable.from(file.buffer);

    // Upload to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads',
          resource_type: 'auto', // Automatically determine the resource type (image, video, etc.)
        },
        (error, result) => {
          if (error || !result) {
            const rejectionError =
              error instanceof Error
                ? error
                : new Error(
                    error
                      ? typeof error === 'object'
                        ? JSON.stringify(error)
                        : String(error)
                      : 'Upload failed',
                  );
            return reject(rejectionError);
          }
          resolve(result);
        },
      );
      stream.pipe(upload);
    });

    return result.secure_url;
  }
}
