const modal = (function() {
  const $window = $(window),
        $modal = $('<div class="modal" />'),
        $content = $('<div class="modal-content" />'),
        $close = $('<button role="button" class="modal-close">close</button>');
  
  $modal.append($content, $close);
  
  $close.on('click', function(e) {
    e.preventDefault();
    modal.close();
  });
  
  return {
    center: function() {
      const top = Math.max($window.height() - $modal.outerHeight(), 0) / 2;
      const left = Math.max($window.width() - $modal.outerWidth(), 0) / 2;
      $modal.css({
        top: top + $window.scrollTop(),   // Center vertically
        left: left + $window.scrollLeft() // Center horizontally
      });
    },
    open: function(settings) {
      $content.empty().append(settings.content); // Set new content of modal
      
      $modal.css({
        width: settings.width || 'auto',
        heigth: settings.height || 'auto'
      }).appendTo('body');
      
      modal.center();
      $(window).on('resize', modal.center);
    },
    close: function() {
      $content.empty();
      $modal.detach();
      $(window).off('resize', modal.center);
    },
    addContent: function(target, content) {
      $(target).each(function() {
        $(this).addClass(content);
      });
    }
  };
}());
