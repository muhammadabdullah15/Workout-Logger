"use strict";

// const form = document.querySelector(".form");
// const containerWorkouts = document.querySelector(".workouts");
// const inputType = document.querySelector(".form__input--type");
// const inputDistance = document.querySelector(".form__input--distance");
// const inputDuration = document.querySelector(".form__input--duration");
// const inputCadence = document.querySelector(".form__input--cadence");
// const inputElevation = document.querySelector(".form__input--elevation");
// let workoutEditEl;

let map, mapEvent, editId;

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  clicks = 0;
  type = "";

  constructor(type, coords, duration, intensity) {
    this.coords = coords; // [] of latitude, longitude
    // this.distance = distance;
    this.type = type;
    this.duration = duration;
    this.intensity = intensity;
    this._setDescription();
  }

  _setDescription() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class App {
  constructor() {
    this._workouts = [];
    this.mapZoomLevel = 15;
    this._getPosition();
    // render all stored workouts

    addWorkoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("New");
      this._newWorkout(e);
    });
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  _loadMap(position) {
    console.log(position);

    const { latitude, longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude},12z`);

    const coords = [latitude, longitude];

    // Leaflet API
    map = L.map("map").setView(coords, this.mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", (e) => {
      console.log("CLICK: ", e);
      showWorkoutForm();
      mapEvent = e;
    });

    this._workouts.forEach((workout) => {
      this._renderWorkoutMarker(workout);
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    const type = workoutType;
    const intensity = workoutIntensity;
    const duration = workoutDuration;
    const { lat, lng } = mapEvent.latlng;

    const workout = new Workout(type, [lat, lng], duration, intensity);

    saveNewWorkout(workout);
    hideWorkoutForm();

    this._renderWorkoutMarker(workout);
  }

  _renderWorkoutMarker(workout) {
    console.log("marker: " + workout);

    L.marker(workout.coords)
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent(
        `${
          workout.type == "walking"
            ? "🚶"
            : workout.type == "running"
            ? "🏃‍♂️"
            : "🚴‍♀️"
        } ${workout.description}`
      )
      .openPopup();
  }
}

const app = new App();
