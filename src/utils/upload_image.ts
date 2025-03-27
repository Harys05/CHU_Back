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
     * @param dossier - The subfolder to save the file in. If empty, it defaults to 'default'.
     * @returns The filename of the saved file.
     */
    saveFile(file: Express.Multer.File, dossier?: string): string {
        const subfolder = dossier && dossier.trim() !== '' ? dossier.trim() : 'default';
        const folderPath = path.join(this.storagePath, subfolder);

        // Ensure the subfolder exists
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const uniqueFilename = this.generateUniqueFilename(file.originalname);
        const filePath = path.join(folderPath, uniqueFilename);
        fs.writeFileSync(filePath, file.buffer);
        this.logger.log(`File saved at: ${filePath}`);
        return uniqueFilename;
    }

    /**
     * Deletes a file from the storage path.
     * @param filename - The name of the file to delete.
     * @param dossier - The subfolder where the file is stored. If empty, it defaults to 'default'.
     */
    deleteFile(filename: string, dossier?: string): void {
        const subfolder = dossier && dossier.trim() !== '' ? dossier.trim() : 'default';
        const filePath = path.join(this.storagePath, subfolder, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            this.logger.log(`File deleted: ${filePath}`);
        }
    }

    /**
     * Gets the full file path for a given filename.
     * @param filename - The name of the file.
     * @param dossier - The subfolder where the file is stored. If empty, it defaults to 'default'.
     * @returns The full file path.
     */
    getFilePath(filename: string, dossier?: string): string {
        const subfolder = dossier && dossier.trim() !== '' ? dossier.trim() : 'default';
        return path.join(this.storagePath, subfolder, filename);
    }

    /**
     * Reads a file from the storage path.
     * @param filename - The name of the file to read.
     * @param dossier - The subfolder where the file is stored. If empty, it defaults to 'default'.
     * @returns The file buffer.
     */
    readFile(filename: string, dossier?: string): Buffer {
        const subfolder = dossier && dossier.trim() !== '' ? dossier.trim() : 'default';
        const filePath = path.join(this.storagePath, subfolder, filename);
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
     * @param dossier - The subfolder where the file is stored. If empty, it defaults to 'default'.
     * @returns The preview path.
     */
    async generatePreview(filename: string, dossier?: string): Promise<string> {
        return this.getFilePath(filename, dossier);
    }

    /**
     * Generates an original preview path for a given filename.
     * @param filename - The name of the file.
     * @param dossier - The subfolder where the file is stored. If empty, it defaults to 'default'.
     * @returns The original preview path.
     */
    async generateOriginalPreview(filename: string, dossier?: string): Promise<string> {
        return this.getFilePath(filename, dossier);
    }
}