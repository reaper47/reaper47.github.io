$(function() {
  const btnActions = {
    start: function() { 
      console.log("start"); 
    },
    pause: function() { 
      console.log("pause");
    },
    reset: function() { 
      console.log("reset"); 
    },
    stop: function() { 
      console.log("stop");
    },
    colors: function() {
      console.log("colors");
    },
    font: function() {
      console.log("font");
    }
  }
    
  $('.back').on('click', function(e) 
  {
    let clicked = $(e.target).attr('data-control');
    if (!clicked) {
      clicked = $(e.target.parentElement).attr('data-control');
    }
      
    try { 
      btnActions[clicked](); 
    } 
    catch(e) { 
      return; 
    }
  });
});
