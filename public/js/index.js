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
const waterButton = document.getElementById("waterButton");
const leaderboardButton = document.getElementById("leaderboardButton");
const profileButton = document.getElementById("profileButton");
const signOutButton = document.getElementById("signOutButton");

authenticateUser();

let sidebarState = "expanded";
let focusedPanel = "profile";

const testButton = document.getElementById("testButton");
let signedUserId = 1;
// updateSidebar();
// extendButton.classList.add("sidebarButtonsCollapsed");
extendButton.style.display = "none";
updatePanels();
updateSidebar();

function updatePanels() {
  panels.forEach((element) => {
    element.style.display = "none";
  });
  document.getElementById(focusedPanel).style.display = "initial";
}

function updateSidebar() {
  if (sidebarState == "collapsed") {
    console.log("Collapse");

    // document.body.classList.remove("bodyCollapsed");
    // document.body.classList.add("bodyExpanded");

    panels.forEach((element) => {
      element.classList.add("panelCollapsed");
      element.classList.remove("panelExpanded");
    });
    sidebarButtons.forEach((element) => {
      //   element.classList.remove("sidebarButtonsExtended");
      element.classList.remove("sidebar--button--hover");
    });
    sidebarButtonImages.forEach((element) => {
      element.classList.add("sidebar--button--hover");
    });

    sidebarMenu.classList.remove("sidebarTitleExtended");
    sidebarMenu.classList.add("sidebarTitleCollapsed");
    // sidebarMenu.style.display = "none";

    sidebar.classList.remove("sidebarExpanded");
    sidebar.classList.add("sidebarCollapsed");
    // collapseButton.classList.add("sidebarButtonsCollapsed");
    collapseButton.style.display = "none";

    // extendButton.classList.remove("sidebarButtonsCollapsed");
    extendButton.style.display = "initial";
  } else if (sidebarState == "expanded") {
    console.log("Expand");

    // document.body.classList.remove("bodyExpanded");
    // document.body.classList.add("bodyCollapsed");

    sidebar.classList.remove("sidebarCollapsed");
    sidebar.classList.add("sidebarExpanded");

    //   collapseButton.classList.remove("sidebarButtonsCollapsed");
    collapseButton.style.display = "initial";

    //   extendButton.classList.add("sidebarButtonsCollapsed");
    extendButton.style.display = "none";

    sidebarMenu.classList.add("sidebarTitleExtended");
    sidebarMenu.classList.remove("sidebarTitleCollapsed");
    // sidebarMenu.style.display = "initial";

    sidebarButtons.forEach((element) => {
      //   element.classList.remove("sidebar--button--hover");
      element.classList.add("sidebar--button--hover");
    });
    sidebarButtonImages.forEach((element) => {
      element.classList.remove("sidebar--button--hover");
    });

    panels.forEach((element) => {
      element.classList.add("panelExpanded");
      element.classList.remove("panelCollapsed");
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

waterButton.onclick = function () {
  if (focusedPanel == "water") return;
  focusedPanel = "water";
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

testButton.onclick = function () {
  // runTestQuery();
  getTestData();
};
