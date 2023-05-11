const sidebarButtons = document.querySelectorAll(".sidebar--button");
const sidebarButtonImages = document.querySelectorAll(".buttonImages");
const sidebar = document.querySelector(".sidebar");
const sidebarMenu = document.querySelector(".sidebar--menu");
const panels = document.querySelectorAll(".panel");

let URL = window.location.href.split("/", 3).join("/");

let updateMealPlanButtons;

authenticateUser();

let sidebarState = "expanded";
let focusedPanel = "workout";

extendButton.style.display = "none";
updatePanels();
updateSidebar();
getMealPlanData();
getUserProfileData();

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

async function authenticateUser() {
  fetch("/login", {
    method: "GET",
    credentials: "same-origin",
  }).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
  });
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

//WORKOUT PANEL

//WORKOUT FORM
addWorkoutButton.style.display = "none";
const workoutFormContainer = document.querySelector(".workout-form-container");
let intensity = "Medium";
let duration = 1;
updateDurationLabel();
// workoutFormContainer.classList.add("hide-workout-form");
workoutFormContainer.style.display = "none";

showWorkoutForm();

function showWorkoutForm() {
  popup.style.display = "none";
  workoutFormContainer.style.display = "flex";
  workoutFormContainer.classList.add("workout-form-visible");
}

closeWorkoutFormButton.onclick = function () {
  popup.style.display = "flex";
  workoutFormContainer.classList.remove("workout-form-visible");
  workoutFormContainer.style.display = "none";
};

document.addEventListener("keydown", function (event) {
  if (workoutFormContainer.classList.contains("workout-form-visible")) {
    if (event.key === "Escape") {
      popup.style.display = "flex";
      workoutFormContainer.classList.remove("workout-form-visible");
      workoutFormContainer.style.display = "none";
    }
  }
});

workoutFormTypeWalkingButton.onclick = function () {
  workoutFormTypeWalkingButton.classList.add("workout-form-type-selected");
  workoutFormTypeRunningButton.classList.remove("workout-form-type-selected");
  workoutFormTypeCyclingButton.classList.remove("workout-form-type-selected");
  addWorkoutButton.style.display = "flex";
};

workoutFormTypeRunningButton.onclick = function () {
  workoutFormTypeRunningButton.classList.add("workout-form-type-selected");
  workoutFormTypeWalkingButton.classList.remove("workout-form-type-selected");
  workoutFormTypeCyclingButton.classList.remove("workout-form-type-selected");
  addWorkoutButton.style.display = "flex";
};

workoutFormTypeCyclingButton.onclick = function () {
  workoutFormTypeCyclingButton.classList.add("workout-form-type-selected");
  workoutFormTypeWalkingButton.classList.remove("workout-form-type-selected");
  workoutFormTypeRunningButton.classList.remove("workout-form-type-selected");
  addWorkoutButton.style.display = "flex";
};

var increaseDurationInterval, decreaseDurationInterval;

increaseDurationButton.addEventListener("mousedown", function () {
  increaseDurationInterval = setInterval(function () {
    duration = duration + 1;
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
    if (duration > 1) {
      duration = duration - 1;
      updateDurationLabel();
    }
  }, 150);
});

increaseIntensityButton.onclick = function () {
  if (intensity == "Low") intensity = "Medium";
  else if (intensity == "Medium") intensity = "High";
  workoutFormIntensityLabel.innerHTML = `<div class="bold">${intensity}</div>`;
};

decreaseIntensityButton.onclick = function () {
  if (intensity == "Medium") intensity = "Low";
  else if (intensity == "High") intensity = "Medium";
  workoutFormIntensityLabel.innerHTML = `<div class="bold">${intensity}</div>`;
};

decreaseDurationButton.addEventListener("mouseup", function () {
  clearInterval(decreaseDurationInterval);
});

decreaseDurationButton.addEventListener("mouseout", function () {
  clearInterval(decreaseDurationInterval);
});

function updateDurationLabel() {
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;
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

  if (!data.m_name) {
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

  html += `<div class="panel-row">
            <div class="panel-column-description-unenroll" id="unfollowPlanButton">
                Unfollow Meal Plan
            </div>
              <div class="panel-column-title">${data.m_name}</div>
              <div class="panel-column-description">
                  ${data.m_description}
                <br><br><div class="bold">Daily Calories: ${
                  data.m_daily_calories
                }</div>
                <br><div class="bold">Following Since: ${data.u_mealplan_joining_date.substring(
                  0,
                  10
                )}</div>
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
    // console.log(data);
  } catch (error) {
    console.log(error);
  }

  let html = "";
  for (const key in data) {
    if (data[key].m_name == userMealName) continue;
    html += `<div class="panel-row">
        <div class="panel-column-description-enroll" id="${data[key].m_id}">
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

  updateMealPlanButtons = document.querySelectorAll(
    ".panel-column-description-enroll"
  );

  for (i = 0; i < updateMealPlanButtons.length; i++) {
    updateMealPlanButtons[i].addEventListener("click", function () {
      updateMealplan(this.id);
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

  profileNameLabel.innerHTML = `Welcome, <div class="bold">${data.u_first_name} ${data.u_last_name}</div>`;
  userProfileEmail.innerHTML = data.u_email;
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
