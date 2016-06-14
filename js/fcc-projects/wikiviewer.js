$(function(){

  // 1.0. Populate the language selection select boxes
  let languagesObject, languageList = [];
  $.ajax({
    async: false,
    url: 'languages.json',
    dataType: 'json',
    method: 'GET',
    mimeType: 'application/json',
    success: function(data) {
      // 1.1. Populate all languages in an array
      $.each(data.languages, function(index){
        languageList.push(index);
      });
      languagesObject = data.languages;

      // 1.2. Create all options for the language selection form.
      languageList = languageList.sort();
      let options = '';
      for (let i = 0; i < languageList.length; ++i) {
        if (languageList[i] === "English"){
          options += '<option value="' + languagesObject[languageList[i]].abv + 
                     '"selected>' + languageList[i] + '</option>';
        } else {
          options += '<option value="' + languagesObject[languageList[i]].abv + 
                     '">' + languageList[i] + '</option>';
        }
      }
      const selectBox = document.getElementById('language');
      selectBox.innerHTML = options;
    },
    error: function(err) {
      console.log(err);
    }
  });

  // 2.0. Get a random article when the random button is pressed
  $('#search-rand').on('click', function(e) {
    e.preventDefault();
    const selectTag = document.getElementById('language').selectedIndex,
          abv = document.getElementsByTagName('option')[selectTag].value,
          rand = languagesObject[languageList[selectTag]].rand,
          randURL = "https://" + abv + "." + "wikipedia.org/wiki/" + rand;
     window.open(randURL);
  });
  
  // 3.0. Set up the wiki search API to search for any article. Fast mode sends 
  // an api request after every keyboard input. Slow mode sends a request after a submit.
  
  
});
