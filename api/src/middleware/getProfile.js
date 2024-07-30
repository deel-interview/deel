const getProfile = async (req, res, next) => {
  const { Profile } = req.app.get("models");
  const profile = await Profile.findOne({
    where: { id: req.get("profile_id") || 0 },
  });
  if (!profile)
    return res
      .status(401)
      .json({
        message:
          "Unauthorized, We could not find the profile, make sure you are passing in the profile ID",
      })
      .end();
  req.profile = profile;
  next();
};
module.exports = { getProfile };
