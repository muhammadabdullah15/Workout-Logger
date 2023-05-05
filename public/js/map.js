"use strict";

// const form = document.querySelector(".form");
// const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
// let workoutEditEl;

const workoutFormContainer = document.querySelector(".workout-form-container");
const closeFormButton = document.getElementById("closeFormButton");
const popup = document.getElementById("popup");
const intensityDecrease = document.getElementById("intensityInputDecrease");
const intensityIncrease = document.getElementById("intensityInputIncrease");
const intensityLabel = document.getElementById("intensityLabel");
let intensity = "Medium";
// workoutFormContainer.classList.add("hide-workout-form");
workoutFormContainer.style.display = "none";

// showWorkoutForm();

function showWorkoutForm() {
  popup.style.display = "none";
  workoutFormContainer.style.display = "flex";
  workoutFormContainer.classList.add("show-workout-form");
}

closeFormButton.onclick = function () {
  popup.style.display = "flex";
  workoutFormContainer.classList.remove("show-workout-form");
  workoutFormContainer.style.display = "none";
};

intensityIncrease.onclick = function () {
  if (intensity == "Low") intensity = "Medium";
  else if (intensity == "Medium") intensity = "High";
  intensityLabel.innerHTML = intensity;
};

intensityDecrease.onclick = function () {
  if (intensity == "Medium") intensity = "Low";
  else if (intensity == "High") intensity = "Medium";
  intensityLabel.innerHTML = intensity;
};

let map, mapEvent, editId;

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [] of latitude, longitude
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevGain) {
    super(coords, distance, duration);
    this.elevGain = elevGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  constructor() {
    // as the constructor is called as soon as an object is created we are using it to call all the methods we need initially
    this._workouts = [];
    this.mapZoomLevel = 15;
    this._getPosition();
    // this._getLocalStorage();

    // form.addEventListener("submit", (e) => {
    //   if (editId) this._editWorkout(e);
    //   else this._newWorkout(e);
    //   editId = "";
    // });
    inputType.addEventListener("change", this._toggleElevationField);

    // containerWorkouts.addEventListener("click", (e) => {
    //   this._moveToPopup(e);
    //     this._setEditId(e);
    // });
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), // solving the this keyword issue
        function () {
          alert("Could not get your position"); // when the _loadMap is called by the getCurrentPosition function it gives the this keyword a value of undefined as its called as a regular function and not a function
        }
      );
  }

  _loadMap(position) {
    console.log(position);

    const { latitude, longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude},12z`);

    const coords = [latitude, longitude];

    // Leaflet API
    // this.#map = L.map('map').setView(coords, 13); // also gives an error as the this keyword is undefined
    map = L.map("map").setView(coords, this.mapZoomLevel);
    // console.log(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      // openstreet map is an opensource map, you can use any map provider like google etc, you can change its styles by changing the domain name extension of the url
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }) /*.addTo(this.#map);*/
      .addTo(map);

    // L.marker(coords)
    //   .addTo(map)
    //   .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    //   .openPopup();

    // Handling clicks on map
    map.on("click", (e) => {
      console.log("CLICK: ", e);
      showWorkoutForm();
      //   this._showForm(e);
      //--------------------------------------SHOW FIELDS FOR DATA INPUT------------------------------------
      editId = "";
    });

    this._workouts.forEach((workout) => {
      this._renderWorkoutMarker(workout);
    });
  }

  //   _showForm(mapE) {
  //     // this.#mapEvent = mapE;
  //     mapEvent = mapE;
  //     form.classList.remove("hidden");
  //     inputDistance.focus();
  //   }

  //   _hideForm() {
  //     // Empty inputs
  //     inputDistance.value =
  //       inputCadence.value =
  //       inputDuration.value =
  //       inputElevation.value =
  //         "";

  //     form.style.display = "none";
  //     form.classList.add("hidden");
  //     setTimeout(() => {
  //       form.style.display = "grid";
  //     }, 1000);
  //   }

  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  } // modify this later

  _validInputs = (...inputs) => inputs.every((inp) => Number.isFinite(inp));

  _allPositive = (...inputs) => inputs.every((inp) => inp > 0);

  _newWorkout(e) {
    e.preventDefault();

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = mapEvent.latlng;
    // const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If activity is running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        !this._validInputs(distance, duration, cadence) ||
        !this._allPositive(distance, duration, cadence)
      )
        return alert("Please enter correct values");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If activity is cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;

      // Check if data is valid
      if (
        !this._validInputs(distance, duration, elevation) ||
        !this._allPositive(distance, duration)
      )
        return alert("Please enter correct values");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add the new object to the workout array
    this._workouts.push(workout);

    // Render workout on map as a marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    // this._renderWorkout(workout);

    console.log(mapEvent);

    // Hide form + Clear Input fields
    // this._hideForm();

    // Set local storage for all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    // Display markers
    L.marker(workout.coords)
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }

  //   _renderWorkout(workout) {
  //     let html = `
  //       <li class="workout workout--${workout.type}" data-id="${workout.id}">
  //         <div class="workout__details">
  //           <h2 class="workout__title">${workout.description}</h2>
  //           <a href="#" class="workout__unit btn">
  //             Edit
  //           </a>
  //         </div>
  //         <div class="workout__details">
  //           <span class="workout__icon">${
  //             workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
  //           }</span>
  //           <span class="workout__value">${workout.distance}</span>
  //           <span class="workout__unit">km</span>
  //         </div>
  //         <div class="workout__details">
  //           <span class="workout__icon">⏱</span>
  //           <span class="workout__value">${workout.duration}</span>
  //           <span class="workout__unit">min</span>
  //         </div>`;

  //     if (workout.type === "running")
  //       html += `
  //         <div class="workout__details">
  //           <span class="workout__icon">⚡️</span>
  //           <span class="workout__value">${workout.pace.toFixed(1)}</span>
  //           <span class="workout__unit">min/km</span>
  //         </div>
  //         <div class="workout__details">
  //           <span class="workout__icon">🦶🏼</span>
  //           <span class="workout__value">${workout.cadence}</span>
  //           <span class="workout__unit">spm</span>
  //         </div>
  //       </li>`;

  //     if (workout.type === "cycling")
  //       html += `
  //         <div class="workout__details">
  //           <span class="workout__icon">⚡️</span>
  //           <span class="workout__value">${workout.speed.toFixed(1)}</span>
  //           <span class="workout__unit">km/h</span>
  //         </div>
  //         <div class="workout__details">
  //           <span class="workout__icon">⛰</span>
  //           <span class="workout__value">${workout.elevGain}</span>
  //           <span class="workout__unit">m</span>
  //         </div>
  //       </li>`;
  //     if (!editId) form.insertAdjacentHTML("afterend", html);
  //     else workoutEditEl.insertAdjacentHTML("afterend", html);
  //   }

  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");

    console.log(workoutEl);
    console.log(`moveToPopup executed`);

    if (!workoutEl) return;

    const workout = this._workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );
    // console.log(workout);

    map.setView(workout.coords, this.mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // using public interface
    workout.click();
  }

  //   _setEditId(e) {
  //     const btn = e.target.closest(".btn");

  //     // Setting the ID of the workout to edit
  //     if (btn) {
  //       this._showForm();
  //       editId = e.target.closest(".workout").dataset.id;
  //       console.log(editId);
  //     }
  //   }

  //   _editWorkout(e) {
  //     e.preventDefault();
  //     workoutEditEl = Array.from(document.querySelectorAll(".workout")).find(
  //       (work) => work.dataset.id === editId
  //     );
  //     console.log(workoutEditEl);

  //     const workout = this._workouts.find((work) => work.id === editId);

  //     const type = inputType.value;
  //     const distance = +inputDistance.value;
  //     const duration = +inputDuration.value;

  //     if (type === "running") {
  //       const cadence = +inputCadence.value;

  //       // Check if data is valid
  //       if (
  //         !this._validInputs(distance, duration, cadence) ||
  //         !this._allPositive(distance, duration, cadence)
  //       )
  //         return alert("Please enter correct values");

  //       workout.type = type;
  //       workout.distance = distance;
  //       workout.duration = duration;
  //       workout.cadence = cadence;
  //       workout.pace = workout.calcPace();
  //     }
  //     if (type === "cycling") {
  //       const elevation = +inputElevation.value;

  //       // Check if data is valid
  //       if (
  //         !this._validInputs(distance, duration, elevation) ||
  //         !this._allPositive(distance, duration)
  //       )
  //         return alert("Please enter correct values");

  //       workout.type = type;
  //       workout.distance = distance;
  //       workout.duration = duration;
  //       workout.elevGain = elevation;
  //       workout.speed = workout.calcSpeed();
  //     }

  //     this._hideForm();
  //     this._renderWorkout(workout);
  //     workoutEditEl.parentNode.removeChild(workoutEditEl);
  //     this._setLocalStorage();
  //   }

  //   _setLocalStorage() {
  //     localStorage.setItem("workouts", JSON.stringify(this._workouts)); // local storage is a key value store
  //   }

  //   _getLocalStorage() {
  //     const data = JSON.parse(localStorage.getItem("workouts"));

  //     if (!data) return;

  //     this._workouts = data;
  //     this._workouts.forEach((workout) => {
  //       this._renderWorkout(workout);
  //       if (workout.type === "running") {
  //         Object.setPrototypeOf(workout, Running.prototype);
  //       }
  //       if (workout.type === "cycling") {
  //         Object.setPrototypeOf(workout, Cycling.prototype);
  //       }
  //     });
  //     console.log(this._workouts);
  //   }

  reset() {
    // localStorage.removeItem("workouts");
    location.reload();
  }
}

const app = new App();
