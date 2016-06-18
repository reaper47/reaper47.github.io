$(function() {
  
  // 1. Display current kraken twitch streams
  displayData('https://api.twitch.tv/kraken/streams/')
 
  // 2. Display regular twitch users to show some offline accounts
  const regUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "unofin",
                    "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "comster404"];
  
  function displayData(json) {
    $.getJSON('https://api.twitch.tv/kraken/streams/').done(function(data) {

      // 1. All twitch data to display are stored in these variables
      let streamStatus = [], streamPreview = [], streamLogo = [], streamURL = [],
          streamUsr = [], streamGame = [], streamTwitchStatus = [], streamViewers = [],
          streamLang = []; 
        
      // 2. Store all data to display in their respective arrays
      $.each(data.streams, function(i, item) {
        try { streamStatus[i] = item.channel.status; } 
        catch(err) { streamStatus[i] = null; }
      });
      $.each(data.streams, function(i, item) {
        try { streamPreview[i] = item.preview.large; } 
        catch(err) { streamPreview[i] = null; }
      });
      $.each(data.streams, function(i, item) {
        try { streamLogo[i] = item.channel.logo; }
        catch(err) { streamLogo[i] = null; }
      });
      $.each(data.streams, function(i, item) {
        try { streamURL[i] = item.channel.url; }
        catch(err) { streamURL[i] = null; }
      });
      $.each(data.streams, function(i, item) {
        try { streamUsr[i] = item.channel.display_name; }
        catch(err) { streamUsr[i] = null; }
      });
      $.each(data.streams, function(i, item) { 
        try { streamTwitchStatus[i] = "online"; }
        catch(err) { streamTwitchStatus[i] = "offline" };
      });
      $.each(data.streams, function(i, item) { 
        try { streamGame[i] = item.game; }
        catch(err) { streamGame[i] = null; }
      });
      $.each(data.streams, function(i, item) {
        try { streamViewers[i] = item.viewers; }
        catch(err) { streamViewers[i] = null; }
      });
      $.each(data.streams, function(i, item) {
        try { streamLang[i] = item.channel.language; }
        catch(err) { streamLang[i] = null; }
      });
      
      // 3. Append every twitch user profile information to cloned divs
      for (let i = 0; i < streamStatus.length; ++i) {
        let clone = $('.twitch-users').clone();

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
        
        $('#twitch-user-area').html(clone);
      }
      $('.twitch-users')[0].remove();
  });
  }
});
