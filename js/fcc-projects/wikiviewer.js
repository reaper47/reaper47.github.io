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
        if (languageList[i] === "English") {
          options += '<option class="lang" value="' + languagesObject[languageList[i]].abv + 
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
  
  // 1.3. Focus on the search form
  document.getElementById('search').focus();
  $('#searchForm').children('input').val('');
  document.getElementById('load-more').disabled = false;

  // 1.4. Make sure fast mode is checked on page load
  let noSubmit;
  if ($('#radio1').prop('checked', true)) {
    noSubmit = true;
  }
  
  // 1.4.1. Determine which radio button is checked. 
  $('input[name=radios]').on('click', function() {
    if ($(this['value']).selector === 'fast') {
      document.getElementById('radio1').setAttribute('checked', true);
      document.getElementById('radio2').setAttribute('checked', false);
      noSubmit = true;
    } else {
      document.getElementById('radio1').setAttribute('checked', false);
      document.getElementById('radio2').setAttribute('checked', true);
      noSubmit = false;
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
  
  // 3.0. Set up the wiki search API to search for any article. 
  // 3.1. Slow mode sends a request after a submit.
  let wikiInfo = {};
  $('#searchForm').on('submit', function(e) {
    e.preventDefault();
    if (document.getElementById("radio2").checked && noSubmit === false) {
      const selectTag = document.getElementById('language').selectedIndex,
          abv = document.getElementsByTagName('option')[selectTag].value,
          $searchQuery = "&search=" + $('#search').val(),
          baseURL = "https://" + abv + ".wikipedia.org/w/api.php" + 
                    "?action=opensearch" + "&format=json" + "&limit=100" + 
                    "&profile=classic" + "&utf8=1" + "&formatversion=2" + $searchQuery;
                          
      // Request data if the search input is not empty
      if ($searchQuery.substr(8, $searchQuery.length-1).length > 0) 
        getWikiArticles(baseURL, 0, 10, "new");
      
      // Enable the load more button as a change in the search has been made
      if (document.getElementById('load-more').disabled)
        document.getElementById('load-more').disabled = false;
    }
  });
  
  // 3.2.1 Slow mode on icon click
  $('#icon-submit').on('click', function(e) {
    e.preventDefault();
    if (document.getElementById("radio2").checked && noSubmit === false) {
      const selectTag = document.getElementById('language').selectedIndex,
          abv = document.getElementsByTagName('option')[selectTag].value,
          $searchQuery = "&search=" + $('#search').val(),
          baseURL = "https://" + abv + ".wikipedia.org/w/api.php" + 
                    "?action=opensearch" + "&format=json" + "&limit=100" + 
                    "&profile=classic" + "&utf8=1" + "&formatversion=2" + $searchQuery;
                         
      // Request data if the search input is not empty
      if ($searchQuery.substr(8, $searchQuery.length-1).length > 0) 
        getWikiArticles(baseURL, 0, 10, "new");
      
      // Enable the load more button as a change in the search has been made
      if (document.getElementById('load-more').disabled)
        document.getElementById('load-more').disabled = false;
    }
  });
  
  // 3.2.2 Fast mode sends an api request after every keyboard input.
  $('#search').keypress(function(event) {
    if (document.getElementById("radio1").checked && $('#search').val().length > 0) {
      const selectTag = document.getElementById('language').selectedIndex,
            abv = document.getElementsByTagName('option')[selectTag].value
            $searchQuery = "&search=" + $('#search').val();
      
      // 3.2.3. Make sure all typed letters are in the query string
      if (event.which !== 13 && event.which !== 8) {
        $searchQuery += String.fromCharCode(event.which);
      } else if (event.which === 8) {
        $searchQuery = $searchQuery.substr(0, $searchQuery.length-1);
      } else if (event.which === 13) {
        $('#searchForm').children('input').val('');
        return;
      } 
        
      const baseURL = "https://" + abv + ".wikipedia.org/w/api.php" + 
                      "?action=opensearch" + "&format=json" + "&limit=100" + 
                      "&profile=classic" + "&utf8=1" + "&formatversion=2" + $searchQuery;
      
      // Only request pages if the query length is not empty
      if ($searchQuery.substr(8, $searchQuery.length-1).length > 0)
        getWikiArticles(baseURL, 0, 10, "new");
      
      // Enable the load more button as a change in the search has been made
      if (document.getElementById('load-more').disabled)
        document.getElementById('load-more').disabled = false;
    }
  });  
  
  // 3.3. Select all text when in focus
  $(document).on('click', 'input[type=search]', function() { this.select(); });
  
  // 4.0. Append more results when the load more button is clicked/pressed.
  $('#load-more').on('click', function() {
    const selectTag = document.getElementById('language').selectedIndex,
          abv = document.getElementsByTagName('option')[selectTag].value
          $searchQuery = "&search=" + $('#search').val(),
          baseURL = "https://" + abv + ".wikipedia.org/w/api.php" + 
                    "?action=opensearch" + "&format=json" + "&limit=100" + 
                    "&profile=classic" + "&utf8=1" + "&formatversion=2" + $searchQuery;
                    
    getWikiArticles(baseURL, wikiInfo.resOnDisp, wikiInfo.resOnDisp + 10, "append")
    if (wikiInfo.resOnDisp === 90) 
      document.getElementById('load-more').disabled = true;
  });
  
  function getWikiArticles(url, start, end, type) {
    $.ajax({
      url: url,
      async: false,
      type: 'GET',
      data: {},
      dataType: 'jsonp',
      timeOut: 2000,
      beforeSend: function(xhr) {
        if (xhr.overrideMimeType) { xhr.overrideMimeType("application/json"); }
      },
      success: function(data) {
        wikiInfo["titles"] = data[1];
        wikiInfo["descriptions"] = data[2];
        wikiInfo["links"] = data[3];
        wikiInfo["url"] = url;
        wikiInfo["resOnDisp"] = end;
        
        const titles = wikiInfo.titles,
              descriptions = wikiInfo.descriptions,
              links = wikiInfo.links;

        let wikiContent = '';
        for (let entry = start; entry < end; ++entry) {
          if (links[entry] !== undefined) {
            if (descriptions[entry] === '') {
              descriptions[entry] = "No description available at this time.";
            }
            wikiContent += '<a href="' + links[entry] + 
                           '" class="search-result-box" target="_blank">' + 
                           '<div class="search-result-item">' +
                           '<h3>' + titles[entry] + '</h3>' +
                           '<p>' + descriptions[entry] + '</p></div></a>';
          }
        }
        if (type === "new") $('#search-results').html(wikiContent);
        else if (type === "append") $('#search-results').append(wikiContent);
      },
      fail: function(fail) {
        console.log(fail);
      },
      error: function(err) {
        console.log(err);
      }
    });
  }            
});
