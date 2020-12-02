const quoteRepository = require("../../apisrc/repositories/quote.js");

module.exports = async (req, res) => {
  var results = await quoteRepository.findById(req.query.quote);
  res.json(results)
}