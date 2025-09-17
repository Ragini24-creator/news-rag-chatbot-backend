const express = require("express");
const { handleChatController } = require("../controllers/chatController");
const { createSessionController } = require('../controllers/createSessionController');
const { clearSessionController } = require('../controllers/clearSessionController')
const { fetchChatHistoryController } = require('../controllers/fetchChatHistoryController');

const router = express.Router();

router.get("/users/history/:sessionId", fetchChatHistoryController);
router.post("/users/session/create", createSessionController);
router.post("/users/chat", handleChatController);
router.delete("/users/session/:sessionId", clearSessionController)

module.exports = router;
