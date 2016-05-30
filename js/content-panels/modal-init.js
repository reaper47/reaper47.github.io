(function() {
  const $content = $('#calc-info').detach();
  
  $('aside').on('click', function() {
    modal.open({content: $content, width: 340, height: 300});
  });
}());
