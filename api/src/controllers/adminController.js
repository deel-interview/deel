const {
  getBestProfessionService,
  getBestClientsService,
} = require("../services/adminService");

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;
  console.log("start: ", start);

  try {
    //transactions  are handled inside the service
    const profession = await getBestProfessionService(start, end);
    if (!profession) {
      return res
        .status(404)
        .json({
          message: "No profession found within the specified time period",
        });
    }
    res.json(profession);
  } catch (error) {
    console.error("Error fetching best profession: ", error);
    res.status(500).json({ message: error.message });
  }
};

const getBestClients = async (req, res) => {
  const { start, end, limit = 2 } = req.query;

  try {
    //transactions are handled inside the service
    const clients = await getBestClientsService(start, end, limit);
    if (!clients.length) {
      return res.status(404).json({ message: "No clients found" });
    }
    res.json(clients);
  } catch (error) {
    console.error("Error fetching best clients: ", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBestProfession, getBestClients };
