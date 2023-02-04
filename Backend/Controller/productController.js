const getAllProducts = async (req, res) => {
  return res.status(200).json({
    message: "Get all projects",
  });
};

module.exports = { getAllProducts };
