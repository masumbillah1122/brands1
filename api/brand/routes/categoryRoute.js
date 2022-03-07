const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/CategoryController');

router.get('/create', CategoryController.addCategory);



module.exports = router;