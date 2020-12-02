const db = require("../lib/db.js");

module.exports = (req, res) => {
  var results = await db.allQuotes();
  res.json(results)
}