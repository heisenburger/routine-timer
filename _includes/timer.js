const FULL_DASH_ARRAY = 283;

let TIME_LIMIT = 5;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let overtime = false;
let stopDetected = false;

document.getElementById("timer-label").textContent = formatTime(timeLeft);
startTimer(overtime);

function onTimesUp() {
  clearInterval(timerInterval);
  overtime = true;
  timePassed = 0;
  startTimer(overtime);
  document
    .getElementById("timer-circle-remaining")
    .classList.add("timesup");
}

function startTimer(overtime) {
  if (stopDetected == false) {
    timerInterval = setInterval(() => {

      if (stopDetected == true) {
        
        clearInterval(timerInterval);
      }

      timePassed = timePassed += 1;

      if (overtime == false) {
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("timer-label").textContent = formatTime(timeLeft);
        setCircleDasharray();

        if (timeLeft === 0) {
          document.querySelector('.overtime_label').classList.add("visible");
          onTimesUp();
        }

      } else if (overtime == true) {
        document.getElementById("overtime-label").textContent = "+ " + formatTime(timePassed);
      }

    }, 1000);
  }
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("timer-circle-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

// Advance to next task

// const nextTaskButton = document.getElementById("next-task-button");

// nextTaskButton.addEventListener("click", (event) => {
//   resetTimers(3);
// });

// function resetTimers(newTimeLimit) {
//   TIME_LIMIT = newTimeLimit;
//   overtime = false;
//   timePassed = 0;
//   stopDetected = true;
//   timerInterval = null;
//   startTimer(overtime);
//   stopDetected = false;
// }