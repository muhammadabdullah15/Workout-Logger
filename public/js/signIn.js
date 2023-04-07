const signInButtonSelector = document.getElementById("signInButtonSelector");
const signUpButtonSelector = document.getElementById("signUpButtonSelector");
const signInPasswordReveal = document.getElementById("signInPasswordReveal");
const signInPasswordInput = document.getElementById("signInPasswordInput");
const signInEmailInput = document.getElementById("signInEmailInput");
const signInPasswordErrorPrompt = document.getElementById(
  "signInPasswordErrorPrompt"
);

const signUpPasswordReveal = document.getElementById("signUpPasswordReveal");
const signUpConfirmPasswordReveal = document.getElementById(
  "signUpConfirmPasswordReveal"
);
const signUpPasswordInput = document.getElementById("signUpPasswordInput");
const signUpEmailInput = document.getElementById("signUpEmailInput");

const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");

let URL = window.location.href.split("/", 3).join("/");

signInPasswordErrorPrompt.style.display = "none";

let selector = "signUp";
let signInPasswordRevealed = "hidden";
let signUpPasswordRevealed = "hidden";
let signUpConfirmPasswordRevealed = "hidden";

signUpButtonSelector.classList.add("hover-animation");
updateSelector();

function updateSelector() {
  signInForm.reset();
  signUpForm.reset();
  if (selector == "signIn") {
    signUpButtonSelector.classList.remove("selectorButtonSelected");
    signInButtonSelector.classList.add("selectorButtonSelected");
    signUpForm.classList.remove("selected-form");
    signInForm.classList.add("selected-form");
    document.title = "Sign In";
  } else if (selector == "signUp") {
    signInButtonSelector.classList.remove("selectorButtonSelected");
    signUpButtonSelector.classList.add("selectorButtonSelected");
    signInForm.classList.remove("selected-form");
    signUpForm.classList.add("selected-form");
    document.title = "Sign Up";
  }
}

signInButtonSelector.onclick = function () {
  if (selector != "signIn") {
    selector = "signIn";
    updateSelector();
    signInButtonSelector.classList.remove("hover-animation");
  }
};

signUpButtonSelector.onclick = function () {
  if (selector != "signUp") {
    selector = "signUp";
    updateSelector();
    signUpButtonSelector.classList.remove("hover-animation");
  }
};

signInPasswordReveal.onclick = function () {
  if (signInPasswordRevealed == "revealed") {
    signInPasswordRevealed = "hidden";
    signInPasswordReveal.src = URL + "/eye-outline.svg";
    signInPasswordInput.type = "password";
  } else {
    signInPasswordRevealed = "revealed";
    signInPasswordReveal.src = URL + "/eye-off-outline.svg";
    signInPasswordInput.type = "text";
  }
};

signUpPasswordReveal.onclick = function () {
  if (signUpPasswordRevealed == "revealed") {
    signUpPasswordRevealed = "hidden";
    signUpPasswordReveal.src = URL + "/eye-outline.svg";
    signUpPasswordInput.type = "password";
  } else {
    signUpPasswordRevealed = "revealed";
    signUpPasswordReveal.src = URL + "/eye-off-outline.svg";
    signUpPasswordInput.type = "text";
  }
};

signUpConfirmPasswordReveal.onclick = function () {
  console.log("toggle");
  if (signUpConfirmPasswordRevealed == "revealed") {
    signUpConfirmPasswordRevealed = "hidden";
    signUpConfirmPasswordReveal.src = URL + "/eye-outline.svg";
    signUpConfirmPasswordInput.type = "password";
  } else {
    signUpConfirmPasswordRevealed = "revealed";
    signUpConfirmPasswordReveal.src = URL + "/eye-off-outline.svg";
    signUpConfirmPasswordInput.type = "text";
  }
};

signInButtonSelector.onmouseover = function () {
  if (selector == "signUp") {
    signInButtonSelector.classList.add("hover-animation");
  }
};

signUpButtonSelector.onmouseover = function () {
  if (selector == "signIn") {
    signUpButtonSelector.classList.add("hover-animation");
  }
};

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  email = signInEmailInput.value;
  password = signInPasswordInput.value;

  const result = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        signInPasswordErrorPrompt.style.display = "initial";
        return;
      }
      window.location.href = res.path;
    });
});

document.querySelector(".registration-details").display = "none";
const steps = document.querySelectorAll(".step");

signUpForm.addEventListener("submit", async (event) => {
  updateStep(1);
  event.preventDefault();
  document.querySelector(".container").classList.add("container-clip-state");
  document.querySelector(".registration-details").display = "initial";
  document
    .querySelector(".registration-details")
    .classList.add("registration-details-visible");
  document
    .querySelector(".registration-details-container")
    .classList.add("registration-details-container-animation");
});

activeStep = 2;
function updateStep() {
  console.log(`Active step; ${activeStep}`);
  steps.forEach((element) => {
    element.style.display = "none";
  });

  document.getElementById(`step${activeStep}`).style.display = "flex";
}

var leftButtons = document.querySelectorAll(".left-arrow");
for (i = 0; i < leftButtons.length; i++) {
  leftButtons[i].addEventListener("click", function () {
    activeStep = activeStep - 1;
    // console.log(`p: new step set: ${activeStep}`);
    updateStep();
  });
}

var rightButtons = document.querySelectorAll(".right-arrow");
for (i = 0; i < rightButtons.length; i++) {
  rightButtons[i].addEventListener("click", function () {
    activeStep = activeStep + 1;
    // console.log(`n: new step set: ${activeStep}`);
    updateStep();
  });
}
document.getElementById("weightInput").step = 0.5;
document.getElementById("weightInput").oninput = function () {
  document.getElementById("weightDisplay").innerHTML = `${this.value} kg`;
};

// setTimeout(function () {
//   console.log("delayed");
// });
