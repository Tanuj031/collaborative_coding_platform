// routes/rooms.js
const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUserRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  joinRoom,
  getRoomMessages,
  addRoomMessage,
} = require('../controllers/roomController');

const router = express.Router();

router.use(protect); // all routes below require auth

router.get('/', getUserRooms);
router.post('/', createRoom);
router.get('/:id', getRoomById);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.post('/join', joinRoom);
router.get('/:id/messages', getRoomMessages);
router.post('/:id/messages', addRoomMessage);

module.exports = router;
