const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "local") {
  dotenv.config();
}

const url = process.env.MONGO_DB_URI;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(url, mongoOptions);

module.exports = client;
