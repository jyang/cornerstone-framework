/**
 * spinner widget
 * Exepcted options: {
 *   spinning: true/false
 * }
 */

(function($) {

  var SPINNER = '<img src="http://google-feedserver.googlecode.com/svn/trunk/resources/gadgets/private-gadget-editor/spinner.gif">';

  var spinner = {

    _init: function() {
      this.element.html(this.options.spinning ? SPINNER : '');
    }

  };

  $.widget('ui.spinner', spinner);
  $.extend($.ui.spinner, {
    version: '@VERSION',
    defaults: {
      spinning: true
    }
  });

})(jQuery);
