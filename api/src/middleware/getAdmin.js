const { Admin } = require("../models/model"); // Adjust the path to your models

const getAdmin = async (req, res, next) => {
  const adminId = req.get("admin_id");
  const admin = await Admin.findOne({
    where: { id: adminId },
  });
  if (!admin) {
    return res
      .status(401)
      .json({
        message:
          "Unauthorized, We could not find the admin, make sure you are passing in the admin ID",
      })
      .end();
  }
  req.admin = admin;
  next();
};

module.exports = { getAdmin };
