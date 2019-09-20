const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server run on port " + PORT);
});


app.use("/public", express.static("public"));
app.use('/api/users',require('./routers/users/index'));
app.use('/api/crawlDataAmazon',require('./routers/crawlAmazon/index'));










