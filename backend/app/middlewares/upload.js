const multer = require('multer');

const upload = multer({
  limits: {
	fileSize: 10000000 // Limit file size to 10MB
  },
  fileFilter(req, file, cb) {
	if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { // Accept images only
	  return cb(new Error('Please upload an image.'));
	}
	cb(undefined, true);
  }
});

module.exports = upload;