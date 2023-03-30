require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const { OAuth2Client } = require("google-auth-library");
// const gClient = new OAuth2Client ()
const JWT = require("jsonwebtoken");
const port = process.env.PORT || 8800;
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

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
