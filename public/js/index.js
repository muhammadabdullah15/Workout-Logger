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
    console.log("Collapse");

    panels.forEach((element) => {
      element.classList.remove("panelExpandedAnimation");
      element.classList.add("panelCollapsedAnimation");
    });

    sidebarButtons.forEach((element) => {
      element.classList.remove("sidebar--button--hover");
    });
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
    console.log("Expand");

    sidebar.classList.remove("sidebarCollapsed");
    sidebar.classList.add("sidebarExpanded");

    collapseButton.style.display = "initial";

    extendButton.style.display = "none";

    sidebarMenu.classList.add("sidebarTitleExtended");
    sidebarMenu.classList.remove("sidebarTitleCollapsed");

    sidebarButtons.forEach((element) => {
      element.classList.add("sidebar--button--hover");
    });
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
  console.log("authenticating");
  fetch("/login", {
    method: "GET",
    credentials: "same-origin",
  }).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
  });
}

async function runTestQuery() {
  try {
    const res = await fetch("/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "SELECT * FROM Users",
      }),
    });
    const data = await res.json();
    console.log("TEST QUERY BUTTON OUTPUT");
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function getTestData() {
  console.log("GET DATA OUTPUT");
  try {
    const res = await fetch("/testGetData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    console.log(data);
    u_first_name.innerText = data[0].u_first_name;
    u_last_name.innerText = data[0].u_last_name;
    u_email.innerText = data[0].u_email;
    u_birth_date.innerText = data[0].u_birth_date;
    u_weight.innerText = data[0].u_weight;
    u_height.innerText = data[0].u_height;
    u_body_type.innerText = data[0].u_body_type;
  } catch (error) {
    console.log(error);
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

testButton.onclick = function () {
  // runTestQuery();
  getTestData();
};

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
  html += `<div class="panel-row">
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
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  location.reload();
}
