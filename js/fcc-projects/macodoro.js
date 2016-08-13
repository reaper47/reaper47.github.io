$(function () {
  "use strict";
  /*
   * 1. Every button/action has their own respective function stored here.
   *
   */
  let currentControl;
  const btnActions = {
    start: function () {
      startAnimation();
      currentControl = toggleControl("play", currentControl);
    },
    pause: function () {
      stopAnimation();
      currentControl = toggleControl("pause", currentControl);
      
    },
    reset: function () {
      animate = false;
      currentControl = toggleControl("undo", currentControl);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc"); 
      currentPercent = 0;
    },
    stop: function () {
      currentControl = toggleControl("stop", currentControl);
    },
    colors: function (div) {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).css("display", "none");
      $(div.context.parentElement).hide();
      $("#panel-colors1").show();
    },
    session: function (div) {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).hide();
      $("#panel-colors2").show();
    },
    breaky: function (div) {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).hide();
      $("#panel-colors2").show();
    },
    sliders: function (div) {
      hid.push($(div.context.parentElement));
      $(div.context.parentElement).hide();
      $("#panel-slider").show();
    },
    back: function (div) {
      if (div.context.parentElement.className !== "content-panel toggle") {
        $(div).hide();
      } else {
        $(div.context.parentElement).hide();
      }
      hid[hid.length - 1].show();
      hid.pop();
    },
    defaultColor: function () {
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
    defaultTimes: function () {
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

  bodyColor.addEventListener("input", function () {
    $("body").css("background-color", this.value);
    localStorage.setItem("bodyStoreValue", this.value);
  }, false);
  
  hourglassColor.addEventListener("input", function () {
    $("#inner-clock").css("background-color", this.value);
    localStorage.setItem("hourglassStoreValue", this.value);
  }, false);

  innerColor.addEventListener("input", function () {
    $("#inner-clock").css("border-color", this.value);
    localStorage.setItem("innerStoreValue", this.value);
  }, false);
    
  outerColor.addEventListener("input", function () {
    $("#outer-clock").css("border-color", this.value);
    localStorage.setItem("outerStoreValue", this.value);
  }, false);
    
  /* 
   * 3. Integrate keyboard functionality for controls
   *    
   */
   let playStatus = false;
   const btnMap = { 
     "32": function() {
       if (!playStatus) {
         btnActions["start"]($("timer-start"));
         playStatus = true;
         return;
       } 
       
       btnActions["pause"]($("timer-stop"));
       playStatus = false;

     }, 
     "112": function() {
       btnActions["pause"]($("timer-pause"));
       playStatus = false;
     },
     "114": function() {
       btnActions["reset"]($("timer-reset"));
       playStatus = false;
     },
     "115": function() {
       return;
     }
   };
   
   $("html").on("keypress", function(event) {
     event.preventDefault();
     const key = parseInt(event.which);
     if (btnMap.hasOwnProperty(key)) {
       btnMap[key]();
     }
   });
   
   $("#outer-clock").on("click", function(event) {
     event.preventDefault();
     
     if (!playStatus) {
       btnActions["start"]($("timer-start"));
       playStatus = true;
       return;
     }
     
     btnActions["pause"]($("timer-stop"));
     playStatus = false;

   });
     
  /*
   * 4. Manage the flow between main menu items.
   *
   */
  let hid = [];
  $(".back").on("click", function (e) {
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
  const canvas = document.getElementById("outer-clock"), 
        ctx = canvas.getContext("2d");
        
  let requestOuter, requestInner, requestHour,
      animate = true,
      sessionTime = null,
      breakTime = null,
      circle = Math.PI * 2,
      quarter = Math.PI / 2,
      currentPercent = 0,
      endPercentage = 100;
   
  drawArc(320, 0, Math.PI * 2, false, null, 10, "black", "arc");
   
  function arcAnimationLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
        
    drawArc(350, -quarter, (circle * currentPercent/100) - quarter, false, null, 30, "black", "arc");
    drawArc(330, quarter, (circle * currentPercent/100) + quarter, false, null, 10, "red", "arc");
    drawArc(320, 0, currentPercent, false, "blue", 10, null, "circle");
    currentPercent++;
    
    if (animate && (currentPercent <= endPercentage)) {
        requestOuter = requestAnimationFrame(arcAnimationLoop);
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
      
      ctx.fillRect(centerX - circleRad, centerY + circleRad, circleRad * 2, -currentPercent*6.35);
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
    animate = true;
    requestOuter = requestAnimationFrame(arcAnimationLoop);
  }
  
  function stopAnimation() {
    if (requestOuter) {
      animate = false;
      cancelAnimationFrame(requestOuter);
    }
  }  
});
