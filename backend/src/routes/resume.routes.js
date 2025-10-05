const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResumes, getResumes, askQuestion } = require('../controllers/resume.controller');
const { protect } = require('../middlewares/auth.middleware');

const upload = multer({ dest: 'uploads/' });

router.route('/')
    .post(protect, upload.array('resumes', 10), uploadResumes)
    .get(protect, getResumes);
    
router.post('/ask', protect, askQuestion);

module.exports = router;