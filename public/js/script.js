const collapseButton = document.getElementById("collapseButton");
const extendButton = document.getElementById("extendButton");
const sidebarButtonTexts = document.querySelectorAll(".buttonText");
const sidebar = document.querySelector(".sidebar");
const sidebarTitle = document.querySelector(".sidebar--menu--text");
let sidebarState = "expanded";

// updateSidebar();
extendButton.classList.add("sidebarButtonsCollapsed");

function updateSidebar() {
  if (sidebarState == "expanded") {
    console.log("Collapse");
    sidebarState = "collapsed";
    sidebarButtonTexts.forEach((element) => {
      element.classList.add("sidebarButtonsCollapsed");
    });
    sidebarTitle.classList.add("sidebarButtonsCollapsed");
    sidebar.classList.remove("sidebarExpanded");
    sidebar.classList.add("sidebarCollapsed");
    collapseButton.classList.add("sidebarButtonsCollapsed");
    extendButton.classList.remove("sidebarButtonsCollapsed");
  } else if (sidebarState == "collapsed") {
    console.log("Expand");
    sidebarState = "expanded";
    sidebarButtonTexts.forEach((element) => {
      element.classList.remove("sidebarButtonsCollapsed");
    });
  }
}

collapseButton.onclick = function () {
  updateSidebar();
};
