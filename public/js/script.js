const sidebarButtonTexts = document.querySelectorAll(".buttonText");
const sidebar = document.querySelector(".sidebar");
const sidebarTitle = document.querySelector(".sidebar--menu--text");
const panels = document.querySelectorAll(".panel");

const collapseButton = document.getElementById("collapseButton");
const extendButton = document.getElementById("extendButton");
const workoutButton = document.getElementById("workoutButton");
const mealButton = document.getElementById("mealButton");
const waterButton = document.getElementById("waterButton");
const leaderboardButton = document.getElementById("leaderboardButton");
const profileButton = document.getElementById("profileButton");

let sidebarState = "expanded";
let focusedPanel = "workout";
// updateSidebar();
// extendButton.classList.add("sidebarButtonsCollapsed");
extendButton.style.display = "none";
updatePanels();

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
    sidebarButtonTexts.forEach((element) => {
      element.classList.add("sidebarButtonsCollapsed");
    });
    sidebarTitle.classList.add("sidebarButtonsCollapsed");
    sidebarTitle.style.display = "none";

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

    sidebarTitle.classList.remove("sidebarButtonsCollapsed");
    sidebarTitle.style.display = "initial";

    sidebarButtonTexts.forEach((element) => {
      element.classList.remove("sidebarButtonsCollapsed");
    });

    panels.forEach((element) => {
      element.classList.add("panelExpanded");
      element.classList.remove("panelCollapsed");
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
