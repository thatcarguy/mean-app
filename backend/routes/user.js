const express = require('express');
const UsreController =require('../controllers/user');

const router = express.Router();

router.post("/signup", UsreController.createUser);

router.post("/login", UsreController.userLogin);

module.exports = router;
