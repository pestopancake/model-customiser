const quoteRepository = require("../apisrc/repositories/quote.js");

module.exports = async (req, res) => {
  var results = await quoteRepository.create(req.query);
  res.json(results)
}