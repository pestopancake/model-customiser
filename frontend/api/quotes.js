const db = require("../lib/db.js");

module.exports = async (req, res) => {
  var results = await db.allQuotes();
  console.log(results)
  res.json(results)
}