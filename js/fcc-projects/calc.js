$(function() {
  let numSigns = 0;
  let numDots = 0;
  let chgSign = "plus";
  let equalSignPressed = false;
  const numKeys = [40, 41, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
  const signKeys = [45, 43, 42, 47, 37, 120];
   
  // Create the expression to evaluate from the calc's buttons.
  $('button').on('click', function() {
    const className = $(this).attr('class');
	const listText = $(this).text();
	   
    if (equalSignPressed) {
	  equalSignPressed = false;
      $('h4').text('');
	}
	   
	if (className.match(/num/g)) { 
	  $('h4').append(listText).css('font-size', '1.7rem');
	  numSigns = 0;
	} else if (className.match(/sign/g) && numSigns === 0) {
	    $('h3').append($('h4').text()).css('font-size', '1.3rem');
		$('h4').html('&nbsp;');
		checkSign(listText);
		numSigns = 1;
		numDots = 0;
	} else if (className.match(/dot/g) && numDots === 0) {
		$('h4').append(listText);
		numDots = 1;
	} else if (className.match(/clear/g)) {
		$('h3').html('&nbsp;');
		$('h4').html('&nbsp;');
		numDots = 0;
	} else if (className.match(/clr-current/g)){
	    $('h4').html('&nbsp;');
	    numDots = 0;
	} else if (className.match(/return/g)) {
		carriageReturn();
	} else if (className.match(/plus-minus/g)) {
	    if (chgSign === "plus") {
	      let $text = $('h4').text();
	      $text = '-' + $text[1, $text.length-1];
	      $('h4').text($text);
	      chgSign = "minus";
	    } else {
	      const $text = $('h4').text();
	      $('h4').text($text[1, $text.length-1]);
	      chgSign = "plus";
	    }
	}
  });
   
  // Evaluate the expression when the equal sign is pressed
  $('#equal-sign').on('click', function() {
    equalSignPressed = true;
	evaluateExpr();
  });
   
  // Enable keyboard expression manipulations
  $('html').on('keypress', function(e) {
    e.preventDefault();

	if (equalSignPressed) {
      equalSignPressed = false;
      $('h4').text('');
    }
	   
	if ((e.which === 61 || e.which === 13) && !$('h4').text().match(/= /g)) {
	  equalSignPressed = true;			 
	  $('h3').append($('h4').text());
	  $('h4').html(' &nbsp;');
	  evaluateExpr();
	} else if (e.which === 8) {
        carriageReturn();
	} else if (e.which === 96) {
		$('h4').html('&nbsp;');
	} else if (e.which === 0) {
		$('h3').html('&nbsp;');
		$('h4').html('&nbsp;');
	} else if (e.which === 46 && numDots === 0) {
		$('h4').append(String.fromCharCode(e.which));
		numDots = 1;
    } else {
	    for (let key = 0; key < numKeys.length; key++) {
	      if (e.which === numKeys[key]) {
	        $('h4').append(String.fromCharCode(numKeys[key]));
	     	numSigns = 0;
		    break;
	      }
        }

		for (key = 0; key < signKeys.length; key++) {
	      if (e.which === signKeys[key] && numSigns === 0) {
		    $('h3').append($('h4').text());
		    $('h4').html('&nbsp;');
		    checkSign(String.fromCharCode(signKeys[key]));
		    numSigns = 1;
			numDots = 0;
			break;
		  }
		}			 
	 }
  });
   
  function carriageReturn() {
    const expression = $('h3').text();
    numDots = 0;
	$('h4').html('&nbsp;');
	if (expression.length > 2) {
	  $('h3').text(expression.substr(0, expression.length - 2));
    }
  }
   
  function checkSign(type) {
    if (type === "x") {
      $('h3').append(' *');
	} else if (type === '÷') {
	    $('h3').append(' /');
	} else {
	    $('h3').append(' ' + type);
    }
  }
   
  function evaluateExpr() {
    try {
      if ($('h3').html() === "&nbsp;" && $('h4').html() === '&nbsp;'){
        $('h4').text('Please enter an expression');
	  } else {
	    $('h3').append($('h4').text());
	    $('h4').text('= ' + eval($('h3').text()));
	  }
    } catch(err) {  
	    const errMsg = err.message;
	    const expr = $('h3').text();
          			 
	    if (errMsg === "identifier starts immediately after numeric literal" ||
            errMsg === "expected expression, got end of script" && 
                       expr.match(/\*|\+|\-|\//g) !== null ||
		    errMsg === "expected expression, got '*'" ||
		    errMsg === "unterminated regular expression literal") {
	        $('h4').text("Error: Invalid sign position");
	    } else if (errMsg === "missing ; before statement" && expr.match(/\)|\(/g) !== null || 
			       errMsg === "missing ) after argument list" && expr.match(/\)|\(/g) !== null  ||
				   errMsg === "expected expression, got ')'" && expr.match(/\)|\(/g) !== null || 
				   errMsg === "expected expression, got end of script" &&
				               expr.match(/\)|\(/g) !== null) {
		    $('h4').text("Error: Brackets do not match.");
	    } else if (errMsg.match(/is not a function/g)) {
		    $('h4').text('Error: Missing multiplication sign');
	    }
     }
     numDots = 0;
   }
});
