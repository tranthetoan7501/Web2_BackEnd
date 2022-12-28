const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessage,
} = require('../controllers/message/messageController');
router.route('/createMessage').post(createMessage);
router.route('/:roomId').get(getMessage);

module.exports = router;
