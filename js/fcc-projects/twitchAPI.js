$(function() {
  
  const users = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "unofin",
                 "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404", ""];
                    
  for (usr in users)
    displayData('https://api.twitch.tv/kraken/streams/' + users[usr], '#twitch-user-area', usr);
  
  $('#online').on('click', function() {
    $('#online').css('background-color', '#4caf50');
    $('#all').css('background-color', '#212121');
    $('#offline').css('background-color', '#212121');
    $('#online').css('color', '#FFF');
    $('#offline').css('color', '#212121');
    $('#all').css('color', '#212121');
    $('.online').parent().parent().fadeIn(500).show();
    $('.offline').parent().parent().fadeOut(500).hide();
    $('.closed').parent().parent().fadeOut(500).hide();
  });
  
  $('#offline').on('click', function() {
    $('#online').css('background-color', '#212121');
    $('#all').css('background-color', '#212121');
    $('#offline').css('background-color', '#ff5722');
    $('#online').css('color', '#212121');
    $('#offline').css('color', '#FFF');
    $('#all').css('color', '#212121');
    $('.online').parent().parent().fadeOut(500).hide();
    $('.offline').parent().parent().fadeIn(500).show();
    $('.closed').parent().parent().fadeIn(500).show();
  });
  
  $('#all').on('click', function() {
    $('#online').css('background-color', '#212121');
    $('#all').css('background-color', '#448aff');
    $('#offline').css('background-color', '#212121');
    $('#online').css('color', '#212121');
    $('#offline').css('color', '#212121');
    $('#all').css('color', '#fff');   
    $('.online').parent().parent().fadeIn(500).show();
    $('.offline').parent().parent().fadeIn(500).show();
    $('.closed').parent().parent().fadeIn(500).show();
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

      if (dataFetch == null) {
        let notStreaming = "Currently not streaming.",
            notStreamingPreview = "https://bit.ly/28JOZxD",
            notStreamingLogo = "https://bit.ly/28JrBPl",
            noStreamingGame = "Playing nada :D",
            notStreamingURL = "https://twitch.tv/";
        
        try { streamStatus[0] = dataFetch.channel.status; }
        catch(err) { streamStatus[0] = notStreaming; }
        
        try { streamPreview[0] = dataFetch.preview.large; }
        catch(err) { streamPreview[0] = notStreamingPreview; }
        
        try { streamLogo[0] = dataFetch.channel.logo; }
        catch(err) { streamLogo[0] = notStreamingLogo; }
                
        try { streamURL[0] = dataFetch.channel.url; }
        catch(err) { streamURL[0] = notStreamingURL + users[num]; }
        
        try { 
          streamUsr[0] = dataFetch.channel.display_name;
          streamTwitchStatus[0] = "online";
        }
        catch(err) { 
          streamUsr[0] = users[num];
          streamTwitchStatus[0] = "offline";
        }   
        
        try { streamGame[0] = dataFetch.game; }
        catch(err) { streamGame[0] = noStreamingGame; }
        
        try { streamViewers[0] = dataFetch.viewers; }
        catch(err) { streamViewers[0] = 0; }
        
        try { streamLang[0] = dataFetch.channel.language; }
        catch(err) { streamLang[0] = "Demonic"; }
        
      } else {
          $.each(dataFetch, function(i, item) {
            streamStatus[i] = item.channel.status; 
            streamPreview[i] = item.preview.large;
            streamLogo[i] = item.channel.logo;
            streamURL[i] = item.channel.url;
            streamUsr[i] = item.channel.display_name;
            streamTwitchStatus[i] = "online";
            streamGame[i] = item.game;
            streamViewers[i] = item.viewers;
            streamLang[i] = item.channel.language;
          });
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
      streamLang[0] = "Demonic";
      
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
});
