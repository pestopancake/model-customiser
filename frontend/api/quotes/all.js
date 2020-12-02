const quoteRepository = require("../apisrc/repositories/quote.js");

module.exports = async (req, res) => {
  var results = await quoteRepository.allQuotes();
  res.json(results)
}