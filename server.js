require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
// const { OAuth2Client } = require("google-auth-library");
// const gClient = new OAuth2Client ()
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const port = process.env.PORT || 8800;
const { pool } = require("./db");
// const { Console } = require("console");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.static(path.join(__dirname, "/public/stylesheets")));

//AUTH BASED CALLS
app.get("/login", authenticate, async (req, res, next) => {
  if (res.locals.id) {
    console.log(`User ${res.locals.id} authenticated`);
  } else {
    console.log("Session expired");
    res.redirect("signIn");
  }
});

app.get("/logout", async (req, res) => {
  console.log("User logger out");
  res.clearCookie("WorkoutLoggerToken");
  res.redirect("/signIn");
});

app.post("/login", authenticate, login, async (req, res, next) => {
  if (res.locals.error) {
    res.send({ path: "/signIn", error: res.locals.error });
  } else {
    console.log("Login Successful....Redirecting");
    res.send({ path: "/" });
  }
});

//USER REGISTRATION CALLS
app.post("/signUp", async (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const middleName = req.body.middleName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const gender = req.body.gender;
  const DOB = req.body.DOB;
  const weight = req.body.weight;
  const height = req.body.height;

  //try-catch?
  const hashedPassword = await bcrypt.hash(password, 10);

  const queryText = `INSERT INTO Users(u_first_name,u_middle_name,u_last_name,u_email,u_password,u_gender,u_birth_date,u_height,u_weight) VALUES
('${firstName}',${
    middleName.length === 0 ? "NULL" : `'${middleName}'`
  },'${lastName}','${email}','${hashedPassword}','${gender}','${DOB}',${height},${weight});
`;
  await runQuery(queryText);
  console.log("Registration Successful....Redirecting");
  res.send({ path: "/signIn" });
});

app.post("/checkEmailExists", async (req, res) => {
  const email = req.body.email;
  const queryText = `SELECT u_email FROM users WHERE u_email= '${email}';`;
  const data = await runQuery(queryText);
  if (data.length > 0) res.json(true);
  else res.json(false);
});

//MEAL PANEL CALLS
app.get("/getUserMealPlanData", authenticate, async (req, res) => {
  const queryText1 = `SELECT m_id,u_mealplan_joining_date FROM Users WHERE u_id='${res.locals.id}'`;
  let data = await runQuery(queryText1);
  if (data[0].m_id != null) {
    const queryText2 = `SELECT m_name,m_daily_calories,m_type,m_description FROM Mealplan WHERE m_id=${data[0].m_id}`;
    const mealPlanData = await runQuery(queryText2);

    data = {
      ...data[0],
      ...mealPlanData[0],
    };
  }

  res.json(data);
});

app.get("/getMealPlanData", async (req, res) => {
  const queryText = "SELECT * FROM Mealplan";
  const data = await runQuery(queryText);
  res.json(data);
});

app.post("/updateUserMealPlan", authenticate, async (req, res) => {
  const m_id = req.body.m_id;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const formattedDate = `${year}-${month}-${day}`;
  const queryText = `UPDATE Users SET m_id='${m_id}',u_mealplan_joining_date='${formattedDate}' WHERE u_id='${res.locals.id}'`;
  console.log(queryText);
  await runQuery(queryText);
  res.json("Successfully changed");
});

//0938281026 :)

//UTILITY FUNCTIONS FOR CALLS
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

async function getIdByEmail(email) {
  const queryText = `SELECT u_id FROM Users WHERE u_email='${email}'`;
  const result = await runQuery(queryText);
  if (result.length > 0) {
    return result[0].u_id;
  } else {
    return null;
  }
}

async function generateToken(signedUserId) {
  const payload = { user_id: signedUserId };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };

  const token = JWT.sign(payload, secret, options);
  //   console.log(token);
  return token;
}

async function login(req, res, next) {
  console.log("Login attempted");
  const plaintextPassword = req.body.password;
  const userEmail = req.body.email;
  const userId = await getIdByEmail(userEmail);
  let isPasswordValid = false;
  try {
    const savedPassword = await getSavedPassword(userEmail);

    if (savedPassword == null) {
      isPasswordValid = false;
    } else {
      isPasswordValid = await bcrypt.compare(plaintextPassword, savedPassword);
    }
  } catch (error) {
    console.error(error);
  }
  if (isPasswordValid) {
    const token = await generateToken(userId);
    res.cookie("WorkoutLoggerToken", token, {
      sameSite: "None",
      secure: true,
      httpOnly: true,
    });
    console.log("Token generated: ", token);
    res.locals.id = userId;
    return next();
  } else {
    res.locals.error = "invalidPassword";
    return next();
  }
}

async function authenticate(req, res, next) {
  let token = req.cookies.WorkoutLoggerToken;
  if (!token) {
    console.log("Token not found");
    return next();
  } else {
    console.log("Token found .... attempting to verify");
    try {
      const user = JWT.verify(token, process.env.JWT_SECRET);
      res.locals.id = user.user_id;
      console.log("Token verified");
      return next();
    } catch (error) {
      console.error("Error verifying token:", error.message);
      return next();
    }
  }
}

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/signIn", async (req, res) => {
  res.render("signIn");
});

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
