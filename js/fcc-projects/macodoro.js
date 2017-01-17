$(() => {
  /*
   * 1. Every button/action has their own respective function stored here.
   *
   */
  let currentControl;
  
  const btnActions = {
    start: () => {
      if (soundOn) soundObj.start.play();
	  if (fade) $("#slider-div").fadeOut("slow");
	  
      clearInterval(counter);
      startAnimation();
      currentControl = toggleControl("play", currentControl);
      
      counter = setInterval(() => {
        if (soundOn && ticksOn) soundObj.second.play();
        timer();
      }, 1000);
	  
    },
    pause: () => {
      if (soundOn) soundObj.pause.play();
	  if (fade) $("#slider-div").fadeIn("slow");
	  
      clearInterval(counter);
      stopAnimation();
      currentControl = toggleControl("pause", currentControl);
	  
    },
    reset: () => {
      if (soundOn) soundObj.reset.play();
      clearInterval(counter);

      currentControl = toggleControl("undo", currentControl);
      writeTime(sessionTime, 0);
      countSec = 60;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawArc(350, 0, Math.PI * 2, false, null, 30, "black", "arc");
      drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc");

      Clock.totalSeconds = 0;
      Clock.totalMinutes = 0;

      btnActions["start"]($("timer-start"));

    },
    stop: () => {
      if (soundOn) soundObj.stop.play();
	  if (fade) $("#slider-div").fadeIn("slow");
	  
      clearInterval(counter);
      stopAnimation();
      $("#time-type")[0].textContent = "Session"
      currentControl = toggleControl("stop", currentControl);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawArc(350, 0, Math.PI * 2, false, null, 30, "black", "arc");
      drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc");
	  innerClr = "#ff5252";

      if (sessionOn) getRangeValue(inputSession);
      else getRangeValue(inputBreak);

      Clock.totalSeconds = 0;
      Clock.totalMinutes = 0;

    },
    colors: (div) => {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).css("display", "none");
      $(div.context.parentElement).hide();
      $("#panel-colors1").show();
    },
    session: (div) => {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).hide();
      $("#panel-colors2").show();
    },
    breaky: (div) => {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).hide();
      $("#panel-colors2").show();
    },
    sliders: (div) => {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).hide();
      $("#panel-slider").show();
    },
    back: (div) => {
      if (div.context.parentElement.className !== "content-panel toggle") {
        $(div).hide();
      } else {
        $(div.context.parentElement).hide();
      }
      hid[hid.length - 1].show();
      hid.pop();
    },
    defaultColor: () => {
      const bodyColor = "#fff",
        outerBorder = "red",
        innerBorder = "green",
        innerFill = "white";

      $("body").css("background-color", bodyColor);
      $("#outer-clock").css("border-color", outerBorder);
      $("#inner-clock").css("border-color", innerBorder);
      $("#inner-clock").css("background-color", innerFill);

      localStorage.setItem("bodyStoreValue", bodyColor);
      localStorage.setItem("hourglassStoreValue", innerFill);
      localStorage.setItem("innerStoreValue", innerBorder);
      localStorage.setItem("outerStoreValue", outerBorder);
    },
    defaultTimes: () => {
      document.getElementById('session-slider').value = 25;
      document.getElementById('break-slider').value = 5;
      document.getElementById("slider-label-left").children[0].innerHTML = 25;
      document.getElementById("slider-label-right").children[0].innerHTML = 5;

      if (sessionOn) writeTime(25, 0);
      else writeTime(5, 0);

      btnActions["stop"]($("timer-pause"));

    }
  }

  function toggleControl(control, current) {
    const iconActivate = ".fa-" + control;

    if (current !== iconActivate) $(current).removeClass("activeControl");

    $(iconActivate).addClass("activeControl");
    return iconActivate;
  }

  /*
   * 2. Create an object literal that will hold every sound
   *
   */
  const audioURL = "../../audio/timer/",
    sounds = ["start", "pause", "reset", "stop",
      "minute", "second", "toggle", "oh"
    ],
    breakMusic = new Audio(audioURL + "break.mp3");

  let soundObj = {},
    soundOn = true,
    ticksOn = true;

  sounds.forEach((item, i, arr) =>
    soundObj[item] = new Audio(audioURL + sounds[i] + ".wav")
  );

  /* 
   * 3. Integrate keyboard functionality for controls
   *    
   */
  let playStatus = false,
    fade = true;

  const canvas = document.getElementById("outer-clock"),
    timeBoxEl = document.getElementById("time-box"),
    radio1 = document.getElementById("radio1"),
    radio2 = document.getElementById("radio2"),
    sound1 = document.getElementById("sound1"),
    sound2 = document.getElementById("sound2"),
    sound3 = document.getElementById("sound3"),
    sound4 = document.getElementById("sound4"),
    ctx = canvas.getContext("2d");

  const btnMap = {
    "32": () => {
      if (!playStatus) {
        btnActions["start"]($("timer-start"));
        playStatus = true;
        return;
      }

      btnActions["pause"]($("timer-stop"));
      playStatus = false;

    },
    "97": () => {
      if (soundOn) soundObj.toggle.play();

      if (sound1.checked) {
        sound1.checked = false;
        sound2.checked = true;
        sound3.checked = false;
        sound4.checked = true;
        soundOn = false;
      } else {
        sound2.checked = false;
        sound1.checked = true;
        sound3.checked = true;
        sound4.checked = false;
        soundOn = true;
      }
    },
    "100": () => {
      if (soundOn) soundObj.toggle.play();

      if (sound3.checked) {
        sound3.checked = false;
        sound4.checked = true;
        ticksOn = false;
      } else {
        sound4.checked = false;
        sound3.checked = true;
        ticksOn = true;
      }
    },
    "112": () => {
      btnActions["stop"]($("timer-pause"));
      playStatus = false;
    },
    "114": () => {
      btnActions["reset"]($("timer-reset"));
    },
    "115": () => {
      if (soundOn) soundObj.toggle.play();

      if (radio1.checked) {
        radio1.checked = false;
        radio2.checked = true;
        fade = false;
      } else {
        radio2.checked = false;
        radio1.checked = true;
        fade = true;
      }
    }
  };

  $("html").on("keypress", (event) => {
    event.preventDefault();
    const key = parseInt(event.which);
    if (btnMap.hasOwnProperty(key)) btnMap[key]();
  });

  timeBoxEl.addEventListener('click', (event) => {
    event.preventDefault();
    stopStartAnim();
  });

  canvas.addEventListener('click', (event) => {
    event.preventDefault();
    stopStartAnim();
  });

  radio1.addEventListener("click", () => {
    if (soundOn) soundObj.toggle.play();
    radio1.checked = true;
    radio2.checked = false;
    fade = true;
  });

  radio2.addEventListener("click", () => {
    if (soundOn) soundObj.toggle.play();
    radio1.checked = false;
    radio2.checked = true;
    fade = false;
  });

  sound1.addEventListener("click", () => {
    if (soundOn) soundObj.toggle.play();
    sound1.checked = true;
    sound2.checked = false;
    sound3.checked = true;
    sound4.checked = false;
    soundOn = true;
    ticksOn = true;
  });

  sound2.addEventListener("click", () => {
    if (soundOn) soundObj.toggle.play();
    sound1.checked = false;
    sound2.checked = true;
    sound3.checked = false;
    sound4.checked = true;
    soundOn = false;
    ticksOn = false;
  });

  sound3.addEventListener("click", () => {
    if (soundOn) soundObj.toggle.play();
    sound3.checked = true;
    sound4.checked = false;
    ticksOn = true;
  });

  sound4.addEventListener("click", () => {
    if (soundOn) soundObj.toggle.play();
    sound3.checked = false;
    sound4.checked = true;
    ticksOn = false;
  });

  function stopStartAnim() {
    if (!playStatus) {
      btnActions["start"]($("timer-start"));
      playStatus = true;
      return;
    }

    btnActions["pause"]($("timer-stop"));
    playStatus = false;
  }

  /*
   * 4. Manage the flow between main menu items.
   *
   */
  let hid = [];
  $(".back").on("click", (e) => {
    let clicked = $(e.target).attr("data-control");
    if (!clicked) {
      clicked = $(e.target.parentElement).attr("data-control");
    }

    try {
      btnActions[clicked]($(e.target.parentElement));
    } catch (error) {
      return;
    }

  });

  /*
   * 5. Run the clock's hourglass and arc animations.
   *
   */
  let sessionOn = true,
    breakOn = false,
    circle = Math.PI * 2,
    quarter = Math.PI / 2,
    secEndAngle = 0,
    minEndAngle = 0,
    clockStarted = false,
    drawOuterArc = true,
    innerClr = "#ff5252";

  drawArc(350, 0, Math.PI * 2, false, null, 30, "black", "arc");
  drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc");

  let Clock = {
    totalSeconds: 0,
    totalMinutes: 0,

    start: function() {
      let self = this;

      this.interval = setInterval(function() {
        self.totalSeconds += 0.03;
        self.totalMinutes += 0.03 / 60;

        if (self.totalSeconds > 60) self.totalSeconds = 0;

        if (countMin > -1 && countSec > -1) arcAnimationLoop(self.totalSeconds);

      }, 30);
    },

    pause: function() {
      clearInterval(this.interval);
      delete this.interval;
    },

    resume: function() {
      if (!this.interval) this.start();
    }
  };

  function arcAnimationLoop(timestamp) {

    secEndAngle = timestamp / 60 * circle;
    minEndAngle = (Clock.totalMinutes) / sessionTime * circle;

    if (drawOuterArc) {
      drawArc(350, -(minEndAngle + quarter), minEndAngle - quarter, true, null, 30, "#212121", "arc");
      drawOuterArc = false;
    }

    if (secEndAngle >= 6.28) {

      if (innerClr === "#ff5252") {
        innerClr = "#FFF";
      } else {
        innerClr = "#ff5252";
      }

    } else {
      drawArc(350, -quarter, minEndAngle - quarter, false, null, 30, "#448aff", "arc");
      drawArc(330, -quarter, -(secEndAngle + quarter), true, null, 10, innerClr, "arc");
    }
  }

  function drawArc(circleRad, sAng, eAng, cc, fill, lwidth, stroke, type) {
    const centerX = canvas.width / 2,
      centerY = canvas.width / 2,
      radius = circleRad,
      sAngle = sAng || 0,
      eAngle = eAng || 2 * Math.PI,
      counterClock = cc;

    ctx.save();
    ctx.beginPath();

    ctx.arc(centerX, centerY, radius, sAng, eAng, cc);

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.lineWidth = lwidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }

    ctx.restore();
  }

  function startAnimation() {
    Clock.resume();
    playStatus = false;
  }

  function stopAnimation() {
    Clock.pause();
    playStatus = true;
  }

  /*
   * 6. Data binding of the input sliders
   *
   */
  let sessionTime = 25,
    breakTime = 5,
    countMin = 24,
    countSec = 60,
    counter;

  const inputSession = $("#session-slider"),
    inputBreak = $("#break-slider");

  inputSession.bind('input', () => getRangeValue(inputSession));
  inputBreak.bind('input', () => getRangeValue(inputBreak));

  function getRangeValue(e) {
    const value = $(e).val();

    if (e.selector === "#session-slider") {
      $('.slider-left .value').text(value);
      $('.slider-left .range').attr('data-value', value);
      inputSession.attr('value', value);

      if (value > 9 && $("#time-type")[0].textContent === "Session") {
        $("time").text(value + ":00");
        sessionTime = parseInt(value);
        countMin = sessionTime - 1;
      } else if (value < 10 && $("#time-type")[0].textContent === "Session") {
        $("time").text("0" + value + ":00");
        sessionTime = parseInt(value);
        countMin = sessionTime - 1;
      }
      countSec = 60;
    } else if (e.selector === "#break-slider") {

      $('.slider-right .value').text(value);
      $('.slider-right .range').attr('data-value', value);
      inputBreak.attr('value', value);

      if (value > 9 && $("#time-type")[0].textContent === "Break") {
        $("time").text(value + ":00");
        breakTime = parseInt(value);
        countMin = breakTime - 1;
      } else if (value < 10 && $("#time-type")[0].textContent === "Break") {
        $("time").text("0" + value + ":00");
        breakTime = parseInt(value);
        countMin = breakTime - 1;
      }

    }
  }

  /*
   * 7. Implementing the timer
   *
   */
  function timer() {
    countSec--;

    if (countMin < 1 && $("#time-type")[0].textContent === "Session" && countSec < 1) {
      $("#time-type")[0].textContent = "Break";
      soundObj.oh.play();
      breakMusic.play();
      breakMusic.loop = true;
      breakOn = true;
      sessionOn = false;
      getRangeValue(inputBreak);
      countSec = 59;
    } else if (countMin < 1 && $("#time-type")[0].textContent === "Break" && countSec < 0) {
      clearInterval(counter);
      stopSound(breakMusic);
      breakOn = false;
      sessionOn = true;
      btnActions["stop"]($("timer-start"));
      return;
    }

    if (countSec === 0 && soundOn && ticksOn) soundObj.minute.play();
   
    if (countSec < 0) {
      countSec = 59;
      countMin--;
    }

    writeTime(countMin, countSec);
  }

  function writeTime(min, sec) {
    if (min < 10 && sec > 9) $("time").html("0" + min + ":" + sec);
    else if (min < 10 && sec < 10) $("time").html("0" + min + ":" + "0" + sec);
    else if (min > 9 && sec > 9) $("time").html(min + ":" + sec);
    else if (min > 9 && sec < 10) $("time").html(min + ":" + "0" + sec);
  }

  function stopSound(sound) {
    sound.pause();
    sound.loop = false;
    sound.currentTime = 0;
  }

});
