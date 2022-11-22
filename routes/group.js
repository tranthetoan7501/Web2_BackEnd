const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/auth')

const { 
    getGroups,
    createGroup
} = require('../controllers/groupController');

router.route('/')
    .get(protect,getGroups)
    .post(protect,createGroup);
module.exports = router;
