const mongodb = require("../apisrc/lib/mongodb.js");

(async () => {

  await mongodb.connect();
  try {
    var a = await mongodb.db().collection('quotes').find({}).toArray();
  } finally {
    await mongodb.close();
  }
  console.log(a);
  
})();

// var a = async function () {
//   var db = await mongodb.getDb();
//   console.log(db);
//   var r = db.collection('quotes').find({}).toArray();
//   console.log(r);
// }


// a();


module.exports = (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  })
}