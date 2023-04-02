require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { OAuth2Client } = require("google-auth-library");
// const gClient = new OAuth2Client ()
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const port = process.env.PORT || 8800;
const db = require("./db.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.static(path.join(__dirname, "/public/stylesheets")));

app.post("/query", (req, res) => {
  const query = req.body.query;
  const params = req.body.params;
  db.query(query, params, (rows) => {
    res.json(rows);
  });
});

app.post("/hash", async (req, res) => {
  const plaintextPassword = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
    res.send(hashedPassword);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bcrypt Encryption error while hashing");
  }
});

app.post("/checkPassword", async (req, res) => {
  const plaintextPassword = req.body.password;
  const userEmail = req.body.email;

  try {
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
    //check
    savedPassword = getSavedPassword(userEmail);
    // res.send(hashedPassword);
    console.log("check call output:");
    console.log(userEmail);

    console.log(savedPassword);

    res.send(savedPassword);
  } catch (error) {
    console.error(error);
    res.status(500).send("Bcrypt Encryption error while checking");
  }
});

function getSavedPassword(email, callback) {
  const params = [];
  let savedPassword = "";
  const query = "SELECT u_password FROM Users WHERE u_email='" + email + "'";
  //   console.log(query);
  db.query(query, params, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      savedPassword = result[0].u_password;
      console.log("function output");
      console.log(savedPassword);

      if (savedPassword == null) {
        callback(new Error("No password found for email: " + email), null);
      } else {
        callback(null, savedPassword);
      }
    }
  });
  //   return savedPassword;
}
console.log("test output");
getSavedPassword("e1", function (err, savedPassword) {
  if (err) {
    console.log("Error: ", err.message);
  } else {
    console.log("Saved password: ", savedPassword);
  }
});
// console.log(getSavedPassword("e1"));
// getSavedPassword("e1");

// const query = "SELECT u_password FROM Users WHERE u_email='e1'";

// console.log(db.query("SELECT u_password FROM Users WHERE u_email='e1'",[],null));

// db.query("ELECT u_password FROM Users WHERE u_email='e1'", (err, res) => {
//   if (err) throw err;
//   console.log(res.rows);
//   db.end();
// });

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/signIn", async (req, res) => {
  res.render("signIn");
});

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
