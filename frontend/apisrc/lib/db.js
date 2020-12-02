const mongodb = require("./mongodb.js");

module.exports = {
    db: null,
    async allQuotes() {
        return await this.run(async function(mongodb) { 
            return await mongodb.collection('quotes').find({}).toArray();
        })
    },
    async run(callback) {
        if (!this.db) { 
            this.db = await (await mongodb.connect()).db();
        }
        return await callback(this.db);
    }
};