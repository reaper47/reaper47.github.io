$(function() {

  const users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "unofin",
                 "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", "JamesBond"];

  for (usr in users) {
    displayData('https://wind-bow.gomix.me/twitch-api/streams/' + users[usr], '#twitch-user-area', usr);
  }

  $('#online').on('click', function() {
    $('#online').css('background-color', '#4caf50');
    $('#all, #offline').css('background-color', '#212121');
    $('#online').css('color', '#FFF');
    $('#offline, #all').css('color', '#212121');
    $('.online').parent().parent().fadeIn(500).show();
    $('.offline, .closed').parent().parent().fadeOut(500).hide();
    $('.online').parent().parent().parent().fadeIn(500).show();
    $('.offline, .closed').parent().parent().parent().fadeOut(500).hide();
  });

  $('#offline').on('click', function() {
    $('#online, #all').css('background-color', '#212121');
    $('#offline').css('background-color', '#ff5722');
    $('#online, #all').css('color', '#212121');
    $('#offline').css('color', '#FFF');
    $('.online').parent().parent().fadeOut(500).hide();
    $('.offline, .closed').parent().parent().fadeIn(500).show();
    $('.online').parent().parent().parent().fadeOut(500).hide();
    $('.offline, .closed').parent().parent().parent().fadeIn(500).show();
  });

  $('#all').on('click', function() {
    $('#online, #offline').css('background-color', '#212121');
    $('#all').css('background-color', '#448aff');
    $('#online, #offline').css('color', '#212121');
    $('#all').css('color', '#fff');
    $('.online, .offline').parent().parent().fadeIn(500).show();
    $('.online, .offline').parent().parent().parent().fadeIn(500).show();
  });

  function displayData(json, where, num) {
    $.getJSON(json).done(function(data) {

      // 1. All twitch data to display are stored in these variables
      let streamStatus = [], streamPreview = [], streamLogo = [], streamURL = [],
          streamUsr = [], streamGame = [], streamTwitchStatus = [],
          streamViewers = [], streamLang = [];

      // 2. Store all data to display in their respective arrays
      let dataFetch;
      if (data.streams) dataFetch = data.streams;
      else dataFetch = data.stream;

      console.log("USR: ", dataFetch)

      if (dataFetch == null) {
        let notStreaming = "Currently not streaming.",
            notStreamingPreview = "https://bit.ly/28JOZxD",
            notStreamingLogo = "https://bit.ly/28JrBPl",
            noStreamingGame = "Playing nada :D",
            notStreamingURL = "https://twitch.tv/";

        try {
          streamStatus[0] = dataFetch.channel.status;
        }
        catch(err) {
           streamStatus[0] = notStreaming;
        }

        try {
          streamPreview[0] = dataFetch.preview.large;
        }
        catch(err) {
          streamPreview[0] = notStreamingPreview;
        }

        try { streamLogo[0] = dataFetch.channel.logo; }
        catch(err) { streamLogo[0] = notStreamingLogo; }

        try {
          streamURL[0] = dataFetch.channel.url;
        }
        catch(err) {
          streamURL[0] = notStreamingURL + users[num];
        }

        try {
          streamUsr[0] = dataFetch.channel.display_name;
          streamTwitchStatus[0] = "online";
        }
        catch(err) {
          streamUsr[0] = users[num];
          streamTwitchStatus[0] = "offline";
        }

        try {
          streamGame[0] = dataFetch.game;
        }
        catch(err) {
          streamGame[0] = noStreamingGame;
        }

        try {
          streamViewers[0] = dataFetch.viewers;
        }
        catch(err) {
          streamViewers[0] = 0;
        }

        try {
          streamLang[0] = dataFetch.channel.language;
        }
        catch(err) {
          streamLang[0] = "zzz";
        }

      } else {
          $.each(dataFetch, function(i, item) {
            streamStatus[0] = dataFetch.channel.status;
            streamPreview[0] = dataFetch.preview.large;
            streamLogo[0] = dataFetch.channel.logo;
            streamURL[0] = dataFetch.channel.url;
            streamUsr[0] = dataFetch.channel.display_name;
            streamTwitchStatus[0] = "online";
            streamGame[0] = dataFetch.game;
            streamViewers[0] = dataFetch.viewers;
            streamLang[0] = dataFetch.channel.language;
          });
          console.log("DATA: ", dataFetch)
      }

      // 3. Append every twitch user profile information to cloned divs
      for (let i = 0; i < streamStatus.length; ++i) {
        let clone = $('.twitch-users').clone().removeAttr('id') ;

        // 3.1. Modify the hover div info
        const hoverDiv = clone[0].children[0].children[0];
        hoverDiv.alt = streamUsr[i] + "'s channel preview";
        hoverDiv.src = streamPreview[i];

        // 3.2. Modify the channel visuals div
        const channelVisualDiv = clone[0].children[1].children[0];
        channelVisualDiv.children[0].className += ' ' + streamTwitchStatus[i];
        channelVisualDiv.children[1].href = streamURL[i];
        channelVisualDiv.children[1].children[0].alt = (streamUsr[i] + "'s channel");
        channelVisualDiv.children[1].children[0].src = streamLogo[i];



        // 3.3. Modify the channel info data
        const channelInfoData = clone[0].children[1].children[1].children[0];
        channelInfoData.href = streamURL[i];
        channelInfoData.children[0].children[0].textContent = streamUsr[i];
        channelInfoData.children[0].children[1].textContent = streamGame[i];
        channelInfoData.children[1].textContent = streamStatus[i];

        // 3.4. Modify the bonus information div
        const bonusInfoDiv = clone[0].children[1].children[2];
        bonusInfoDiv.children[0].children[1].textContent = streamLang[i];
        bonusInfoDiv.children[1].children[1].textContent = streamViewers[i];

        $(where).html(clone);
      }
  }).fail(function(err) {

      let closedStreaming = "Account closed.";
      let closedStreamingPreview = "https://bit.ly/28J8J3T";
      let closedStreamingLogo = "https://bit.ly/28JZ7p0";
      let closedStreamingGame = "Playing real life.";
      let closedStreamingURL = "https://en.wikipedia.org/wiki/Reality";

      let streamStatus = [], streamPreview = [], streamLogo = [],
          streamURL = [], streamUsr = [], streamGame = [],
          streamTwitchStatus = [], streamViewers = [], streamLang = [];

      streamStatus[0] = closedStreaming;
      streamPreview[0] = closedStreamingPreview;
      streamLogo[0] = closedStreamingLogo;
      streamURL[0] = closedStreamingURL;
      streamUsr[0] = users[num];
      streamTwitchStatus[0] = "closed";
      streamGame[0] = closedStreamingGame;
      streamViewers[0] = 0;
      streamLang[0] = "zzz";

      for (let i = 0; i < streamStatus.length; ++i) {
        let clone = $('.twitch-users').clone().removeAttr('id') ;

        // 3.1. Modify the hover div info
        const hoverDiv = clone[0].children[0].children[0];
        hoverDiv.alt = streamUsr[i] + "'s channel preview";
        hoverDiv.src = streamPreview[i];

        // 3.2. Modify the channel visuals div
        const channelVisualDiv = clone[0].children[1].children[0];
        channelVisualDiv.children[0].className += ' ' + streamTwitchStatus[i];
        channelVisualDiv.children[1].href = streamURL[i];
        channelVisualDiv.children[1].children[0].alt = (streamUsr[i] + "'s channel");
        channelVisualDiv.children[1].children[0].src = streamLogo[i];

        // 3.3. Modify the channel info data
        const channelInfoData = clone[0].children[1].children[1].children[0];
        channelInfoData.href = streamURL[i];
        channelInfoData.children[0].children[0].textContent = streamUsr[i];
        channelInfoData.children[0].children[1].textContent = streamGame[i];
        channelInfoData.children[1].textContent = streamStatus[i];

        // 3.4. Modify the bonus information div
        const bonusInfoDiv = clone[0].children[1].children[2];
        bonusInfoDiv.children[0].children[1].textContent = streamLang[i];
        bonusInfoDiv.children[1].children[1].textContent = streamViewers[i];

        $(where).html(clone);
      }
    });
  }

  function createUsrCache() {
    const $twitch_users = $('.twitch-users');
    let cache = [];

    $twitch_users.each(function() {
      if (this.style.display !== 'none') {
        cache.push({
          element: this,
          username: this.children[1].children[1].children[0].children[0].children[0]
                   .textContent.trim().toLowerCase()
        });
      }
    });

    return cache;
  }

  function checkCache() {
    if (!cacheCreated) {
      userCache = createUsrCache();
      cacheCreated = true;
      buttonChanged = false;
    }
  }

  function filter() {
    const query = this.value.trim().toLowerCase();

    userCache.forEach(function(usr) {
      let index = 0;
      if (query) {
        index = usr.username.indexOf(query)
      }
      usr.element.style.display = index === -1 ? 'none' : '';
    });
  }

  let cacheCreated = false. userCache;
  $('#searchForm').on('keypress', function(e) {
    checkCache();
    $('#search-filter').on('keyup', filter);
  });

  $('#searchForm').on('submit', function(e) {
     e.preventDefault();
  });

  $('#offline, #online, #all').on('click', function() {
    cacheCreated = false;
    checkCache();
  });
});
