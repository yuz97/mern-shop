import multer from "multer";
import path from "path";

const FILE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isFileFormat = FILE_TYPE[file.mimetype];
    let uploadErr = new Error("invalid format image,choose another");

    if (isFileFormat) {
      uploadErr = null;
    }

    cb(uploadErr, "public/img");
  },
  filename: function (req, file, cb) {
    const uniqueFile = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;

    cb(null, uniqueFile);
  },
});

const upload = multer({ storage });

export { upload };
