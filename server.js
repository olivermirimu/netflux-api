/*jslint es6 */
const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("server");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Movie = require("./models/movieModel");
const User = require("./models/userModel");
const MONGODB_URI =
  "mongodb+srv://Nico:niconetflux@netflux.pwqcz.mongodb.net/netflux?retryWrites=true&w=majority" ||
  "mongodb://localhost/movieApi";
// "mongodb://heroku_vqqc1kts:cue8h98gpu4p3368j3lmr5d1r1@ds145356.mlab.com:45356/heroku_vqqc1kts" ||
// "mongodb://localhost/movieApi" ||
// process.env.MONGODB_URI;
const db = mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    err
      ? console.log(`there is a prolem`, err.message)
      : console.log(`Your connection is ready`);
  }
);
mongoose.connection;

const app = express();
const port = process.env.PORT || 3500;
const apiRouter = require("./routes")(Movie, User);

app.use(morgan("tiny"));
app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(
    `Access-Control-Allow-Headers`,
    `Origin, X-Requested-With, Content-Type, Accept, Authorization`
  );
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

//routing ->routes.js
app.use("/api", apiRouter);

app.get("/", function (req, res) {
  res.send("Welcome to my API");
});

app.listen(port, function () {
  debug(`Listening on port ${chalk.green(port)}`);
});
