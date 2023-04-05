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
const { pool } = require("./db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.static(path.join(__dirname, "/public/stylesheets")));

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
    const savedPassword = await getSavedPassword(userEmail);

    if (savedPassword == null) {
      isPasswordValid = false;
    } else {
      isPasswordValid = await bcrypt.compare(plaintextPassword, savedPassword);
    }
    console.log("check call output:");
    console.log(isPasswordValid);
    res.send(isPasswordValid);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.post("/query", async (req, res) => {
  const queryText = req.body.query;
  const data = await runQuery(queryText);
  console.log(data);
  res.json(data);
});

//0938281026 :)

async function runQuery(queryText) {
  const { rows } = await pool.query(queryText);
  return rows;
}

async function getSavedPassword(email) {
  const queryText =
    "SELECT u_password FROM Users WHERE u_email='" + email + "'";
  const result = await runQuery(queryText);
  if (result.length > 0) {
    return result[0].u_password;
  } else {
    return null;
  }
}

app.post("/testGetData", async (req, res) => {
  const signedInUserId = 1;
  const queryText =
    "SELECT u_first_name,u_last_name,u_email,u_birth_date,u_height,u_weight,u_body_type FROM Users WHERE u_id='" +
    signedInUserId +
    "'";
  const data = await runQuery(queryText);
  //   console.log(data);
  res.json(data);
});

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/signIn", async (req, res) => {
  res.render("signIn");
});

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
