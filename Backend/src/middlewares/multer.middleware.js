import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,"./public/temp");
    },
    filename: function (req,file,cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()*1e9);

        cb(
            null,
            uniqueSuffix + path.extname(file.originalname)
        );
    }  
})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: function (req,file,cb) {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null,true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
})

export default upload;