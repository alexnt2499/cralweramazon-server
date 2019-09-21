const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')
const connectDB = require('./config/db');

app.listen(PORT, () => {
  console.log("Server run on port " + PORT);
});
app.use(bodyParser.json());
connectDB();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
      return res.status(200).json({});
  };
  next();
});
app.use("/public", express.static("public"));
app.use('/api/users',require('./routers/users/users'));
app.use('/api/crawlDataAmazon',require('./routers/crawlAmazon/index'));

app.get('/',(req,res) => {
  res.json({msg : 'My Server'});
})











