const express =require('express');

const router = require("./routes/index");
const apiDocs = require("./swagger/index");

const app = express();

app.use(express.json());

app.use('/api', router);
app.use("/api-docs", apiDocs);

module.exports = app;

