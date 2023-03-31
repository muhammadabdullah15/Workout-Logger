const collapseButton = document.getElementById("collapseButton");
const extendButton = document.getElementById("extendButton");
const sidebarButtonTexts = document.querySelectorAll(".buttonText");
const sidebar = document.querySelector(".sidebar");
const sidebarTitle = document.querySelector(".sidebar--menu--text");
let sidebarState = "expanded";

// updateSidebar();
// extendButton.classList.add("sidebarButtonsCollapsed");
extendButton.style.display = "none";

function updateSidebar() {
  if (sidebarState == "collapsed") {
    console.log("Collapse");

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
