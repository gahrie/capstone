const express = require("express");
const router = express.Router();
const timeLogController = require("../controllers/timeLogController");

router.post("/toggle/:guestId", timeLogController.toggleTimeLog);

router.post("/timein/:guestId", timeLogController.timeIn);

router.post("/timeout/:guestId", timeLogController.timeOut);

router.get("/guest/:guestId", timeLogController.getGuestLogs);

router.get("/", timeLogController.getAllLogs);

router.get("/active", timeLogController.getActiveLogs);

module.exports = router; 