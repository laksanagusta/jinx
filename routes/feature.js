const router = require('express').Router();
const featureController = require('../controllers/featureController');
const {uploadMultiple, upload} = require('../middlewares/multer');
const auth = require('../middlewares/authbackend');

router.use(auth);
router.post('/add', upload, featureController.addFeature);
router.put('/', upload, featureController.editFeature);

module.exports = router;