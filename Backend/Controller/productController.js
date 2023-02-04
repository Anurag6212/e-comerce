const getAllProducts = async (req, res) => {
  console.log("reaching here");
  return res.status(200).json({
    message: "Get all projects",
  });
};

module.exports = { getAllProducts };
