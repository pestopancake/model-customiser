const quoteRepository = require("../apisrc/repositories/quote.js");

module.exports = async (req, res) => {
  var results = await quoteRepository.allQuotes();
  console.log(results)
  res.json(results)
}