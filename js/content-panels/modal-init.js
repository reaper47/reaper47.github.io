(function() {
  if ($('#calc-info').length) {
    createModal('#calc-info', 340, 300, 'aside', false);
  } else if ($('#weather-info').length) {
    createModal('#weather-info', 340, 300, 'footer .right', true);
    
  }
  
  function createModal(id, pxWidth, pxHeight, target, data) {
    const $content = $(id).detach();
    
    $(target).on('click', function() {
      modal.open({content: $content, width: pxWidth, height: pxHeight});
      if (data) {
        modal.addContent('#ul-info > ul > li', 'init');
      }
    });
  }
}());
