const sidebarButtons = document.querySelectorAll(".sidebar--button");
const sidebarButtonImages = document.querySelectorAll(".buttonImages");
const sidebar = document.querySelector(".sidebar");
const sidebarMenu = document.querySelector(".sidebar--menu");
const panels = document.querySelectorAll(".panel");

const DateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Karachi",
};

let URL = window.location.href.split("/", 3).join("/");

let sidebarState = "expanded";
let focusedPanel = "workout";

extendButton.style.display = "none";
updatePanels();
updateSidebar();

getUserWorkouts();
getMealPlanData();
getFollowedUsers();
getUserProfileData();

let globalLeaderboardSelector = "weekly";
let followLeaderboardSelector = "allTime";
updateGlobalLeaderboardSelector();
updateFollowLeaderboardSelector();

function updatePanels() {
  panels.forEach((element) => {
    element.style.display = "none";
  });

  if (sidebarState == "expanded") {
    document
      .getElementById(focusedPanel)
      .classList.remove("panelExpandedAnimation");
    document.getElementById(focusedPanel).classList.remove("panelCollapsed");
    document.getElementById(focusedPanel).classList.add("panelExpanded");
  } else if (sidebarState == "collapsed") {
    document
      .getElementById(focusedPanel)
      .classList.remove("panelCollapsedAnimation");
    document.getElementById(focusedPanel).classList.remove("panelExpanded");
    document.getElementById(focusedPanel).classList.add("panelCollapsed");
  }
  document.getElementById(focusedPanel).style.display = "initial";
}

function updateSidebar() {
  if (sidebarState == "collapsed") {
    panels.forEach((element) => {
      element.classList.remove("panelExpandedAnimation");
      element.classList.add("panelCollapsedAnimation");
    });

    for (let i = 0; i < sidebarButtons.length - 1; i++) {
      sidebarButtons[i].classList.remove("sidebar--button--hover");
    }

    sidebarButtonImages.forEach((element) => {
      element.classList.add("sidebar--button--hover");
    });

    sidebarMenu.classList.remove("sidebarTitleExtended");
    sidebarMenu.classList.add("sidebarTitleCollapsed");

    sidebar.classList.remove("sidebarExpanded");
    sidebar.classList.add("sidebarCollapsed");

    collapseButton.style.display = "none";
    extendButton.style.display = "initial";
  } else if (sidebarState == "expanded") {
    sidebar.classList.remove("sidebarCollapsed");
    sidebar.classList.add("sidebarExpanded");

    collapseButton.style.display = "initial";

    extendButton.style.display = "none";

    sidebarMenu.classList.add("sidebarTitleExtended");
    sidebarMenu.classList.remove("sidebarTitleCollapsed");

    for (let i = 0; i < sidebarButtons.length - 1; i++) {
      sidebarButtons[i].classList.add("sidebar--button--hover");
    }

    sidebarButtonImages.forEach((element) => {
      element.classList.remove("sidebar--button--hover");
    });

    panels.forEach((element) => {
      element.classList.add("panelExpandedAnimation");
      element.classList.remove("panelCollapsedAnimation");
    });
  }
}

collapseButton.onclick = function () {
  sidebarState = "collapsed";
  updateSidebar();
};

extendButton.onclick = function () {
  sidebarState = "expanded";
  updateSidebar();
};

workoutButton.onclick = function () {
  if (focusedPanel == "workout") return;
  focusedPanel = "workout";
  updatePanels();
};

mealButton.onclick = function () {
  if (focusedPanel == "meal") return;
  focusedPanel = "meal";
  updatePanels();
};

workoutHistoryButton.onclick = function () {
  if (focusedPanel == "workoutHistory") return;
  focusedPanel = "workoutHistory";
  updatePanels();
};

socialButton.onclick = function () {
  if (focusedPanel == "social") return;
  focusedPanel = "social";
  updatePanels();
};

leaderboardButton.onclick = function () {
  if (focusedPanel == "leaderboard") return;
  focusedPanel = "leaderboard";
  updatePanels();
};

profileButton.onclick = function () {
  if (focusedPanel == "profile") return;
  focusedPanel = "profile";
  updatePanels();
};

signOutButton.onclick = function () {
  fetch("/logout", {
    method: "GET",
    credentials: "same-origin",
  }).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
  });
};

//WORKOUT + WORKOUT HISTORY PANEL
const workoutFormContainer = document.querySelector(".workout-form-container");
addWorkoutButton.style.display = "none";
workoutFormContainer.style.display = "none";
let workoutType, workoutIntensity, workoutDuration;
var increaseDurationInterval, decreaseDurationInterval;
updateDurationLabel();

closeWorkoutFormButton.onclick = function () {
  hideWorkoutForm();
};

function showWorkoutForm() {
  popup.style.display = "none";
  addWorkoutButton.style.display = "none";
  workoutFormTypeWalkingButton.classList.remove("workout-form-type-selected");
  workoutFormTypeRunningButton.classList.remove("workout-form-type-selected");
  workoutFormTypeCyclingButton.classList.remove("workout-form-type-selected");
  workoutIntensity = "Medium";
  workoutDuration = 1;
  workoutType = "";
  workoutFormIntensityLabel.innerHTML = `<div class="bold">${workoutIntensity}</div>`;
  updateDurationLabel();
  workoutFormContainer.style.display = "flex";
  workoutFormContainer.classList.add("workout-form-visible");
}

function hideWorkoutForm() {
  popup.style.display = "flex";
  workoutFormContainer.classList.remove("workout-form-visible");
  workoutFormContainer.style.display = "none";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    if (workoutFormContainer.classList.contains("workout-form-visible")) {
      hideWorkoutForm();
    } else if (
      addFollowFormContainer.classList.contains("workout-form-visible")
    ) {
      hideAddFollowForm();
    }
  }
});

workoutFormTypeWalkingButton.onclick = function () {
  workoutType = "Walking";
  workoutFormTypeWalkingButton.classList.add("workout-form-type-selected");
  workoutFormTypeRunningButton.classList.remove("workout-form-type-selected");
  workoutFormTypeCyclingButton.classList.remove("workout-form-type-selected");
  addWorkoutButton.style.display = "flex";
};

workoutFormTypeRunningButton.onclick = function () {
  workoutType = "Running";
  workoutFormTypeRunningButton.classList.add("workout-form-type-selected");
  workoutFormTypeWalkingButton.classList.remove("workout-form-type-selected");
  workoutFormTypeCyclingButton.classList.remove("workout-form-type-selected");
  addWorkoutButton.style.display = "flex";
};

workoutFormTypeCyclingButton.onclick = function () {
  workoutType = "Cycling";
  workoutFormTypeCyclingButton.classList.add("workout-form-type-selected");
  workoutFormTypeWalkingButton.classList.remove("workout-form-type-selected");
  workoutFormTypeRunningButton.classList.remove("workout-form-type-selected");
  addWorkoutButton.style.display = "flex";
};

increaseDurationButton.addEventListener("mousedown", function () {
  increaseDurationInterval = setInterval(function () {
    workoutDuration = workoutDuration + 1;
    updateDurationLabel();
  }, 150);
});

increaseDurationButton.addEventListener("mouseup", function () {
  clearInterval(increaseDurationInterval);
});

increaseDurationButton.addEventListener("mouseout", function () {
  clearInterval(increaseDurationInterval);
});

decreaseDurationButton.addEventListener("mousedown", function () {
  decreaseDurationInterval = setInterval(function () {
    if (workoutDuration > 1) {
      workoutDuration = workoutDuration - 1;
      updateDurationLabel();
    }
  }, 150);
});

decreaseDurationButton.addEventListener("mouseup", function () {
  clearInterval(decreaseDurationInterval);
});

decreaseDurationButton.addEventListener("mouseout", function () {
  clearInterval(decreaseDurationInterval);
});

increaseIntensityButton.onclick = function () {
  if (workoutIntensity == "Low") workoutIntensity = "Medium";
  else if (workoutIntensity == "Medium") workoutIntensity = "High";
  workoutFormIntensityLabel.innerHTML = `<div class="bold">${workoutIntensity}</div>`;
};

decreaseIntensityButton.onclick = function () {
  if (workoutIntensity == "Medium") workoutIntensity = "Low";
  else if (workoutIntensity == "High") workoutIntensity = "Medium";
  workoutFormIntensityLabel.innerHTML = `<div class="bold">${workoutIntensity}</div>`;
};

function updateDurationLabel() {
  const hours = Math.floor(workoutDuration / 60);
  const mins = workoutDuration % 60;
  workoutFormRowMinuteDurationContent.innerHTML = "";

  if (hours > 0) {
    workoutFormRowMinuteDurationContent.innerHTML += `${hours}`;
    if (hours > 1)
      workoutFormRowMinuteDurationContent.innerHTML += `<div class="bold"> hours </div>`;
    else
      workoutFormRowMinuteDurationContent.innerHTML += `<div class="bold"> hour </div>`;
  }
  workoutFormRowMinuteDurationContent.innerHTML += `${mins}`;

  if (mins > 1)
    workoutFormRowMinuteDurationContent.innerHTML += `<div class="bold"> minutes</div>`;
  else
    workoutFormRowMinuteDurationContent.innerHTML += `<div class="bold"> minute</div>`;
}

function getFormattedTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  result = "";

  if (hours > 0) {
    result += `${hours} hour`;
    if (hours > 1) result += "s";
  }
  result += `${mins} minute`;

  if (mins > 1) result += "s";

  return result;
}

async function saveNewWorkout(workout) {
  console.log(workout);

  const type =
    workout.type == "Walking" ? 1 : workout.type == "Running" ? 2 : 3;
  const intensity =
    workout.intensity == "Low"
      ? "l"
      : workout.intensity == "Medium"
      ? "m"
      : "h";
  const coordinates = workout.coords[0] + "," + workout.coords[1];
  const duration = workout.duration;
  const date = `${String(workout.date.getFullYear())}-${String(
    workout.date.getMonth() + 1
  ).padStart(2, "0")}-${String(workout.date.getDate()).padStart(2, "0")}`;

  const formattedDate = workout.date.toLocaleString("en-US", DateOptions);

  const res = await fetch("/addNewWorkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      intensity,
      coordinates,
      duration,
      date,
    }),
  });
  if (res.status === 200) console.log("Inserted Workout");
  else console.log("Error inserting workout");

  let data;
  try {
    const res = await fetch("/getCalorieData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "Walking" }),
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  const calories =
    duration *
    (workout.intensity == "Low"
      ? data.w_cpm_low
      : workout.intensity == "Medium"
      ? data.w_cpm_medium
      : data.w_cpm_high);
  console.log(`CAL: ${calories}`);
  const html = `<div class="panel-table-row">
                  <div class="panel-table-column-type">${workout.type}</div>
                  <div class="panel-table-column-duration">${getFormattedTime(
                    duration
                  )}</div>
                  <div class="panel-table-column-intensity">${
                    workout.intensity
                  }</div>
                  <div class="panel-table-column-calories">${calories} cal</div>
                  <div class="panel-table-column-date">${formattedDate}</div>
                  <div class="panel-table-column-delete-workout">
                    <img src="/trash-outline.svg" id="wo${
                      data.wo_id
                    }" alt="Delete" />
                  </div>
              </div>`;
  workoutHistoryTableTitleRow.insertAdjacentHTML("afterend", html);
}

async function getUserWorkouts() {
  let data;
  try {
    const res = await fetch("/getUserWorkoutsData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";

  data.forEach((obj) => {
    const date = new Date(obj.wo_workout_date);
    const formattedDate = date.toLocaleString("en-US", DateOptions);

    const desc = `${obj.w_name[0].toUpperCase()}${obj.w_name.slice(1)} on ${
      months[date.getMonth()]
    } ${date.getDate()}`;

    app._renderWorkoutMarker({
      coords: obj.wo_coordinates.split(","),
      type: obj.w_name,
      description: desc,
    });

    while (workoutHistoryTableTitleRow.nextElementSibling) {
      const currentSibling = workoutHistoryTableTitleRow.nextElementSibling;
      workoutHistoryTableTitleRow.nextElementSibling =
        currentSibling.nextElementSibling;
      currentSibling.remove();
    }

    html += `
        <div class="panel-table-row">
            <div class="panel-table-column-type">${obj.w_name}</div>
            <div class="panel-table-column-duration">${getFormattedTime(
              obj.wo_duration
            )}</div>
            <div class="panel-table-column-intensity">${
              obj.wo_intensity == "l"
                ? "Low"
                : obj.wo_intensity == "m"
                ? "Medium"
                : "High"
            }</div>
            <div class="panel-table-column-calories">${
              obj.wo_calories
            } cal</div>
            <div class="panel-table-column-date">${formattedDate}</div>
            <div class="panel-table-column-delete-workout">
              <img src="/trash-outline.svg" id="wo${obj.wo_id}" alt="Delete" />
            </div>
        </div>`;
  });

  workoutHistoryTable.insertAdjacentHTML("beforeend", html);

  deleteWorkoutButtons = document.querySelectorAll(
    ".panel-table-column-delete-workout"
  );

  for (i = 1; i < deleteWorkoutButtons.length; i++) {
    deleteWorkoutButtons[i].firstElementChild.addEventListener(
      "click",
      function () {
        deleteWorkout(this.id.substring(2));
      }
    );
  }
}

async function deleteWorkout(id) {
  try {
    const res = await fetch("/deleteWorkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wo_id: id }),
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }
  getUserWorkouts();
}

//MEAL PANEL
async function getUserMealPlanData() {
  let data;

  try {
    const res = await fetch("/getUserMealPlanData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";

  //   console.log(!data);
  if (!data) {
    html += `<div class="panel-row">
              <div class="panel-column-description" style="width:100%;">
                <div style="text-align: center; width:100%;">
                    You are not currently following any meal plan
                    <br><br>
                    <div class="bold">Select a meal plan below</div>
                </div>
              </div>
            </div>`;
    userMealPlanData.insertAdjacentHTML("afterbegin", html);
    return null;
  }

  const date = new Date(data.u_mealplan_joining_date);
  const formattedDate = date.toLocaleString("en-US", DateOptions);

  html += `<div class="panel-row">
            <div class="panel-column-description-unenroll" id="unfollowPlanButton">
                Unfollow Meal Plan
            </div>
              <div class="panel-column-title">${data.m_name}</div>
              <div class="panel-column-description">
                  ${data.m_description}
                <br><br><div class="bold">Daily Calories: </div>${data.m_daily_calories}
                <br><div class="bold">Following Since: </div>${formattedDate}
              </div>
            </div>`;

  userMealPlanData.insertAdjacentHTML("afterbegin", html);

  unfollowPlanButton.addEventListener("click", function () {
    unfollowMealplan();
  });

  return data.m_name;
}

async function getMealPlanData() {
  const userMealName = await getUserMealPlanData();
  let data;
  try {
    const res = await fetch("/getMealPlanData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";
  for (const key in data) {
    if (data[key].m_name == userMealName) continue;
    html += `<div class="panel-row">
        <div class="panel-column-description-enroll" id="mp${data[key].m_id}">
            Select Meal Plan
      </div>
      <div class="panel-column-title">${data[key].m_name}</div>
          <div class="panel-column-description">
            ${data[key].m_description}
            <br><br><div class="bold">Daily Calories: ${data[key].m_daily_calories}</div>
            </div>
        </div>`;
  }
  mealPlanData.insertAdjacentHTML("afterbegin", html);

  const updateMealPlanButtons = document.querySelectorAll(
    ".panel-column-description-enroll"
  );

  for (i = 0; i < updateMealPlanButtons.length; i++) {
    updateMealPlanButtons[i].addEventListener("click", function () {
      updateMealplan(this.id.substring(2));
    });
  }
}

async function updateMealplan(id) {
  try {
    const res = await fetch("/updateUserMealPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ m_id: id }),
    });
    data = await res.json();
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
  location.reload();
}

async function unfollowMealplan() {
  try {
    const res = await fetch("/unfollowUserMealPlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }
  location.reload();
}

//SOCIAL PANEL
const addFollowFormContainer = document.querySelector(
  ".add-follow-form-container"
);

hideAddFollowForm();

addFollowFormButton.onclick = function () {
  addFollowFormContainer.style.display = "flex";
  addFollowFormContainer.classList.add("workout-form-visible");
  addFollowButton.style.display = "none";
  addFollowErrorLabel.style.opacity = 0;
  searchFriendIDInput.value = "";
};

closeAddFollowFormButton.onclick = function () {
  hideAddFollowForm();
};

function hideAddFollowForm() {
  addFollowFormContainer.classList.remove("workout-form-visible");
  addFollowFormContainer.style.display = "none";
}

searchFriendIDInput.addEventListener("input", function () {
  addFollowButton.style.display = "flex";
});

addFollowButton.onclick = function () {
  addFollow();
};

async function addFollow() {
  const f_id = searchFriendIDInput.value;
  const date = new Date().toISOString();

  const res = await fetch("/addFollow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      f_id,
      date,
    }),
  });
  const data = await res.json();

  if (data.status === 1200) {
    addFollowErrorLabel.innerHTML = data.error;
    addFollowErrorLabel.style.opacity = 1;
  } else {
    console.log("Followed User");
    addFollowErrorLabel.style.opacity = 0;
    hideAddFollowForm();
  }
  getFollowedUsers();
}

async function getFollowedUsers() {
  let data;
  try {
    const res = await fetch("/getFollowedUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";

  while (followTableTitleRow.nextElementSibling) {
    const currentSibling = followTableTitleRow.nextElementSibling;
    followTableTitleRow.nextElementSibling = currentSibling.nextElementSibling;
    currentSibling.remove();
  }

  data.forEach((obj, i) => {
    const date = new Date(obj.f_date_added);
    const formattedDate = date.toLocaleString("en-US", DateOptions);
    const fullName = `${obj.u_first_name
      .charAt(0)
      .toUpperCase()}${obj.u_first_name.slice(1)} ${
      obj.u_middle_name
        ? obj.u_middle_name.charAt(0).toUpperCase() + obj.u_middle_name.slice(1)
        : ""
    } ${obj.u_last_name.charAt(0).toUpperCase()}${obj.u_last_name.slice(1)}`;

    html += `
          <div class="panel-table-row">
              <div class="panel-table-column-id">${obj.u_id}</div>
              <div class="panel-table-column">${fullName}</div>
              <div class="panel-table-column">${obj.wo_calories}</div>
              <div class="panel-table-column">${obj.m_name}</div>
              <div class="panel-table-column">${formattedDate}</div>
              <div class="panel-table-column-delete-follow">
                <img src="/trash-outline.svg" id="fo${obj.u_id}" alt="Delete" />
              </div>
          </div>
        `;
  });

  followTableTitleRow.insertAdjacentHTML("afterend", html);

  unfollowButtons = document.querySelectorAll(
    ".panel-table-column-delete-follow"
  );

  for (i = 1; i < unfollowButtons.length; i++) {
    unfollowButtons[i].firstElementChild.addEventListener("click", function () {
      unfollow(this.id.substring(2));
    });
  }
}

async function unfollow(id) {
  try {
    const res = await fetch("/unfollowUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ f_id: id }),
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }
  getFollowedUsers();
}

//LEADERBOARD PANEL
globalLeaderboardWeeklySelector.classList.add("hover-animation");
followLeaderboardWeeklySelector.classList.add("hover-animation");

function updateGlobalLeaderboardSelector() {
  if (globalLeaderboardSelector == "weekly") {
    globalLeaderboardAllTimeSelector.classList.remove("selectorButtonSelected");
    globalLeaderboardWeeklySelector.classList.add("selectorButtonSelected");
    getGlobalWeeklyLeaderboardData();
  } else if (globalLeaderboardSelector == "allTime") {
    globalLeaderboardWeeklySelector.classList.remove("selectorButtonSelected");
    globalLeaderboardAllTimeSelector.classList.add("selectorButtonSelected");
    getGlobalAllTimeLeaderboardData();
  }
}

globalLeaderboardWeeklySelector.onclick = function () {
  if (globalLeaderboardSelector == "weekly") return;
  globalLeaderboardSelector = "weekly";
  updateGlobalLeaderboardSelector();
};

globalLeaderboardAllTimeSelector.onclick = function () {
  if (globalLeaderboardSelector == "allTime") return;
  globalLeaderboardSelector = "allTime";

  updateGlobalLeaderboardSelector();
};

async function getGlobalWeeklyLeaderboardData() {
  let data;
  try {
    const res = await fetch("/getGlobalWeeklyCalorieData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";

  while (globalLeaderboardTableTitleRow.nextElementSibling) {
    const currentSibling = globalLeaderboardTableTitleRow.nextElementSibling;
    globalLeaderboardTableTitleRow.nextElementSibling =
      currentSibling.nextElementSibling;
    currentSibling.remove();
  }

  data.forEach((obj, i) => {
    const fullName = `${obj.u_first_name
      .charAt(0)
      .toUpperCase()}${obj.u_first_name.slice(1)} ${
      obj.u_middle_name
        ? obj.u_middle_name.charAt(0).toUpperCase() + obj.u_middle_name.slice(1)
        : ""
    } ${obj.u_last_name.charAt(0).toUpperCase()}${obj.u_last_name.slice(1)}`;

    html += `
      <div class="panel-table-row">`;

    if (i == 0)
      html += ` <div class="panel-table-column-rank"><img src="/crown-simple.svg" alt="1"></div>`;
    else
      html += `
              <div class="panel-table-column-rank">${i + 1}</div>`;

    html += `
              <div class="panel-table-column-id">${obj.u_id}</div>`;

    if (userProfileID.innerHTML == obj.u_id)
      html += `
              <div class="panel-table-column"><div class="bold">You</div></div>`;
    else
      html += `
              <div class="panel-table-column">${fullName}</div>`;

    html += `
              <div class="panel-table-column">${obj.wo_calories}</div>
              <div class="panel-table-column">${obj.m_name}</div>
          </div>`;
  });

  globalLeaderboardTableTitleRow.insertAdjacentHTML("afterend", html);
}

async function getGlobalAllTimeLeaderboardData() {
  let data;
  try {
    const res = await fetch("/getGlobalAllTimeCalorieData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";

  while (globalLeaderboardTableTitleRow.nextElementSibling) {
    const currentSibling = globalLeaderboardTableTitleRow.nextElementSibling;
    globalLeaderboardTableTitleRow.nextElementSibling =
      currentSibling.nextElementSibling;
    currentSibling.remove();
  }

  data.forEach((obj, i) => {
    const fullName = `${obj.u_first_name
      .charAt(0)
      .toUpperCase()}${obj.u_first_name.slice(1)} ${
      obj.u_middle_name
        ? obj.u_middle_name.charAt(0).toUpperCase() + obj.u_middle_name.slice(1)
        : ""
    } ${obj.u_last_name.charAt(0).toUpperCase()}${obj.u_last_name.slice(1)}`;

    html += `
      <div class="panel-table-row">`;

    if (i == 0)
      html += ` <div class="panel-table-column-rank"><img src="/crown-simple.svg" alt="1"></div>`;
    else
      html += `
              <div class="panel-table-column-rank">${i + 1}</div>`;

    html += `
              <div class="panel-table-column-id">${obj.u_id}</div>`;

    if (userProfileID.innerHTML == obj.u_id)
      html += `
               <div class="panel-table-column"><div class="bold">You</div></div>`;
    else
      html += `
              <div class="panel-table-column">${fullName}</div>`;

    html += `
              <div class="panel-table-column">${obj.wo_calories}</div>
              <div class="panel-table-column">${obj.m_name}</div>
          </div>`;
  });

  globalLeaderboardTableTitleRow.insertAdjacentHTML("afterend", html);
}

function updateFollowLeaderboardSelector() {
  if (followLeaderboardSelector == "weekly") {
    followLeaderboardAllTimeSelector.classList.remove("selectorButtonSelected");
    followLeaderboardWeeklySelector.classList.add("selectorButtonSelected");
    getFollowWeeklyLeaderboardData();
  } else if (followLeaderboardSelector == "allTime") {
    followLeaderboardWeeklySelector.classList.remove("selectorButtonSelected");
    followLeaderboardAllTimeSelector.classList.add("selectorButtonSelected");
    getFollowAllTimeLeaderboardData();
  }
}

followLeaderboardWeeklySelector.onclick = function () {
  if (followLeaderboardSelector == "weekly") return;
  followLeaderboardSelector = "weekly";
  updateFollowLeaderboardSelector();
};

followLeaderboardAllTimeSelector.onclick = function () {
  if (followLeaderboardSelector == "allTime") return;
  followLeaderboardSelector = "allTime";

  updateFollowLeaderboardSelector();
};

async function getFollowWeeklyLeaderboardData() {
  let data;
  try {
    const res = await fetch("/getFollowWeeklyCalorieData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";

  while (followLeaderboardTableTitleRow.nextElementSibling) {
    const currentSibling = followLeaderboardTableTitleRow.nextElementSibling;
    followLeaderboardTableTitleRow.nextElementSibling =
      currentSibling.nextElementSibling;
    currentSibling.remove();
  }

  data.forEach((obj, i) => {
    const fullName = `${obj.u_first_name
      .charAt(0)
      .toUpperCase()}${obj.u_first_name.slice(1)} ${
      obj.u_middle_name
        ? obj.u_middle_name.charAt(0).toUpperCase() + obj.u_middle_name.slice(1)
        : ""
    } ${obj.u_last_name.charAt(0).toUpperCase()}${obj.u_last_name.slice(1)}`;

    html += `
      <div class="panel-table-row">`;

    if (i == 0)
      html += ` <div class="panel-table-column-rank"><img src="/crown-simple.svg" alt="1"></div>`;
    else
      html += `
              <div class="panel-table-column-rank">${i + 1}</div>`;

    html += `
              <div class="panel-table-column-id">${obj.u_id}</div>`;

    if (userProfileID.innerHTML == obj.u_id)
      html += `
              <div class="panel-table-column"><div class="bold">You</div></div>`;
    else
      html += `
              <div class="panel-table-column">${fullName}</div>`;

    html += `
              <div class="panel-table-column">${obj.wo_calories}</div>
              <div class="panel-table-column">${obj.m_name}</div>
          </div>`;
  });

  followLeaderboardTableTitleRow.insertAdjacentHTML("afterend", html);
}

async function getFollowAllTimeLeaderboardData() {
  let data;
  try {
    const res = await fetch("/getFollowAllTimeCalorieData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  let html = "";

  while (followLeaderboardTableTitleRow.nextElementSibling) {
    const currentSibling = followLeaderboardTableTitleRow.nextElementSibling;
    followLeaderboardTableTitleRow.nextElementSibling =
      currentSibling.nextElementSibling;
    currentSibling.remove();
  }

  data.forEach((obj, i) => {
    const fullName = `${obj.u_first_name
      .charAt(0)
      .toUpperCase()}${obj.u_first_name.slice(1)} ${
      obj.u_middle_name
        ? obj.u_middle_name.charAt(0).toUpperCase() + obj.u_middle_name.slice(1)
        : ""
    } ${obj.u_last_name.charAt(0).toUpperCase()}${obj.u_last_name.slice(1)}`;

    html += `
      <div class="panel-table-row">`;

    if (i == 0)
      html += ` <div class="panel-table-column-rank"><img src="/crown-simple.svg" alt="1"></div>`;
    else
      html += `
              <div class="panel-table-column-rank">${i + 1}</div>`;

    html += `
              <div class="panel-table-column-id">${obj.u_id}</div>`;

    if (userProfileID.innerHTML == obj.u_id)
      html += `
               <div class="panel-table-column"><div class="bold">You</div></div>`;
    else
      html += `
              <div class="panel-table-column">${fullName}</div>`;

    html += `
              <div class="panel-table-column">${obj.wo_calories}</div>
              <div class="panel-table-column">${obj.m_name}</div>
          </div>`;
  });

  followLeaderboardTableTitleRow.insertAdjacentHTML("afterend", html);
}

//PROFILE PANEL
async function getUserProfileData() {
  let data;

  try {
    const res = await fetch("/getUserProfileData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await res.json();
  } catch (error) {
    console.log(error);
  }

  const fullName = `${data.u_first_name
    .charAt(0)
    .toUpperCase()}${data.u_first_name.slice(1)} ${
    data.u_middle_name
      ? data.u_middle_name.charAt(0).toUpperCase() + data.u_middle_name.slice(1)
      : ""
  } ${data.u_last_name.charAt(0).toUpperCase()}${data.u_last_name.slice(1)}`;

  profileNameLabel.innerHTML = `Welcome, <div class="bold">${fullName}</div>`;
  userProfileEmail.innerHTML = data.u_email;
  userProfileID.innerHTML = data.u_id;
  userProfileFirstName.innerHTML = data.u_first_name;
  userProfileMiddleName.innerHTML =
    data.u_middle_name == null ? "-" : data.u_middle_name;
  userProfileLastName.innerHTML = data.u_last_name;
  userProfileDOB.innerHTML = new Date(data.u_birth_date)
    .toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/g, "$1<sup>$2</sup>");
  userProfileHeight.innerHTML = `${Math.trunc(data.u_height)} cm  (${Math.floor(
    data.u_height / 2.54 / 12
  )}'${Math.round(
    data.u_height / 2.54 - Math.floor(data.u_height / 2.54 / 12) * 12
  )}")`;
  userProfileWeight.innerHTML = Math.trunc(data.u_weight);
}
