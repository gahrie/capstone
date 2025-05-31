const TimeLog = require("../model/TimeLog");
const Guest = require("../model/Guest");

exports.timeIn = async (req, res) => {
  try {
    const { guestId } = req.params;
    
    const guest = await Guest.findByPk(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const activeLog = await TimeLog.findOne({
      where: {
        guest_id: guestId,
        is_activated: true,
        time_out: null
      }
    });

    if (activeLog) {
      return res.status(400).json({ 
        message: "Guest is already timed in",
        timeLog: activeLog
      });
    }

    const timeLog = await TimeLog.create({
      guest_id: guestId,
      time_in: new Date(),
      is_activated: true
    });

    res.status(201).json({
      message: "Time in recorded successfully",
      timeLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.timeOut = async (req, res) => {
  try {
    const { guestId } = req.params;

    const guest = await Guest.findByPk(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const activeLog = await TimeLog.findOne({
      where: {
        guest_id: guestId,
        is_activated: true,
        time_out: null
      }
    });

    if (!activeLog) {
      return res.status(404).json({ message: "Please time in before timing out" });
    }

    activeLog.time_out = new Date();
    activeLog.is_activated = false;
    await activeLog.save();

    res.json({
      message: "Time out recorded successfully",
      timeLog: activeLog
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleTimeLog = async (req, res) => {
  try {
    const { guestId } = req.params;

    const guest = await Guest.findByPk(guestId);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    const activeLog = await TimeLog.findOne({
      where: {
        guest_id: guestId,
        is_activated: true,
        time_out: null
      }
    });

    if (activeLog) {
      activeLog.time_out = new Date();
      activeLog.is_activated = false;
      await activeLog.save();

      return res.json({
        action: "timeout",
        message: "Time out recorded successfully",
        timeLog: activeLog
      });
    } else {
      const timeLog = await TimeLog.create({
        guest_id: guestId,
        time_in: new Date(),
        is_activated: true
      });

      return res.status(201).json({
        action: "timein",
        message: "Time in recorded successfully",
        timeLog
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGuestLogs = async (req, res) => {
  try {
    const { guestId } = req.params;
    
    const logs = await TimeLog.findAll({
      where: { guest_id: guestId },
      order: [["time_in", "DESC"]]
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await TimeLog.findAll({
      include: [Guest],
      order: [["time_in", "DESC"]]
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getActiveLogs = async (req, res) => {
  try {
    const logs = await TimeLog.findAll({
      where: { is_activated: true, time_out: null },
      include: [Guest],
      order: [["time_in", "DESC"]]
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 