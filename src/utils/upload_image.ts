import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
    private readonly storagePath: string;
    private readonly logger = new Logger(UploadService.name);

    constructor() {
        this.storagePath = path.join(process.cwd(), 'public', 'uploads');
        this.ensureStoragePathExists();
    }

    private ensureStoragePathExists() {
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirSync(this.storagePath, { recursive: true });
        }
    }

    /**
     * Saves a file to the storage path.
     * @param file - The file to save.
     * @returns The filename of the saved file.
     */
    saveFile(file: Express.Multer.File): string {
        const uniqueFilename = this.generateUniqueFilename(file.originalname);
        const filePath = this.getFilePath(uniqueFilename);
        fs.writeFileSync(filePath, file.buffer);
        this.logger.log(`File saved at: ${filePath}`);
        return uniqueFilename;
    }

    /**
     * Deletes a file from the storage path.
     * @param filename - The name of the file to delete.
     */
    deleteFile(filename: string): void {
        const filePath = this.getFilePath(filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            this.logger.log(`File deleted: ${filePath}`);
        }
    }

    /**
     * Gets the full file path for a given filename.
     * @param filename - The name of the file.
     * @returns The full file path.
     */
    getFilePath(filename: string): string {
        return path.join(this.storagePath, filename);
    }

    /**
     * Reads a file from the storage path.
     * @param filename - The name of the file to read.
     * @returns The file buffer.
     */
    readFile(filename: string): Buffer {
        const filePath = this.getFilePath(filename);
        this.logger.log(`Reading file from: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        return fs.readFileSync(filePath);
    }

    /**
     * Generates a unique filename for a given file.
     * @param originalname - The original name of the file.
     * @returns A unique filename.
     */
    private generateUniqueFilename(originalname: string): string {
        const timestamp = Date.now();
        const uniqueId = uuidv4();
        const extension = path.extname(originalname);
        return `${timestamp}_${uniqueId}${extension}`;
    }

    /**
     * Generates a preview path for a given filename.
     * @param filename - The name of the file.
     * @returns The preview path.
     */
    async generatePreview(filename: string): Promise<string> {
        return this.getFilePath(filename);
    }

    /**
     * Generates an original preview path for a given filename.
     * @param filename - The name of the file.
     * @returns The original preview path.
     */
    async generateOriginalPreview(filename: string): Promise<string> {
        return this.getFilePath(filename);
    }
}
