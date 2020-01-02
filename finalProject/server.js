const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 8090;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(routes);


mongoose.connect(
  process.env.MONGODB_URI || 
  "mongodb://davidtardy:keds4510@ds139425.mlab.com:39425/heroku_nj6bwtlb",
  {useNewUrlParser:true,useUnifiedTopology: true}
  );


app.listen(PORT, function() {
  console.log(`API Server now listening on PORT ${PORT}!`);
});
