const mongodb = require("./mongodb.js");

module.exports = {
    db: null,
    async run(callback) {
        if (!this.db) { 
            this.db = await (await mongodb.connect()).db();
        }
        return await callback(this.db);
    }
};