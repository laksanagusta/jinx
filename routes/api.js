const router = require('express').Router();
const apiController = require('../controllers/api/apiController');
// const auth = require('../middlewares/authbackend');

// router.post('/signin', adminController.signIn);
router.get('/getHomePageData', apiController.getHomePageData);
router.post('/addMember', apiController.addMember);

module.exports = router;