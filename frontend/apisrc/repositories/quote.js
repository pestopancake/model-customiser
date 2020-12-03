import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghjkmnopqrstuvxyz', 12)

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
        return await db.run(async function (mongodb) {
            data.id = nanoid();
            var result = await mongodb.collection('quotes').insertOne(data);
            //todo: properly deal with failed insert
            if (result.result.ok === 1) {
                return data;
            }
            throw 'failed to insert';
        })
    },
};