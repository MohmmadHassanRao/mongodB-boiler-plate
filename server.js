const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

let dbURI =
  "mongodb+srv://hassan:hassan@cluster0.u0q5y.mongodb.net/firstdB?retryWrites=true&w=majority";

//   for LocalHost
// let dbURI = 'mongodb://localhost:27017/abc-database';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", () => {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", (err) => {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

//This function will run jst before app is closing
process.on("SIGINT", () => {
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
//mongodb connected disconnected events closes here//
let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  gender: String,
  createdOn: { type: Date, default: Date.now },
});
let userModel = mongoose.model("users", userSchema);

app.post("/signup", (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.phone ||
    !req.body.gender
  ) {
    res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "malik",
                "email": "malikasinger@gmail.com",
                "password": "abc",
                "phone": "03001234567",
                "gender": "Male"
            }`);
    return;
  }

  var newUser = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    gender: req.body.gender,
  });

  newUser.save((err, data) => {
    if (!err) {
      res.send("user created");
    } else {
      console.log(err);
      res.status(500).send("user create error, " + err);
    }
  });
});

app.listen(PORT, () => {
  console.log("server is running on: ", PORT);
});
