import multer from "multer";
import os from "os";
import path from "path";

const MAX_FILE_BYTES = 300 * 1024 * 1024; // 10MB  -- changed to 80MB to test the dockers
const ALLOWED_MIME = new Set([
  "text/csv",
  "application/vnd.ms-excel",
  "application/csv",
  "text/plain",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => {
    const safe = "upload-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    cb(null, safe + path.extname(file.originalname || ".csv"));
  },
});

function fileFilter(req, file, cb) {
  const nameOk = (file.originalname || "").toLowerCase().endsWith(".csv");
  const mimeOk = ALLOWED_MIME.has(file.mimetype);

  // accept if either MIME is ok OR filename ends with .csv
  if (!mimeOk && !nameOk) return cb(new Error("Invalid file type"));
  cb(null, true);
}

export const uploadSingleCsv = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
}).single("file");