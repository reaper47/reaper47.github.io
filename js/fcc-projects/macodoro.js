$( () => {
  /*
   * 1. Every button/action has their own respective function stored here.
   *
   */
  let currentControl;
  const btnActions = {
    start: () => {
	  clearInterval(counter);
      startAnimation();
      currentControl = toggleControl("play", currentControl);
	  $("#slider-div").fadeOut("slow");
	  counter = setInterval( () => { timer(); }, 1000);
    },
    pause: () => {
	  clearInterval(counter);
      stopAnimation();
      currentControl = toggleControl("pause", currentControl);
	  $("#slider-div").fadeIn("slow");
	  
    },
    reset: () => {
	  clearInterval(counter);
	  startAnimation();
      currentControl = toggleControl("undo", currentControl);
	  counter = setInterval( () => { timer(); }, 1000);
	  writeTime(sessionTime, 0);
	  countSec = 60;
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc"); 
    },
    stop: () => {
	  clearInterval(counter);
	  stopAnimation();
      currentControl = toggleControl("stop", currentControl);
	  $("#slider-div").fadeIn("slow");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc"); 
    },
    colors: (div) => {
      hid.push( $(div.context.parentElement) );
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
      return;
    }
  }
     
  function toggleControl(control, current) {
    const iconActivate = ".fa-" + control;
    
    if (current !== iconActivate) {
      $(current).removeClass("activeControl");
    }
    
    $(iconActivate).addClass("activeControl");
    return iconActivate;
  }  
 
  /*
   * 2. Listen for any changes in the color of the inner and outer circle
   *    of the pomorodoro timer and store the values in the local storage
   *    as to keep current settings next time the user loads the page.
   */
  const bodyColor = document.querySelector("#body-color"),
    hourglassColor = document.querySelector("#hourglass-color"),
    innerColor = document.querySelector("#inner-color"),
    outerColor = document.querySelector("#outer-color");
      
  if (typeof(Storage) !== undefined) {
    const bodyColor = localStorage.getItem("bodyStoreValue"),
      hourglassColor = localStorage.getItem("hourglassStoreValue"),
      innerColor = localStorage.getItem("innerStoreValue"),
      outerColor = localStorage.getItem("outerStoreValue");
        
    $("body").css("background-color", bodyColor);
    $("#outer-clock").css("border-color", outerColor);
    $("#inner-clock").css("border-color", innerColor);
    $("#inner-clock").css("background-color", hourglassColor);
  }

  bodyColor.addEventListener("input", () => {
    $("body").css("background-color", this.value);
    localStorage.setItem("bodyStoreValue", this.value);
  }, false);
  
  hourglassColor.addEventListener("input", () => {
    $("#inner-clock").css("background-color", this.value);
    localStorage.setItem("hourglassStoreValue", this.value);
  }, false);

  innerColor.addEventListener("input", () => {
    $("#inner-clock").css("border-color", this.value);
    localStorage.setItem("innerStoreValue", this.value);
  }, false);
    
  outerColor.addEventListener("input", () => {
    $("#outer-clock").css("border-color", this.value);
    localStorage.setItem("outerStoreValue", this.value);
  }, false);
    
  /* 
   * 3. Integrate keyboard functionality for controls
   *    
   */
   let playStatus = false;
   const canvas = document.getElementById("outer-clock"),
         timeBoxEl = document.getElementById("time-box"),
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
     "112": () => {
       btnActions["stop"]($("timer-pause"));
       playStatus = false;
     },
     "114": () => {
       btnActions["reset"]($("timer-reset"));
       playStatus = false;
     },
     "115": () => {
       return;
     }
   };
   
   $("html").on("keypress", (event) => {
     event.preventDefault();
     const key = parseInt(event.which);
     if ( btnMap.hasOwnProperty(key) ) {
       btnMap[key]();
     }
   });

   timeBoxEl.addEventListener('click', (event) => {
	  event.preventDefault();
      stopStartAnim();
   });
   
   canvas.addEventListener('click', (event) => {
	  event.preventDefault();
      stopStartAnim();
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
  
  drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc");
   
   let Clock = {
	   totalSeconds: 0,
	   totalMinutes: 0,
	   
	   start: function() {
		   let self = this;
		   
		   this.interval = setInterval(function() {
			   self.totalSeconds += 0.03;
			   self.totalMinutes += 0.03/60;
			   
			   if (self.totalSeconds > 60) self.totalSeconds = 1;
			   
			   arcAnimationLoop(self.totalSeconds);
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
       	
	secEndAngle = timestamp/60 * circle;
	minEndAngle = (Clock.totalMinutes)/sessionTime * circle;
	
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
	    drawArc(320, 0, secEndAngle, false, "#b2ebf2", 10, null, "circle");
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
    
    if (type === "circle") {
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, cc);
      ctx.clip();
      ctx.fillStyle = fill;
      
      if (sessionTime) {
        ctx.fillRect(centerX - circleRad, centerY + circleRad, circleRad * 2, -eAng*6.35);
      } else {
        ctx.fillRect(centerX - circleRad, centerY + circleRad, circleRad , -eAng);
      }
      
      ctx.restore();
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRad, 0, Math.PI * 2, false);
      ctx.lineWidth = lwidth;
      ctx.strokeStyle = stroke;
      ctx.stroke();

    } else {
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
    }

    ctx.restore();
  }
  
  function startAnimation() {
	Clock.resume();
	playStatus = false;
  }
  
  function stopAnimation() {
	  playStatus = true;
	  Clock.pause();
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
		 
   inputSession.bind('input', () => getRangeValue(inputSession) );
   inputBreak.bind('input', () => getRangeValue(inputBreak) );
     
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
		} else if (value < 10 && $("#time-type")[0].textContent === "Session"){
		  $("time").text("0" + value + ":00");
		  sessionTime = parseInt(value);
		  countMin = sessionTime - 1;
		}
		countSec = 60;
		return;
	  }
	  
	  $('.slider-right .value').text(value);
	  $('.slider-right .range').attr('data-value', value);
	  inputBreak.attr('value', value);

      if (value > 9 && $("#time-type")[0].textContent === "Break") {
	    $("time").text(value + ":00");
	    breakTime = parseInt(value);
		countMin = breakTime - 1;
	  } else if (value < 10 && $("#time-type")[0].textContent === "Break"){
	    $("time").text("0" + value + ":00");
	    breakTime = parseInt(value);
		countMin = breakTime - 1;
	  }
	  countSec = 60;
    }

  /*
   * Implementing the timer
   *
   */  
	function timer() {
		
		countSec--;

		if (countMin < 1 && $("#time-type")[0].textContent === "Session" && countSec < 0) {
			clearInterval(counter);
			return;
		} else if (countMin < 1 && countSec < 0) {
			clearInterval(counter);
			return;
		}

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
	
});