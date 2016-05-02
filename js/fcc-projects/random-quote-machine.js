$(function() {
  function GenerateRandomQuote(type) {
    if (type === "chuck") {
      // Fetch a new quote
      try {
        $json = $.getJSON('http://api.icndb.com/jokes/random');
      } catch(e) {
        $json = $.getJSON('https://api.icndb.com/jokes/random');
      }
      $json
        .done(function(data){ 
          try {
            $('#chuck-quote').html(data.value.joke); 
            $('#chuck-author').html('- Chuck Norris');
            quotesChuck.insert(quoteCountChuck, data.value.joke);
          } catch(e) {
            const msg = "Chuck Norris is currently in a bad mood.";
            $('#chuck-quote').html(msg); 
          }
        }); 
    } else if (type === "random") {
      const url = 'https://andruxnet-random-famous-quotes.p.mashape.com';
      const API_KEY = 'K7Vx9w8OhamshM3i54T8214UgSIvp1agM5cjsn5ytRmW0F1oZI';

      $.ajax({
        url: url,
        type: 'GET',
        data: {},
        dataType: 'json',
        timeOut: 2000,
        beforeSend: function(xhr) { 
          xhr.setRequestHeader("X-Mashape-Authorization", API_KEY);
        },
        success: function(data) { 
          $('#rand-quote').html(data.quote);
          $('#rand-author').html('- ' + data.author);
          quotesRand.insert(quoteCountRand, data.quote);
          quotesRandAuthor.insert(quoteCountRand, data.author);
        },
        error: function(err) { 
          $('#rand-quote').html("An error has occurred.");
          $('#author').html("Batman");
        }
      });
    }
  }
  
  // Insert an item at a particular index of an array
  Array.prototype.insert = function(index, item) {
    this.splice(index, 0, item);
  }
  
  // Create the panel tabs
  $('.tab-list').each(function() {
    let $this = $(this);
    let $tab = $this.find('li.active');
    let $link = $tab.find('a');
    let $panel = $($link.attr('href'));
    
    $this.on('click', '.tab-control', function(e) {
      e.preventDefault();
      let $link = $(this);  // store the current link
      let id = this.hash;  // Get href on clicked tab
      
      if (id && !$link.is('.active')) {
        $panel.removeClass('active');
        $panel = $(id).addClass('active');
        $tab.removeClass('active');
        $tab = $link.parent().addClass('active');
      }
    });
  });
  
  // Store quotes for array traversing purposes
  let quotesChuck = [], quotesRand = [], quotesRandAuthor = [];
  let quoteCountChuck = 0, quoteCountRand = 0;
  
  // Construct an array of colors for random html color variations
  const colors = ["#FFCCBC", '#FFAC9C', '#FF8C7C', '#FF7C6C', '#FF6C5C', '#F75C4C', 
                  '#E74C3C', '#D73C2C', '#C72C1C', '#B71C0C', '#A70C00', '#870000',
                  '#ffbcd8', '#ff8cc8', '#ff7cb8', '#ff6ca8', '#fa5c98', '#ea4c88',
                  '#da3c78', '#ca2c68', '#ba1c58', '#aa0c48', '#9a0038', '#8a0028',
                  '#DCC6E0', '#cea0e4', '#BE90D4', '#ab69c6', '#9b59b6', '#8E44AD',
                  '#7e349d', '#6e248d', '#5e147d', '#4e046d', '#3e005d', '#1e003d',
                  '#39d5ff', '#29c5ff', '#19B5FE', '#22A7F0', '#1297e0', '#0287d0',
                  '#0077c0', '#0067b0', '#0057a0', '#004790', '#003780', '#102770',
                  '#5efaf7', '#51f5ea', '#47ebe0', '#37dbd0', '#27cbc0', '#17bbb0',
                  '#07aba0', '#009b90', '#008b80', '#007b70', '#106b60', '#005b50',
                  '#8effc1', '#5efca1', '#4eec91', '#3edc81', '#2ecc71', '#1ebc61',
                  '#0eac51', '#009c41', '#008c31', '#007c21', '#006c11', '#005c01',
                  '#FDE3A7', '#ffcf4b', '#F9BF3B', '#f9b32f', '#F5AB35', '#F39C12', 
                  '#f1892d', '#e67e22', '#d87400', '#c86400', '#b85400', '#a84410',
                  '#ffdcb5', '#ffc29b', '#ffb28b', '#ffa27b', '#ff926b', '#f3825b',
                  '#e3724b', '#d3623b', '#c3522b', '#b3421b', '#a3320b', '#932210',
                  '#f6c4a3', '#eab897', '#dfad8c', '#d4a281', '#ce9c7b', '#be8c6b',
                  '#ae7c5b', '#9e6c4b', '#8e5c3b', '#7e4c2b', '#6e3c1b', '#5e2c0b',
                  '#c5d3e2', '#bccad9', '#acbac9', '#9caab9', '#8c9aa9', '#7c8a99',
                  '#6C7A89', '#5c6a79', '#4c5a69', '#3c4a59', '#2c3a49', '#1c2a39',
                  '#d5e5e6', '#c5d5d6', '#b5c5c6', '#a5b5b6', '#95a5a6', '#859596',
                  '#758586', '#657576', '#556566', '#455556', '#354546', '#253536',
                  '#e0e0e0', '#d0d0d0', '#c0c0c0', '#a0a0a0', '#909090', '#808080',
                  '#707070', '#606060', '#505050', '#404040', '#303030', '#000'];
  
  // Generate a random quote on load
  GenerateRandomQuote("chuck");
  GenerateRandomQuote("random");
  
  // Request a Chuck Norris joke
  $('#new-quote-chuck').on('click', function(e) { 
    e.preventDefault();
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    $('#chuck-quote').fadeOut(600);
    $('#chuck-author').fadeOut(600);
    $('html').addClass('changeColor');
    $('html').css('background-color', randColor);
    setTimeout(function() { GenerateRandomQuote("chuck"); }, 600);
    setTimeout(function() { $('html').removeClass('changeColor'); }, 2500);
    $('#chuck-quote').fadeIn(600);
    $('#chuck-author').fadeIn(600);
    quoteCountChuck += 1;
  });  
  
  // Request a random quotes
  $('#new-quote-rand').on('click', function(e) { 
    e.preventDefault();
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    $('#rand-quote').fadeOut(600);
    $('#rand-author').fadeOut(600);
    $('html').addClass('changeColor');
    $('html').css('background-color', randColor);
    setTimeout(function() { GenerateRandomQuote("random"); }, 300);
    setTimeout(function() { $('html').removeClass('changeColor'); }, 2500);
    $('#rand-quote').fadeIn(1500);
    $('#rand-author').fadeIn(1500);
    quoteCountRand += 1;
  });
  
  // Rotate the refresh icon on click
  $('.rotate-refresh').click(function() { 
    $(this).toggleClass('rot360');
    setTimeout(function() { $('.fa-refresh').toggleClass('rot360'); }, 300);
  });
  
  // Set up the Previous Quote buttons
  $('#prev-quote-chuck').on('click', function(e) {
    e.preventDefault();
    if (quoteCountChuck > 0) {
      $('#chuck-quote').html(quotesChuck[quoteCountChuck-1]);
      quoteCountChuck -= 1;
    }
  });
  $('#prev-quote-rand').on('click', function(e) {
    e.preventDefault();
    if (quoteCountRand > 0) {
      $('#rand-quote').html(quotesRand[quoteCountRand-1]);
      $('#rand-author').html('- ' + quotesRandAuthor[quoteCountRand-1]);
      quoteCountRand -= 1;
    }
  });
  
  // Set up the Next Quote buttons
  $('#next-quote-chuck').on('click', function(e) {
    e.preventDefault();
    if (quoteCountChuck < quotesChuck.length-1) {
      $('#chuck-quote').html(quotesChuck[quoteCountChuck+1]);
      quoteCountChuck += 1;
    }
  });
  $('#next-quote-rand').on('click', function(e) {
    e.preventDefault();
    if (quoteCountRand < quotesRand.length-1) {
      $('#rand-quote').html(quotesRand[quoteCountRand+1]);
      $('#rand-author').html('- ' + quotesRandAuthor[quoteCountRand+1]);
      quoteCountRand += 1;
    }
  });
  
  // Set up the social buttons:
  // 1. Facebook
  const $fb1 = $('#facebook1'), $fb2 = $('#facebook2'), $fb3 = $('#facebook3'); 
  // Popup adapted from 
  // http://stackoverflow.com/questions/14829040/facebook-sharer-popup-window/14829742#14829742
  function fbShare(url, quote, winWidth, winHeight) {
    const winTop = (document.documentElement.clientHeight / 2) - (350 / 2);
    const winLeft = (document.documentElement.clientWidth / 2) - (600 / 2);
    window.open('http://www.facebook.com/sharer.php?' + '&u=' + url + 'quote=' + quote
                , 'sharer', 'top=' + winTop + ',left=' + winLeft + 
                ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
  }
  $fb1.on('click', function() {
    const projectURL = 'http%3A%2F%2Freaper47.github.io%2Ffcc-projects%2Frandom-quote-machine%2Frandom-quote-machine.html&';
    const quote = 'Check%20out%20this%20beautiful%20random%20quote%20generator!';
    fbShare(projectURL, quote, 520, 350);
  });
  $fb2.on('click', function() {
    const projectURL = 'http%3A%2F%2Freaper47.github.io%2Ffcc-projects%2Frandom-quote-machine%2Frandom-quote-machine.html&';
    const quote = '"' + $('#chuck-quote').html() + '"' + '  ' + '-' + $('#chuck-author').html();
    fbShare(projectURL, quote, 520, 350);
  });
  $fb3.on('click', function() {
    const projectURL = 'http%3A%2F%2Freaper47.github.io%2Ffcc-projects%2Frandom-quote-machine%2Frandom-quote-machine.html&';
    const quote = '"' + $('#rand-quote').html() + '"' + '  ' + '-' + $('#rand-author').html();
    fbShare(projectURL, quote, 520, 350);
  });
  
  // 2. Twitter
  const $tweet1 = $('#twitter1'), $tweet2 = $('#twitter2'), $tweet3 = $('#twitter3');
  const baseURL = 'https://twitter.com/intent/tweet?';
  
  $tweet1.on('click', function() {
    const tweetText = 'text=Check%20out%20this%20beautiful%20random%20quote%20generator!&';
    const projectURL = 'url=http%3A%2F%2Freaper47.github.io%2Ffcc-projects%2Frandom-quote-machine%2Frandom-quote-machine.html&';
    const hashtags = 'hashtags=quotes,colorful,canada&';
    const related = 'related=freecodecamp%3AFree%20Code%20Camp&';
    const winTop = (document.documentElement.clientHeight / 2) - (350 / 2);
    const winLeft = (document.documentElement.clientWidth / 2) - (600 / 2);
    $tweet1.attr('href', baseURL  + tweetText + projectURL + hashtags + related);
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,' + 
                'scrollbars=yes,height=350,width=600,left=' + winLeft + ',top=' + winTop);
    return false;
  });
  $tweet2.on('click', function() {
    const tweetText = 'text=' + '"' + $('#chuck-quote').html() + '"' + '  ' + '-' + $('#chuck-author').html()
    const winTop = (document.documentElement.clientHeight / 2) - (350 / 2);
    const winLeft = (document.documentElement.clientWidth / 2) - (600 / 2);
    $tweet2.attr('href', baseURL  + tweetText);
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,' + 
                'scrollbars=yes,height=350,width=600,left=' + winLeft + ',top=' + winTop);
    return false;
  });
  $tweet3.on('click', function() {
    const tweetText = 'text=' + '"' + $('#rand-quote').html() + '"' + '  ' + '-' + $('#rand-author').html()
    const winTop = (document.documentElement.clientHeight / 2) - (350 / 2);
    const winLeft = (document.documentElement.clientWidth / 2) - (600 / 2);
    $tweet3.attr('href', baseURL  + tweetText);
    window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,' + 
                'scrollbars=yes,height=350,width=600,left=' + winLeft + ',top=' + winTop);
    return false;
  });
  
  // 3. Google Plus
  const $gplus1 = $('#gplus1'), $gplus2 = $('#gplus2'), $gplus3 = $('#gplus3');
  $gplus1.on('click', function() {
    const winTop = (document.documentElement.clientHeight / 2) - (600 / 2);
    const winLeft = (document.documentElement.clientWidth / 2) - (600 / 2);
    window.open(this.href + '%2Ffcc-projects%2Frandom-quote-machine%2Frandom-quote-machine.html', 
                '', 'menubar=no,toolbar=no,resizable=yes,' + 'scrollbars=yes,height=600,width=600,left=' + winLeft + ',top=' + winTop);
    return false;
  });
  $gplus2.on('click', function() {
    const winTop = (document.documentElement.clientHeight / 2) - (600 / 2);
    const winLeft = (document.documentElement.clientWidth / 2) - (600 / 2);
    window.open(this.href + '%2Ffcc-projects%2Frandom-quote-machine%2Frandom-quote-machine.html', 
                '', 'menubar=no,toolbar=no,resizable=yes,' + 'scrollbars=yes,height=600,width=600,left=' + winLeft + ',top=' + winTop);
    return false;
  });
  $gplus3.on('click', function() {
    const winTop = (document.documentElement.clientHeight / 2) - (600 / 2);
    const winLeft = (document.documentElement.clientWidth / 2) - (600 / 2);
    window.open(this.href + '%2Ffcc-projects%2Frandom-quote-machine%2Frandom-quote-machine.html', 
                '', 'menubar=no,toolbar=no,resizable=yes,' + 'scrollbars=yes,height=600,width=600,left=' + winLeft + ',top=' + winTop);
    return false;
  });
  
  // Toggle social share buttons
  $('#social-main').on('click', function() {
    $('aside a.share-icon1').each(function() {
      var $this = $(this);
      $this.toggle(300);
      $this.css('display', 'block');
    });
  });
  $('#social-chuck').on('click', function() {
    $('aside a.share-icon2').each(function() {
      var $this = $(this);
      $this.toggle(300);});
  });
  $('#social-rand').on('click', function() {
    $('aside a.share-icon3').each(function() {
      var $this = $(this);
      $this.toggle(300);});
  }); 
  
  // Animate the rotate button on click
  $('.rotate').click(function() { 
    $(this).addClass('down');
    window.setTimeout(function() {
      $(this).removeClass('down');}, 300);
  });
});
