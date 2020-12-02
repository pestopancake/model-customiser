const db = require("../lib/db.js");

(async () => {


  var a = await db.run(async function (mongodb) {
    return await mongodb.collection('quotes').find({}).toArray();
  });
  console.log(a);

  var b = await db.allQuotes();
  console.log(b);
  
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