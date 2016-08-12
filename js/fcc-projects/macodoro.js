$(function () {
  "use strict";
  /*
   * 1. Every button/action has their own respective function stored here.
   *
   */
   
  let currentControl;
  const btnActions = {
    start: function () {
      currentControl = toggleControl("play", currentControl);
    },
    pause: function () {
      currentControl = toggleControl("pause", currentControl);
      
    },
    reset: function () {
      currentControl = toggleControl("undo", currentControl);
    },
    stop: function () {
      currentControl = toggleControl("stop", currentControl);
    },
    colors: function (div) {
      hid.push($(div.context.parentElement));
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
    font: function () {
      console.log("font");
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
   * 3. Apply a font selected by the user from the text input box
   *    visible from the font button of the options' menu.
   *
   */
     
    
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
  
  function toggleControl(control, current) {
    const iconActivate = ".fa-" + control;
    
    if (current !== iconActivate) {
      $(current).removeClass("activeControl");
    }
    
    $(iconActivate).addClass("activeControl");
    return iconActivate;
  }
});
