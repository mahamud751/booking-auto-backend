import { diskStorage } from 'multer';
import type { Express } from 'express';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'products');

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
]);

const ALLOWED_EXT = /\.(jpe?g|png|webp|gif|heic|heif)$/i;

function isAllowedImage(file: Express.Multer.File) {
  const mime = (file.mimetype || '').toLowerCase();
  const name = (file.originalname || '').toLowerCase();
  return ALLOWED_MIME.has(mime) || ALLOWED_EXT.test(name);
}

export const productImageStorage = diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const ext = extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.test(ext) ? ext : mimeToExt(file.mimetype);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${unique}${safeExt}`);
  },
});

function mimeToExt(mimetype: string) {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/heic': '.heic',
    'image/heif': '.heif',
  };
  return map[mimetype.toLowerCase()] ?? '.jpg';
}

export const productImageLimits = {
  fileSize: MAX_PRODUCT_IMAGE_BYTES,
  files: 10,
};

export const productImageMulterOptions = {
  storage: productImageStorage,
  limits: productImageLimits,
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!isAllowedImage(file)) {
      callback(
        new Error(
          `Invalid file type: ${file.mimetype || file.originalname}. Use JPG, PNG, or WEBP.`,
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
