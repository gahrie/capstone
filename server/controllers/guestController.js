const Guest = require("../model/Guest");

exports.createGuest = async (req, res) => {
  try {
    const guest = await Guest.create(req.body);
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.findAll();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findByPk(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
