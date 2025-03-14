import { Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CompressionImageService {
    private readonly qualities = {
        high: 90,
        medium: 70,
        low: 50,
    };
    private readonly logger = new Logger(CompressionImageService.name);
    private readonly maxSizeInBytes = 200 * 1024; // 200 KB
    private readonly storagePath: string;

    constructor(private readonly configService: ConfigService) {
        this.storagePath = path.join(process.cwd(), 'public', 'compressed');

        this.ensureStoragePathExists();
    }

    private ensureStoragePathExists() {
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
        }
    }

    async compressImage(
        buffer: Buffer,
        quality: 'high' | 'medium' | 'low' = 'high',
        maxWidth = 1920,
    ): Promise<string> {
        this.logger.log(`Compressing image with quality ${quality}...`);

        // Resize the image to a smaller dimension first
        let compressedBuffer = await sharp(buffer)
            .resize({
                width: maxWidth,
                height: undefined,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .jpeg({ quality: this.qualities[quality] })
            .toBuffer();

        // If the image is still too large, reduce the quality
        if (compressedBuffer.length > this.maxSizeInBytes) {
            compressedBuffer = await sharp(buffer)
                .resize({
                    width: maxWidth,
                    height: undefined,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .jpeg({ quality: this.qualities['medium'] })
                .toBuffer();
        }

        // If still too large, use the lowest quality setting
        if (compressedBuffer.length > this.maxSizeInBytes) {
            compressedBuffer = await sharp(buffer)
                .resize({
                    width: maxWidth,
                    height: undefined,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .jpeg({ quality: this.qualities['low'] })
                .toBuffer();
        }

        const uniqueFilename = `${Date.now()}_${uuidv4()}.jpg`;
        const filePath = path.join(this.storagePath, uniqueFilename);
        fs.writeFileSync(filePath, compressedBuffer);

        return uniqueFilename;
    }
}
