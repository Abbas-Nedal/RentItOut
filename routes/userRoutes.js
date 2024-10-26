const express = require('express');
const userController = require('../controllers/userController');
const roleMiddleware = require('../middlewares/roleMiddleware');
const userValidation = require('../validations/userValidation'); 
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

router.use(authMiddleware.authenticateToken); 

router.post('/login', userController.loginUser); 

router.get('/', userController.getUsers); 
router.get('/:id', userController.getUserById); 

router.post('/', 
  userValidation.createUserValidation, 
  roleMiddleware.requireAdminRole, 
  userController.createUser); 

router.put('/:id', 
  userValidation.updateUserValidation, 
  roleMiddleware.requireAdminRole, 
  userController.updateUser); 

router.delete('/:id', roleMiddleware.requireAdminRole, 
  userController.deleteUser); 


module.exports = router;
