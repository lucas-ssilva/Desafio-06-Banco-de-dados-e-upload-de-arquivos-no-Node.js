/* eslint-disable prettier/prettier */
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tempFolder = path.resolve(__dirname,'..','..','tmp');

export default {

    directory: tempFolder,
    storage: multer.diskStorage({
        destination: tempFolder,
        filename(request, file, callback) {
            const fileHas = crypto.randomBytes(10).toString('hex');

            const fileName = `${fileHas}-${file.originalname}`;

            return callback(null, fileName);
        }
    }),
};
