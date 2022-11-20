const express = require('express');

const router = express.Router();
const { 
    getGroups,
    createGroup
} = require('../controllers/groupController');

router.route('/')
    .get(getGroups)
    .post(createGroup);
module.exports = router;
