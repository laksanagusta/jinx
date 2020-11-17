const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/authbackend');

router.use(auth);
router.post('/', categoryController.addCategory);
router.put('/', categoryController.editCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;