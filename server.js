require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const port = process.env.PORT || 8800;
const { pool } = require("./db");
// const { OAuth2Client } = require("google-auth-library");
// const gClient = new OAuth2Client ()
// const { Console } = require("console");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/images")));
app.use(express.static(path.join(__dirname, "/public/stylesheets")));

//AUTHENTICATION BASED CALLS
app.get("/login", authenticate, async (req, res, next) => {
  if (res.locals.id) {
    console.log(`User ${res.locals.id} authenticated`);
    res.send("User Authenticated");
  } else {
    console.log("Session expired");
    res.redirect("/signIn");
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

//WORKOUT PANEL + WORKOUT HISTORY PANEL CALLS
app.post("/addNewWorkout", authenticate, async (req, res) => {
  const type = req.body.type;
  const intensity = req.body.intensity;
  const coordinates = req.body.coordinates;
  const duration = req.body.duration;
  const date = req.body.date;

  const queryText = `INSERT INTO Works_out(u_id,w_id,wo_intensity,wo_coordinates,wo_duration,wo_workout_date) VALUES
    ('${res.locals.id}','${type}','${intensity}','${coordinates}','${duration}','${date}')`;

  await runQuery(queryText);
  res.send({ status: 200 });
});

app.get("/getUserWorkoutsData", authenticate, async (req, res) => {
  const queryText = `SELECT wo_id,w_name, wo_intensity, wo_coordinates, wo_duration, wo_workout_date,
        CASE
            WHEN wo_intensity = 'l' THEN w_cpm_low
            WHEN wo_intensity = 'm' THEN w_cpm_medium
            WHEN wo_intensity = 'h' THEN w_cpm_high
        END * wo_duration AS wo_calories
    FROM Works_out, Workout 
    WHERE Works_out.w_id = Workout.w_id 
    AND u_id = '${res.locals.id}' 
    ORDER BY wo_id DESC;`;
  const data = await runQuery(queryText);
  res.json(data);
});

app.post("/deleteWorkout", async (req, res) => {
  const queryText = `DELETE FROM Works_out WHERE wo_id=${req.body.wo_id}`;
  await runQuery(queryText);
  res.json("Successfully deleted");
});

app.post("/getCalorieData", authenticate, async (req, res) => {
  const queryText = `SELECT * FROM Workout WHERE w_name='${req.body.type}'`;
  const data = await runQuery(queryText);
  res.json(data[0]);
});

//MEAL PANEL CALLS
app.get("/getUserMealPlanData", authenticate, async (req, res) => {
  const queryText = `SELECT Users.m_id,u_mealplan_joining_date,m_name,m_daily_calories,m_type,m_description FROM Mealplan,Users WHERE Users.m_id = Mealplan.m_id AND Users.u_id='${res.locals.id}';`;
  const data = await runQuery(queryText);
  res.json(data[0]);
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
  await runQuery(queryText);
  res.json("Successfully changed");
});

app.post("/unfollowUserMealPlan", authenticate, async (req, res) => {
  const queryText = `UPDATE Users SET m_id=NULL,u_mealplan_joining_date=NULL WHERE u_id='${res.locals.id}'`;
  await runQuery(queryText);
  res.json("Successfully changed");
});

//SOCIAL PANEL CALLS
app.post("/addFollow", authenticate, async (req, res) => {
  if (req.body.f_id == res.locals.id) {
    res.send({ status: 1200, error: "Cannot follow yourself" });
    return;
  }

  const checkQuery1 = `SELECT u_id FROM Users WHERE u_id=${req.body.f_id};`;
  const data1 = await runQuery(checkQuery1);

  if (data1.length == 0) {
    res.send({ status: 1200, error: "User ID does not exist!" });
    return;
  }

  const checkQuery2 = `SELECT u_id FROM Follows WHERE f_id=${req.body.f_id} AND u_id='${res.locals.id}';`;
  const data2 = await runQuery(checkQuery2);

  if (data2.length != 0) {
    res.send({ status: 1200, error: "Already following User!" });
    return;
  }

  //IF ALL CHECKS PASSED
  const queryText = `INSERT INTO Follows(u_id,f_id,f_date_added) VALUES
        ('${res.locals.id}','${req.body.f_id}','${req.body.date}')`;

  try {
    await runQuery(queryText);
    res.send({ status: 200 });
  } catch (error) {
    console.error(error);
    res.send("An error occurred while adding the follow.");
  }
});

app.get("/getFollowedUsers", authenticate, async (req, res) => {
  const queryText = `
    SELECT u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_name, f.f_date_added,
       SUM(
            CASE
                WHEN wo_intensity = 'l' THEN w_cpm_low
                WHEN wo_intensity = 'm' THEN w_cpm_medium
                WHEN wo_intensity = 'h' THEN w_cpm_high
            END * wo_duration) AS wo_calories
    FROM Works_out wo
    JOIN Users u ON u.u_id = wo.u_id
    JOIN Workout w ON wo.w_id = w.w_id
    JOIN Mealplan m ON u.m_id = m.m_id
    JOIN Follows f ON u.u_id = f.f_id
    WHERE wo_workout_date >= date_trunc('week', current_date)::date AND f.u_id = '${res.locals.id}'
    GROUP BY u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_id, m.m_name, f.f_date_added
    ORDER BY wo_calories DESC;`;
  const data = await runQuery(queryText);
  res.json(data);
});

app.post("/unfollowUser", authenticate, async (req, res) => {
  const queryText = `DELETE FROM Follows WHERE u_id='${res.locals.id}' AND f_id='${req.body.f_id}';`;
  await runQuery(queryText);
  res.json("Successfully changed");
});

//LEADERBOARD PANEL CALLS
app.get("/getGlobalWeeklyCalorieData", async (req, res) => {
  const queryText = `
    SELECT u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_name,
       SUM(
            CASE
                WHEN wo_intensity = 'l' THEN w_cpm_low
                WHEN wo_intensity = 'm' THEN w_cpm_medium
                WHEN wo_intensity = 'h' THEN w_cpm_high
            END * wo_duration) AS wo_calories
    FROM Works_out wo
    JOIN Users u ON u.u_id = wo.u_id
    JOIN Workout w ON wo.w_id = w.w_id
    JOIN Mealplan m ON u.m_id = m.m_id
    WHERE wo_workout_date >= date_trunc('week', current_date)::date
    GROUP BY u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_id, m.m_name
    ORDER BY wo_calories DESC;
`;
  const data = await runQuery(queryText);
  res.json(data);
});

app.get("/getGlobalAllTimeCalorieData", async (req, res) => {
  const queryText = `
    SELECT u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, 
       m.m_id, m.m_name,
       SUM(
            CASE
                WHEN wo_intensity = 'l' THEN w_cpm_low
                WHEN wo_intensity = 'm' THEN w_cpm_medium
                WHEN wo_intensity = 'h' THEN w_cpm_high
            END * wo_duration) AS wo_calories
    FROM Works_out wo
    JOIN Users u ON u.u_id = wo.u_id
    JOIN Workout w ON wo.w_id = w.w_id
    JOIN Mealplan m ON u.m_id = m.m_id
    GROUP BY u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_id, m.m_name
    ORDER BY wo_calories DESC;
`;
  const data = await runQuery(queryText);
  res.json(data);
});

app.get("/getFollowWeeklyCalorieData", authenticate, async (req, res) => {
  const queryText = `
    SELECT u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_name,
       SUM(
            CASE
                WHEN wo_intensity = 'l' THEN w_cpm_low
                WHEN wo_intensity = 'm' THEN w_cpm_medium
                WHEN wo_intensity = 'h' THEN w_cpm_high
            END * wo_duration) AS wo_calories
    FROM Works_out wo
    JOIN Users u ON u.u_id = wo.u_id
    JOIN Workout w ON wo.w_id = w.w_id
    JOIN Mealplan m ON u.m_id = m.m_id
    WHERE wo_workout_date >= date_trunc('week', current_date)::date 
    AND (u.u_id IN (SELECT f_id FROM Follows WHERE u_id = '${res.locals.id}') OR u.u_id='${res.locals.id}')
    GROUP BY u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_id, m.m_name
    ORDER BY wo_calories DESC;

`;
  const data = await runQuery(queryText);
  res.json(data);
});

app.get("/getFollowAllTimeCalorieData", authenticate, async (req, res) => {
  const queryText = `
    SELECT u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_name,
       SUM(
            CASE
                WHEN wo_intensity = 'l' THEN w_cpm_low
                WHEN wo_intensity = 'm' THEN w_cpm_medium
                WHEN wo_intensity = 'h' THEN w_cpm_high
            END * wo_duration) AS wo_calories
    FROM Works_out wo
    JOIN Users u ON u.u_id = wo.u_id
    JOIN Workout w ON wo.w_id = w.w_id
    JOIN Mealplan m ON u.m_id = m.m_id
    WHERE (u.u_id IN (SELECT f_id FROM Follows WHERE u_id = '${res.locals.id}') OR u.u_id='${res.locals.id}')
    GROUP BY u.u_id, u.u_first_name, u.u_middle_name, u.u_last_name, m.m_id, m.m_name
    ORDER BY wo_calories DESC;
`;
  const data = await runQuery(queryText);
  res.json(data);
});

//PROFILE PANEL CALLS
app.get("/getUserProfileData", authenticate, async (req, res) => {
  const queryText = `SELECT u_id,u_first_name,u_middle_name,u_last_name,u_email,u_birth_date,u_height,u_weight FROM Users WHERE u_id='${res.locals.id}'`;
  const data = await runQuery(queryText);
  res.json(data[0]);
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
  const token = req.cookies.WorkoutLoggerToken;
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

app.get("/", authenticate, async (req, res) => {
  if (res.locals.id) res.render("index");
  else res.redirect("signIn");
});

app.get("/signIn", async (req, res) => {
  res.render("signIn");
});

app.listen(port, () => {
  console.log(`Listening on port ${port} at http://localhost:${port}`);
});
