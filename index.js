const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')
const connectDB = require('./config/db');
var cors = require('cors')
app.listen(PORT, () => {
  console.log("Server run on port " + PORT);
});
app.use(bodyParser.json());
connectDB();
app.use("/public", express.static("public"));
app.use('/api/users',require('./routers/users/users'));
app.use('/api/crawlDataAmazon',require('./routers/crawlAmazon/index'));











