import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const venueImgDir = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images/venues/');
        },
        filename: (req, file, next) => {
            const ext = path.extname(file.originalname)
            const uniqueFileName = uuidv4() + ext
            next(null, uniqueFileName)
        }
    }),
    fileFilter: (req, file, next) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            next(null, true)
        } else {
            next(new Error('Invalid file type. Only JPEG and PNG are allowed'))
        }
    }
})

