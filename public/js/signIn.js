const signInButtonSelector = document.getElementById("signInButtonSelector");
const signUpButtonSelector = document.getElementById("signUpButtonSelector");
const passwordReveal = document.getElementById("passwordReveal");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.getElementById("signInButton");
let URL = window.location.href.split("/", 3).join("/");

let selector = "signIn";
let passwordRevealed = "hidden";
signUpButtonSelector.classList.add("hover-animation");
updateSelector();

function updateSelector() {
  if (selector == "signIn") {
    signUpButtonSelector.classList.remove("selectorButtonSelected");
    signInButtonSelector.classList.add("selectorButtonSelected");
  } else if (selector == "signUp") {
    signInButtonSelector.classList.remove("selectorButtonSelected");
    signUpButtonSelector.classList.add("selectorButtonSelected");
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

passwordReveal.onclick = function () {
  console.log("toggle");
  if (passwordRevealed == "revealed") {
    passwordRevealed = "hidden";
    passwordReveal.src = URL + "/eye-outline.svg";
    passwordInput.type = "password";
  } else {
    passwordRevealed = "revealed";
    passwordReveal.src = URL + "/eye-off-outline.svg";
    passwordInput.type = "text";
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

signInButton.onclick = function () {
  location.href = URL + "/";
};