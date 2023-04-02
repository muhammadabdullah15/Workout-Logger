const signInButton = document.getElementById("signInButton");
const signUpButton = document.getElementById("signUpButton");
const passwordReveal = document.getElementById("passwordReveal");

let selector = "signIn";
let passwordRevealed = "hidden";
signUpButton.classList.add("hover-animation");
updateSelector();

function updateSelector() {
  if (selector == "signIn") {
    signUpButton.classList.remove("selectorButtonSelected");
    signInButton.classList.add("selectorButtonSelected");
  } else if (selector == "signUp") {
    signInButton.classList.remove("selectorButtonSelected");
    signUpButton.classList.add("selectorButtonSelected");
  }
}

signInButton.onclick = function () {
  if (selector != "signIn") {
    selector = "signIn";
    updateSelector();
    signInButton.classList.remove("hover-animation");
  }
};

signUpButton.onclick = function () {
  if (selector != "signUp") {
    selector = "signUp";
    updateSelector();
    signUpButton.classList.remove("hover-animation");
  }
};

passwordReveal.onclick = function () {
  console.log(passwordReveal.src);
  console.log("toggle");
  if (passwordRevealed == "revealed") {
    passwordRevealed = "hidden";
    passwordReveal.src = "http://localhost:8800/eye-outline.svg";
    console.log(passwordReveal.src);
  } else {
    passwordRevealed = "revealed";
    passwordReveal.src = "http://localhost:8800/eye-off-outline.svg";
    console.log(passwordReveal.src);
  }
};

signInButton.onmouseover = function () {
  if (selector == "signUp") {
    signInButton.classList.add("hover-animation");
  }
};

signUpButton.onmouseover = function () {
  if (selector == "signIn") {
    signUpButton.classList.add("hover-animation");
  }
};
