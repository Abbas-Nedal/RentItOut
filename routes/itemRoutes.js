// routes/itemRoutes.js

const express = require('express');
const router= express.Router();
const itemController = require('../controllers/itemController');

router.post('/', itemController.createitem);
router.put('/:item_id', itemController.updateItem);
router.delete('/:item_id', itemController.deleteItem);
router.get('/:item_id', itemController.getItemById);
router.get('/', itemController.getAllItems);

module.exports = router;

/*
to test , use routes:
  POST http://localhost:3000/item/
  PUT  http://localhost:3000/item/:item_id
  DELETE http://localhost:3000/item/:item_id
  GET http://localhost:3000/item/:item_id
  GET http://localhost:3000/item/

*/