const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const carController = require('../controllers/carController');
const auth = require('../middleware/authMiddleware');

const fs = require('fs');
const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

// ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
    cb(null, name);
  }
});
// allow images for photos and videos for video field; basic mime-type filtering
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'photos') {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Only image files are allowed for photos'));
  }
  if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) return cb(null, true);
    return cb(new Error('Only video files are allowed for video'));
  }
  cb(null, false);
};

// set a generous file size limit (per-file)
const upload = multer({ storage, fileFilter, limits: { fileSize: 200 * 1024 * 1024 } });

// create with files: photos (array), video (single)
router.post('/car-entry', auth, upload.fields([{ name: 'photos', maxCount: 6 }, { name: 'video', maxCount: 1 }]), carController.createCar);
router.get('/dashboard', auth, carController.getStats);
router.get('/car-records', auth, carController.getAllCars);
router.get('/car/:id', auth, carController.getCar);
router.put('/car/:id', auth, upload.fields([{ name: 'photos', maxCount: 6 }, { name: 'video', maxCount: 1 }]), carController.updateCar);
router.delete('/car/:id', auth, carController.deleteCar);

module.exports = router;
