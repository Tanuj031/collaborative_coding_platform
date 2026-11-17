// controllers/roomController.js
const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');
const crypto = require('crypto');

const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate 6-char room code
const generateRoomCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = crypto.randomBytes(3).toString('hex').toUpperCase();
    const room = await Room.findOne({ roomCode: code });
    if (!room) exists = false;
  }
  return code;
};

// @desc Get rooms for dashboard (returns all rooms so users can view and join)
exports.getUserRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({})
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });
  res.json(rooms);
});

// @desc Create a new room
exports.createRoom = asyncHandler(async (req, res) => {
  const { name, language, code } = req.body;
  if (!name) {
    const err = new Error('Room name is required');
    err.statusCode = 400;
    throw err;
  }
  const roomCode = await generateRoomCode();
  const room = await Room.create({
    name,
    language: language || 'javascript',
    code: code || '',
    owner: req.user.id,
    members: [req.user.id],
    roomCode,
  });
  res.status(201).json(room);
});

// @desc Get a single room by id
exports.getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email');
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }

  const isMember = room.members.some(m => m._id.toString() === req.user.id);
  const isOwner = room.owner && room.owner._id.toString() === req.user.id;

  if (!isMember && !isOwner) {
    // Automatically add as member if they have room id
    room.members.push(req.user.id);
    await room.save();
  }
  res.json(room);
});

// @desc Update room
exports.updateRoom = asyncHandler(async (req, res) => {
  const { name, language, code } = req.body;
  const room = await Room.findById(req.params.id);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  if (name) room.name = name;
  if (language) room.language = language;
  if (code !== undefined) room.code = code;
  await room.save();
  res.json(room);
});

// @desc Delete a room (owner only)
exports.deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    const err = new Error('Room not found');
    err.statusCode = 404;
    throw err;
  }
  if (room.owner.toString() !== req.user.id) {
    const err = new Error('Only the owner can delete the room');
    err.statusCode = 403;
    throw err;
  }
  await Message.deleteMany({ room: room._id });
  await Room.findByIdAndDelete(room._id);
  res.json({ message: 'Room deleted' });
});

// @desc Join a room by its 6-char code
exports.joinRoom = asyncHandler(async (req, res) => {
  const { roomCode } = req.body;
  if (!roomCode) {
    const err = new Error('roomCode is required');
    err.statusCode = 400;
    throw err;
  }
  const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });
  if (!room) {
    const err = new Error('Room not found with that code');
    err.statusCode = 404;
    throw err;
  }
  if (!room.members.includes(req.user.id)) {
    room.members.push(req.user.id);
    await room.save();
  }
  res.json({ message: 'Joined room', roomId: room._id });
});

// @desc Get messages for a room
exports.getRoomMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ room: req.params.id })
    .populate('sender', 'name email')
    .sort('createdAt');
  res.json(messages);
});

// @desc Add a new message to a room
exports.addRoomMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    const err = new Error('Message text required');
    err.statusCode = 400;
    throw err;
  }
  const message = await Message.create({
    room: req.params.id,
    sender: req.user.id,
    text,
  });
  const populated = await Message.findById(message._id).populate('sender', 'name email');
  res.status(201).json(populated);
});
