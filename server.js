require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { OAuth2Client } = require("google-auth-library");
// const gClient = new OAuth2Client ()
const JWT = require("jsonwebtoken");
const port = process.env.PORT || 8800;

//DB RELATED
const bodyParser = require("body-parser");
const db = require("./db.js");
app.use(bodyParser.json());

app.post("/query", (req, res) => {
  const query = req.body.query;
  const params = req.body.params;
  db.query(query, params, (rows) => {
    res.json(rows);
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.static(path.join(__dirname, "/public/stylesheets")));

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/signIn", async (req, res) => {
  res.render("signIn");
});

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
