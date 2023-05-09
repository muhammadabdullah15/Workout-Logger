const sidebarButtons = document.querySelectorAll(".sidebar--button");
const sidebarButtonImages = document.querySelectorAll(".buttonImages");
const sidebar = document.querySelector(".sidebar");
const sidebarMenu = document.querySelector(".sidebar--menu");
const panels = document.querySelectorAll(".panel");

let URL = window.location.href.split("/", 3).join("/");

//TEST LABELS
const u_first_name = document.getElementById("u_first_name");
const u_last_name = document.getElementById("u_last_name");
const u_email = document.getElementById("u_email");
const u_birth_date = document.getElementById("u_birth_date");
const u_height = document.getElementById("u_height");
const u_weight = document.getElementById("u_weight");
const u_body_type = document.getElementById("u_body_type");
//TEST LABELS END

const collapseButton = document.getElementById("collapseButton");
const extendButton = document.getElementById("extendButton");
const workoutButton = document.getElementById("workoutButton");
const mealButton = document.getElementById("mealButton");
const workoutHistoryButton = document.getElementById("workoutHistoryButton");
const socialButton = document.getElementById("socialButton");
const profileButton = document.getElementById("profileButton");
const signOutButton = document.getElementById("signOutButton");

authenticateUser();

let sidebarState = "expanded";
let focusedPanel = "meal";

const testButton = document.getElementById("testButton");

extendButton.style.display = "none";
updatePanels();
updateSidebar();

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
  updateMealData();
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

//Meal plan db data
const mealPlanSelect = document.getElementById("mealplanChangeInput");
const mealPlanNameLabel = document.getElementById("mealPlanName");
const mealPlanCaloriesLabel = document.getElementById("mealPlanCalories");
const mealPlanTypeLabel = document.getElementById("mealPlanType");
const mealPlanDateLabel = document.getElementById("mealPlanDate");

async function updateMealData() {
  //user based mealplan data
  let data;

  try {
    const res = await fetch("/getUserMealPlanData", {
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

  console.log(data);
  if (data.m_id != null) {
    mealPlanNameLabel.innerHTML = data.m_name;
    mealPlanCaloriesLabel.innerHTML = data.m_daily_calories;
    mealPlanTypeLabel.innerHTML = data.m_type;
    mealPlanDateLabel.innerHTML = data.u_mealplan_joining_date.substring(0, 10);
  }

  //mealplan data options
  data = null;
  try {
    const res = await fetch("/getMealPlansData", {
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

  for (const key in data) {
    const option = document.createElement("option");
    const optionText = document.createTextNode(data[key].m_name);

    option.appendChild(optionText);
    option.value = data[key].m_id;
    mealPlanSelect.appendChild(option);
  }
}

changeMealPlanButton.onclick = function () {
  // console.log(mealPlanSelect.value);
  updateMealplan();
};

async function updateMealplan() {
  try {
    const res = await fetch("/updateUserMealplan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ m_id: mealPlanSelect.value }),
    });
    data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
