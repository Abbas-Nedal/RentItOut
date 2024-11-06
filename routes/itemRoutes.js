// routes/itemRoutes.js

const express = require('express');
const router= express.Router();
const itemController = require('../controllers/itemController');
router.get('/available', itemController.getAvailableItems);
router.get('/search', itemController.searchItemsByNameOrDescription);
router.post('/', itemController.createitem);
router.put('/:item_id', itemController.updateItem);
router.delete('/:item_id', itemController.deleteItem);
router.get('/:item_id', itemController.getItemById);
router.get('/', itemController.getAllItems);
router.get('/category/:category', itemController.getItemsByCategory);
router.get('/user/:user_id', itemController.getItemsByUserId);
module.exports = router;

/*
to test , use routes:
  POST http://localhost:3000/api/v1/items/
  PUT http://localhost:3000/api/v1/items/item_id
  DELETE http://localhost:3000/api/v1/items/item_id
  GET http://localhost:3000/api/v1/items/item_id
  GET http://localhost:3000/api/v1/items/
  GET http://localhost:3000/api/v1/items/category/categoryname
  GET http://localhost:3000/api/v1/items/search?query=setup
  GET http://localhost:3000/api/v1/items/available
*/
