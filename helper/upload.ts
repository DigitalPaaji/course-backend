import multer from "multer";
import path from "path";
import fs from "fs";

/* ============================= */
/* Ensure Upload Folder Exists   */
/* ============================= */

const uploadPath = "uploads/videos";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* ============================= */
/* Storage Config                */
/* ============================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

/* ============================= */
/* File Filter (Only Video)      */
/* ============================= */

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  const allowedTypes = [
    "video/mp4",
    "video/mkv",
    "video/webm",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"));
  }
};



const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 200, // 200MB limit
  },
});

export default upload;
