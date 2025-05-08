const multer = require("multer");
const fs = require("fs");
const path = require("path");

class FileUploader {
  constructor({
    folderName = "uploads",
    supportedFile = ["image/png", "image/jpeg", "image.jpg"],
    feildSize = 1024 * 1024 * 3,
  }) {
    this.folderName = folderName;
    this.supportedFile = supportedFile;
    this.feildSize = feildSize;

    if (!fs.existsSync(this.folderName)) {
      fs.mkdirSync(this.folderName, { recursive: true });
    }
  }

  storage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.folderName);
      },
      filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);

        cb(null, Date.now() + ext);
      },
    });
  }

  fileFilter() {
    return (req, file, cb) => {
      if (this.supportedFile.includes(file.mimetype)) {
        cb(null, true);
      } else {
        console.log(
          `Please a valid File Format supported file Form ${this.supportedFile.join(
            ","
          )}`
        );
        cb(null, false);
      }
    };
  }
  upload() {
    return multer({
      storage: this.storage(),
      fileFilter: this.fileFilter(),
      limits: { fileSize: this.feildSize },
    });
  }
}

module.exports= FileUploader;