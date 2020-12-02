const db = require("../lib/db.js");

module.exports = {
    async allQuotes() {
        return await db.run(async function(mongodb) { 
            return await mongodb.collection('quotes').find({}).toArray();
        })
    }
};