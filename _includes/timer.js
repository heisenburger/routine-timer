// Import routine data
// -------------------

var routineData = {};
let currentTaskIndex = 0;
fetch("./routines.json")
  .then(response => response.json())
  .then(json => {
    routineData = structuredClone(json.morning);
  });


// Initialize global variables
// ---------------------------

const FULL_DASH_ARRAY = 283;
const showNextTaskWhen = 60;

// Task variables
let prevTask = "";
let task = "";
let nextTask = "";
let taskDuration = 0;
let taskPriority = 0;
let randomiser = [];

// Timer variables
let timeLimit = 60 * taskDuration;
let timePassed = 0;
let timeLeft = timeLimit;
let overtime = false;
let timeOver = 0;

function resetTimer() {
  timePassed = 0;
  timeLeft = timeLimit;
  overtime = false;
  timeOver = 0;
  hideOvertimeTime();
}

// Define Timer object
// -------------------

function Timer(fn, t) {
  var timerObj = setInterval(fn, t);

  this.stop = function() {
    if (timerObj) {
      clearInterval(timerObj);
      timerObj = null;
    }
    return this;
  }

  // start timer using current settings (if it's not already running)
  this.start = function() {
    if (!timerObj) {
      this.stop();
      timerObj = setInterval(fn, t);
    }
    return this;
  }

  this.startStop = function() {
    if (timerObj) {
      clearInterval(timerObj);
      timerObj = null;
    } else if (!timerObj) {
      this.stop();
      timerObj = setInterval(fn, t);
    }
    return this;
  }

  // start with new or original interval, stop current interval
  this.reset = function() {
    resetTimer();
    return this.stop().start();
  }
}

// Task manipulation
// -----------------

function setCurrentTask() {
  // console.log(routineData[currentTaskIndex]);
  if (currentTaskIndex >= 0) {

    // set the task name
    task = routineData[currentTaskIndex].task ?? "No task found";
    taskDuration = routineData[currentTaskIndex].duration ?? 0; // in minutes
    taskPriority = routineData[currentTaskIndex].priority ?? 0; // [0, 1, 2]
    randomiser = routineData[currentTaskIndex].randomiser ?? [];

    // prev and next tasks
    if (routineData[currentTaskIndex-1]) {
      prevTask = routineData[currentTaskIndex-1].task ?? "";
    }
    if (routineData[currentTaskIndex+1]) {
      nextTask = routineData[currentTaskIndex+1].task ?? "";
    }

    // set the timeLimit for timer
    timeLimit = 60 * taskDuration;

    countdown.reset();
  }

  setTaskInfo();
}


// Time formatting
// ---------------

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}


// DOM manipulations
// -----------------

function setTaskInfo() {
  hideNextTask();
  document.getElementById("task-title").textContent = task;
  document.getElementById("random").textContent = randomiser[Math.floor(Math.random() * randomiser.length)];
  document.getElementById("next-task-label").textContent = "Next: " + nextTask;
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("timer-circle-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function updateCountdownTime() {
    document.getElementById("timer-label")
      .textContent = formatTime(timeLeft);
    // update countdown circle
    setCircleDasharray();
}

function updateOvertimeTime() {
  timeOver++;
  document.getElementById("overtime-label")
    .textContent = "+ " + formatTime(timeOver);
}

function showNextTask() {
  document.getElementById("next-task-label")
    .classList.add("visible");
}

function showOvertimeTime() {
  document
    .querySelector('.overtime_label')
      .classList.add("visible");
  document
    .getElementById("timer-circle-remaining")
      .classList.add("timesup");
}

function hideNextTask() {
  document.getElementById("next-task-label")
    .classList.remove("visible");
}

function hideOvertimeTime() {
  document
    .querySelector('.overtime_label')
      .classList.remove("visible");
  document
    .getElementById("timer-circle-remaining")
      .classList.remove("timesup");
}

// Create onclick listeners
// ------------------------

const buttonPrevTask = document.getElementById("prev-task");
buttonPrevTask.addEventListener("click", (event) => {
  currentTaskIndex--;
  setCurrentTask();
});

const buttonExitRoutine = document.getElementById("exit-routine");
buttonExitRoutine.addEventListener("click", (event) => {
  console.log(buttonExitRoutine.id + " button clicked");
});

const buttonRandomiser = document.getElementById("random");
buttonRandomiser.addEventListener("click", (event) => {
  console.log(buttonRandomiser.id + " button clicked");
});

const buttonTimer = document.getElementById("timer");
buttonTimer.addEventListener("click", (event) => {
  countdown.startStop();
});

const buttonNextTask = document.getElementById("next-task");
buttonNextTask.addEventListener("click", (event) => {
  currentTaskIndex++;
  setCurrentTask();
});

// Create countdown timer
// ----------------------

var countdown = new Timer(function() {

  // only change countdown timer if not in overtime
  if (overtime == false) {
    updateCountdownTime();

    // show next task if it's soon enough
    if (
      timeLeft <= showNextTaskWhen 
      && 
      !document.getElementById("next-task-label").classList.contains("visible")
    ) { // should only run once
      showNextTask();
      console.log("show next task");
    }

    if (timeLeft <= 0) { // should only run once
      overtime = true;
      showOvertimeTime();
      updateOvertimeTime();
    }
  // otherwise don't update the countdown and update the overtime timer
  } else {
    updateOvertimeTime();
  }
  
  timePassed++;
  timeLeft = timeLimit - timePassed;

  // console.log("up: " + timePassed + ", down: " + timeLeft + ", overtime: " + timeOver);

}, 1000);
