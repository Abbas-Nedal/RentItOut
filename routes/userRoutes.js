const express = require('express');
const userController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userValidation = require('../validations/userValidation'); 
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.post('/login', userController.loginUser); 
router.get('/', userController.getUsers);
router.get('/id/:id', userController.getUserLimitedInfoById); 
router.get('/name/:name', userController.getUsersLimitedInfoByName); 


router.use(authMiddleware.authenticateToken); 


router.get('/all-info', 
  roleMiddleware.requireAdminRole, 
  userController.getUsersAllInfo); 

router.get('/all-info/name/:name', 
  roleMiddleware.requireAdminRole, 
  userController.getUsersAllInfoByName); 

router.get(
  '/all-info/id/:id', 
  roleMiddleware.requireAdminRole, 
  userController.getUsersAllInfoById
); 



router.post('/', 
  userValidation.createUserValidation, 
  roleMiddleware.requireAdminRole, 
  userController.createUser); 

router.put('/:id', 
  userValidation.updateUserValidation, 
  roleMiddleware.requireAdminRole, 
  userController.updateUser); 

router.delete('/:id', 
  roleMiddleware.requireAdminRole, 
  userController.deleteUser); 


module.exports = router;
