const quoteRepository = require("../../apisrc/repositories/quote.js");

module.exports = async (req, res) => {
  var results = await quoteRepository.all();
  res.json(results)
}