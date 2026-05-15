import { diskStorage } from 'multer';
import { extname } from 'path';

export const MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024;

export const productImageStorage = diskStorage({
  destination: './uploads/products',
  filename: (_req, file, callback) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${unique}${extname(file.originalname)}`);
  },
});

export const productImageLimits = {
  fileSize: MAX_PRODUCT_IMAGE_BYTES,
};
