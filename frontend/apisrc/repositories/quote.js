const db = require("../lib/db.js");

module.exports = {
    async all() {
        return await db.run(async function(mongodb) {
            return await mongodb.collection('quotes').find({}).toArray();
        })
    },
    async findById(id) {
        return await db.run(async function(mongodb) {
            return await mongodb.collection('quotes').find({id: id}).toArray();
        })
    },
    async create(data) {
        return await db.run(async function(mongodb) {
            return await mongodb.collection('quotes').insertOne(data);
        })
    },
};