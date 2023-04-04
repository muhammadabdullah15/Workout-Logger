const signInButtonSelector = document.getElementById("signInButtonSelector");
const signUpButtonSelector = document.getElementById("signUpButtonSelector");
const passwordReveal = document.getElementById("passwordReveal");
const passwordInput = document.getElementById("passwordInput");
const emailInput = document.getElementById("emailInput");
const passwordErrorPrompt = document.getElementById("passwordErrorPrompt");
// const signInButton = document.getElementById("signInButton");
const form = document.getElementById("form");

let URL = window.location.href.split("/", 3).join("/");

passwordErrorPrompt.style.display = "none";
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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const response = await fetch("/checkPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password: passwordInput.value,
      email: emailInput.value,
    }),
  });
  const result = await response.text();
  console.log(result);
  if (result == "false") {
    passwordErrorPrompt.style.display = "initial";
  } else {
    location.href = URL + "/";
  }
});

// signInButton.onclick = async function () {
//   //   location.href = URL + "/";
//   const plaintextPassword = document.getElementById("passwordInput").value;
//   try {
//     const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
//     console.log(hashedPassword);
//     // Send the hashed password to the server using AJAX or form submission
//   } catch (error) {
//     console.error(error);
//   }
// };
