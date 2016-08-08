(function() {
  const options = {
          options:  "#options-click",
          colors: "#options-click-colors",
          close: function() { 
            $('.active').hide("fast");
          }
        }

  let optionDiv;
  $("#options-area").on('click', function(e) {
    e.preventDefault();
    const target = $(e.target.parentElement.attributes[0]).context.value;
  
    if (typeof(options[target] !== null))
    {
      if (optionDiv)
      {
        optionDiv.toggle("slow");
      }
      
      optionDiv = $(options[target]);
      $(this).append(optionDiv.css('display', 'flex').addClass('active'));
    }
    else
    {
      options[target];
    }
   
  });

}());
