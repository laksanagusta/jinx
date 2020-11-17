const router = require('express').Router();
const productController = require('../controllers/productController');
const {uploadMultiple, upload} = require('../middlewares/multer');
const auth = require('../middlewares/authbackend');

router.use(auth);
router.post('/', uploadMultiple, productController.addProduct);
router.get('/showImage/:id', productController.showImageProduct);
router.get('/:id', productController.showEditProduct);
router.put('/:id', uploadMultiple, productController.editProduct);
router.delete('/:id', productController.deleteProduct);

router.get('/show-detail-product/:productId', productController.productDetail);

module.exports = router;