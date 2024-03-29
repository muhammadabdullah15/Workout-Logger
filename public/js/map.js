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

let map, mapEvent;

class Workout {
  date = new Date();
  clicks = 0;
  type = "";

  constructor(type, coords, duration, intensity) {
    this.coords = coords;
    this.type = type;
    this.duration = duration;
    this.intensity = intensity;
    this._setDescription();
  }

  _setDescription() {
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
    this._renderStoredWorkouts();

    addWorkoutButton.addEventListener("click", (e) => {
      e.preventDefault();
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

  async _renderStoredWorkouts() {
    let data;
    try {
      const res = await fetch("/getUserWorkoutsData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      data = await res.json();
    } catch (error) {
      console.log(error);
    }

    data.forEach((obj) => {
      const date = new Date(obj.wo_workout_date);
      const desc = `${obj.w_name[0].toUpperCase()}${obj.w_name.slice(1)} on ${
        months[date.getMonth()]
      } ${date.getDate()}`;

      this._renderWorkoutMarker({
        coords: obj.wo_coordinates.split(","),
        type: obj.w_name,
        description: desc,
      });
    });
  }

  async _loadMap(position) {
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
          workout.type == "Walking"
            ? "🚶"
            : workout.type == "Running"
            ? "🏃‍♂️"
            : "🚴‍♀️"
        } ${workout.description}`
      )
      .openPopup();
  }
}

const app = new App();
