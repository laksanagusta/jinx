const router = require('express').Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/authbackend');

router.post('/signin', adminController.signIn);
router.get('/signin', adminController.viewSignIn);
router.get('/signup', adminController.viewSignUp);
router.post('/', adminController.signUp);
router.use(auth);
router.get('/logout', adminController.logout);
router.get('/dashboard', adminController.viewDashboard);
router.get('/category', adminController.viewCategory);
router.get('/bank', adminController.viewBank);
router.get('/product', adminController.viewProduct);
router.get('/booking', adminController.viewBooking);

module.exports = router;