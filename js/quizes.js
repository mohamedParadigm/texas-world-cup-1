$(function () {
  "use strict";

  // Timer
  const FULL_DASH_ARRAY = 283;
  const WARNING_THRESHOLD = 10;
  const ALERT_THRESHOLD = 5;

  const COLOR_CODES = {
    info: {
      color: "green",
    },
    warning: {
      color: "orange",
      threshold: WARNING_THRESHOLD,
    },
    alert: {
      color: "red",
      threshold: ALERT_THRESHOLD,
    },
  };

  const TIME_LIMIT = $("#countDownTime").val() || 300;
  let timePassed = 0;
  let timeLeft = TIME_LIMIT;
  let timerInterval = null;
  let remainingPathColor = COLOR_CODES.info.color;

  document.getElementById("countdown").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

  startTimer();

  function onTimesUp() {
    clearInterval(timerInterval);

    const timeOutModal = $("#timeOutModal");
    timeOutModal.length !== 0 &&
      timeOutModal.modal({ show: true, backdrop: "static" });
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.getElementById("base-timer-label").innerHTML =
        formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor(timeLeft);

      if (timeLeft === 0) {
        onTimesUp();
      }
    }, 1000);
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
      seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
  }

  function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
    } else if (timeLeft <= warning.threshold) {
      document
        .getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document
        .getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
    }
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
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
  }

  // Trigger Wizard
  const quizesSteps = $("#quizesSteps");
  if (quizesSteps.length !== 0) {
    quizesSteps.steps({
      headerTag: "h2",
      cssClass: "quizes-wizard",
      bodyTag: "section",
      // transitionEffect: "slideLeft",
      enablePagination: false,
      onInit: function (event, currentIndex) {
        $("#currentProgress").css("width", `0%`);
        $("#currentProgressLabel").text(`0 / ${quizesSteps.steps("getTotalSteps")}`);
      },
      onStepChanged: function (event, currentIndex, priorIndex) {
        !$("#nextStep").is(":disabled") &&
          $("#nextStep").attr("disabled", true);

        $("#finishGame").addClass("disabled");

        const progress = currentIndex / quizesSteps.steps("getTotalSteps");

        $("#currentProgress").css("width", `${progress * 100}%`);

        $("#currentProgressLabel").text(
          `${currentIndex} / ${quizesSteps.steps("getTotalSteps")}`
        );

        if (currentIndex + 1 === quizesSteps.steps("getTotalSteps")) {
          $("#nextStep").length !== 0 && $("#nextStep").hide();
          $("#finishGame").length !== 0 && $("#finishGame").addClass("show");
        }
      },
    });
  }

  // Select Answer
  if ($(".answer").length !== 0) {
    $(".answer").on("click", function (e) {
      e.preventDefault();

      $(this)
        .parents(".possible-answers")
        .find(".answer")
        .removeClass("active");
      $(this).addClass("active");

      $("#nextStep").is(":disabled") && $("#nextStep").attr("disabled", false);
      $("#finishGame").length !== 0 && $("#finishGame").removeClass("disabled");
    });
  }

  $("#nextStep").on("click", function (e) {
    e.preventDefault();

    quizesSteps.steps("next");
  });

  if ($("#finishGame").length !== 0) {
    $("#finishGame").on("click", function(e) {
      e.preventDefault();

      clearInterval(timerInterval);

      sessionStorage.setItem("used_time", JSON.stringify(timePassed));

      location.href = $(this).attr("href");
    })
  }

});
