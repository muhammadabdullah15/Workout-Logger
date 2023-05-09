//FORM ELEMENTS

const registrationDetails = document.querySelector(".registration-details");
const steps = document.querySelectorAll(".step");
const leftButtons = document.querySelectorAll(".left-arrow");
const rightButtons = document.querySelectorAll(".right-arrow");
const formContainer = document.querySelector(".container");
const registrationDetailsContainer = document.querySelector(
  ".registration-details-container"
);

let URL = window.location.href.split("/", 3).join("/");

//INITIALIZATION
signInPasswordErrorPrompt.style.opacity = 0;
signUpPasswordErrorPrompt.style.opacity = 0;

let selector = "signUp";
let signInPasswordRevealed = "hidden";
let signUpPasswordRevealed = "hidden";
let signUpConfirmPasswordRevealed = "hidden";

signUpButtonSelector.classList.add("hover-animation");
updateSelector();

signInEmailWarning.style.opacity = 0;
signInPasswordWarning.style.opacity = 0;
signUpEmailWarning.style.opacity = 0;
signUpFirstNameWarning.style.opacity = 0;
signUpLastNameWarning.style.opacity = 0;
signUpPasswordWarning.style.opacity = 0;
signUpConfirmPasswordWarning.style.opacity = 0;

registrationDetails.display = "none";
let activeStep = 1;
let currentDate = new Date().toJSON().slice(0, 10);
let selectedUnit = "cm";

//FORM SELECTOR AND SUBMIT BUTTONS
function updateSelector() {
  signInForm.reset();
  signUpForm.reset();
  if (selector == "signIn") {
    signUpButtonSelector.classList.remove("selectorButtonSelected");
    signInButtonSelector.classList.add("selectorButtonSelected");
    signUpForm.classList.remove("selected-form");
    signInForm.classList.add("selected-form");
    document.title = "Sign In";
    signInEmailInput.focus();
  } else if (selector == "signUp") {
    signInButtonSelector.classList.remove("selectorButtonSelected");
    signUpButtonSelector.classList.add("selectorButtonSelected");
    signInForm.classList.remove("selected-form");
    signUpForm.classList.add("selected-form");
    document.title = "Sign Up";
    signUpEmailInput.focus();
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
        signInPasswordErrorPrompt.style.opacity = 1;
        return;
      }
      window.location.href = res.path;
    });
});

//DATA VALIDITY CHECKS
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const containsUpperCase = /[A-Z]/;
const containsLowerCase = /[a-z]/;
const containsNumber = /[0-9]/;
const containsSpecialChar = /[@$!%*?&]/;
let passwordStrength = 0;

async function checkEmailExists() {
  const email = signUpEmailInput.value.trim();

  const result = await fetch("/checkEmailExists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  }).then((res) => res.json());
  return result;
}

signUpEmailInput.addEventListener("input", function () {
  if (
    signUpEmailInput.value == "" ||
    emailRegex.test(signUpEmailInput.value.trim())
  )
    displayInvalidWarning("signUpEmailWarning", true);
  else displayInvalidWarning("signUpEmailWarning", false);
});
signUpEmailWarning.addEventListener("mouseover", function () {
  if (this.style.opacity == 1) {
    this.innerHTML = "Invalid email format!";
    this.style.cursor = "pointer";
    signUpEmailWarningMessage.style.display = "flex";
  }
});
signUpEmailWarning.addEventListener("mouseout", function () {
  this.style.cursor = "default";
  signUpEmailWarningMessage.style.display = "none";
});

signUpFirstNameInput.addEventListener("input", function () {
  if (signUpFirstNameInput.value.length >= 3)
    displayInvalidWarning("signUpFirstNameWarning", true);
  else displayInvalidWarning("signUpFirstNameWarning", false);
});
signUpFirstNameWarning.addEventListener("mouseover", function () {
  if (this.style.opacity == 1) {
    this.style.cursor = "pointer";
    signUpFirstNameWarningMessage.style.display = "flex";
  }
});
signUpFirstNameWarning.addEventListener("mouseout", function () {
  this.style.cursor = "default";
  signUpFirstNameWarningMessage.style.display = "none";
});

signUpLastNameInput.addEventListener("input", function () {
  if (signUpLastNameInput.value.length >= 3)
    displayInvalidWarning("signUpLastNameWarning", true);
  else displayInvalidWarning("signUpLastNameWarning", false);
});
signUpLastNameWarning.addEventListener("mouseover", function () {
  if (this.style.opacity == 1) {
    this.style.cursor = "pointer";
    signUpLastNameWarningMessage.style.display = "flex";
  }
});
signUpLastNameWarning.addEventListener("mouseout", function () {
  this.style.cursor = "default";
  signUpLastNameWarningMessage.style.display = "none";
});

signUpPasswordInput.addEventListener("input", function () {
  const password = signUpPasswordInput.value;

  if (password == signUpConfirmPasswordInput.value) {
    displayInvalidWarning("signUpConfirmPasswordWarning", true);
  }

  if (containsUpperCase.test(password)) passwordStrength++;
  if (containsLowerCase.test(password)) passwordStrength++;
  if (containsNumber.test(password)) passwordStrength++;
  if (containsSpecialChar.test(password)) passwordStrength++;

  if (signUpPasswordInput.value == "")
    displayInvalidWarning("signUpPasswordWarning", true);
  else if (password.length < 8 || passwordStrength < 3)
    displayInvalidWarning("signUpPasswordWarning", false);
  else displayInvalidWarning("signUpPasswordWarning", true);
});
signUpPasswordWarning.addEventListener("mouseover", function () {
  if (this.style.opacity == 1) {
    this.style.cursor = "pointer";
    signUpPasswordWarningMessage.style.display = "flex";
  }
});
signUpPasswordWarning.addEventListener("mouseout", function () {
  this.style.cursor = "default";
  signUpPasswordWarningMessage.style.display = "none";
});

signUpConfirmPasswordInput.addEventListener("input", function () {
  if (signUpPasswordInput.value != signUpConfirmPasswordInput.value)
    displayInvalidWarning("signUpConfirmPasswordWarning", false);
  else displayInvalidWarning("signUpConfirmPasswordWarning", true);
});
signUpConfirmPasswordWarning.addEventListener("mouseover", function () {
  if (this.style.opacity == 1) {
    this.style.cursor = "pointer";
    signUpConfirmPasswordWarningMessage.style.display = "flex";
  }
});
signUpConfirmPasswordWarning.addEventListener("mouseout", function () {
  this.style.cursor = "default";
  signUpConfirmPasswordWarningMessage.style.display = "none";
});

function displayInvalidWarning(id, isValid) {
  if (!isValid) {
    document.getElementById(id).style.opacity = 1;
  } else document.getElementById(id).style.opacity = 0;
}

function checkInputsValidity() {
  if (
    emailRegex.test(signUpEmailInput.value.trim()) &&
    signUpPasswordInput.value.length >= 8 &&
    passwordStrength >= 3 &&
    signUpPasswordInput.value == signUpConfirmPasswordInput.value &&
    signUpFirstNameInput.value.length >= 3 &&
    signUpLastNameInput.value.length >= 3
  )
    return true;
  return false;
}

//USER REGISTRATION FORM
signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!checkInputsValidity()) {
    signUpPasswordErrorPrompt.style.opacity = 1;
    return;
  }

  if (await checkEmailExists()) {
    signUpPasswordErrorPrompt.style.display = "initial";
    displayInvalidWarning("signUpEmailWarning", false);
    signUpEmailWarningMessage.innerHTML = "Email already exists";
    return;
  }

  updateStep();
  formContainer.classList.add("container-clip-state");
  registrationDetails.display = "initial";
  registrationDetails.classList.add("registration-details-visible");
  registrationDetailsContainer.classList.add(
    "registration-details-container-animation"
  );
});

function updateStep() {
  steps.forEach((element) => {
    element.style.display = "none";
  });

  document.getElementById(`step${activeStep}`).style.display = "flex";
}

for (i = 0; i < leftButtons.length; i++) {
  leftButtons[i].addEventListener("click", function () {
    activeStep = activeStep - 1;
    updateStep();
  });
}

for (i = 0; i < rightButtons.length; i++) {
  rightButtons[i].addEventListener("click", function () {
    activeStep = activeStep + 1;
    updateStep();
  });
}

//GENDER
rightButtons[1].style.display = "none";

genderInputFemale.onclick = function () {
  genderInputMale.classList.remove("step-content-img-selected");
  genderInputFemale.classList.add("step-content-img-selected");
  rightButtons[1].style.display = "initial";
};

genderInputMale.onclick = function () {
  genderInputFemale.classList.remove("step-content-img-selected");
  genderInputMale.classList.add("step-content-img-selected");
  rightButtons[1].style.display = "initial";
};

//DOB
dobInput.max = currentDate;
dobInput.value = currentDate;

//WEIGHT
weightInput.step = 0.5;
weightInput.oninput = function () {
  weightDisplay.innerHTML = `${this.value} kg`;
};

// HEIGHT
unitSelectorCm.classList.add("unit-selector-selected");
heightInput.step = 0.1;

heightInput.oninput = function () {
  updateHeightDisplay(this.value);
};

function updateHeightDisplay(value) {
  if (selectedUnit == "cm") {
    heightDisplay.innerHTML = `${value} cm`;
  } else if (selectedUnit == "inch") {
    heightDisplay.innerHTML = `${Math.floor(Math.round(value / 2.54) / 12)}' ${
      Math.round(value / 2.54) % 12
    }"`;
  }
}

unitSelectorCm.onclick = function () {
  if (selectedUnit == "inch") {
    selectedUnit = "cm";
    heightInput.step = 0.1;
    unitSelectorInches.classList.remove("unit-selector-selected");
    unitSelectorCm.classList.add("unit-selector-selected");
    updateHeightDisplay(heightInput.value);
  }
};

unitSelectorInches.onclick = function () {
  if (selectedUnit == "cm") {
    selectedUnit = "inch";
    heightInput.step = 0.3;
    unitSelectorCm.classList.remove("unit-selector-selected");
    unitSelectorInches.classList.add("unit-selector-selected");
    updateHeightDisplay(heightInput.value);
  }
};

finishSignUpButton.onclick = async function () {
  const email = signUpEmailInput.value.trim();
  const firstName = signUpFirstNameInput.value.trim();
  const lastName = signUpLastNameInput.value.trim();
  const middleName = signUpMiddleNameInput.value.trim();
  const password = signUpPasswordInput.value;
  const gender = genderInputMale.classList.contains("step-content-img-selected")
    ? "M"
    : "F";
  const DOB = dobInput.value;
  const weight = weightInput.value;
  const height = heightInput.value;

  const result = await fetch("/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName,
      middleName,
      lastName,
      password,
      gender,
      DOB,
      weight,
      height,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        alert("Error registering user");
        return;
      }
      window.location.href = res.path;
    });
};
