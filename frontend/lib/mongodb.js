const { MongoClient } = require("mongodb");

const url = 'mongodb+srv://dbadmin:6vFeoOkYWQpka57d@cluster0.phbe6.mongodb.net/productdesigner?retryWrites=true&w=majority';
const client = new MongoClient(url, { useUnifiedTopology: true });

const cleanup = (event) => {
  client.close();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = client;