const db = require("../lib/db.js");

module.exports = async (req, res) => {
  var results = await db.run(async function (mongodb) {
    return await mongodb.collection('quotes').find({id: req.query.quote}).toArray();
  });
  res.json(results)
}