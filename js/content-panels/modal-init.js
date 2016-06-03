(function() {
  if ($('#calc-info').length) {
    createModal('#calc-info', 340, 300, false);
  } else if ($('#weather-info').length) {
    createModal('#weather-info', 340, 300, true);
    
  }
  
  function createModal(id, pxWidth, pxHeight, data) {
    const $content = $(id).detach();
    $('footer .right').on('click', function() {
      modal.open({content: $content, width: pxWidth, height: pxHeight});
      if (data) {
        modal.addContent('#ul-info > ul > li', 'init');
      }
    });
  }
}());
