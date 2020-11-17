const router = require('express').Router();
const bankController = require('../controllers/bankController');
const {upload} = require('../middlewares/multer');
const auth = require('../middlewares/authbackend');

router.use(auth);
router.post('/', upload, bankController.addBank);
router.put('/', upload, bankController.editBank);
router.delete('/:id', bankController.deleteBank);

module.exports = router;