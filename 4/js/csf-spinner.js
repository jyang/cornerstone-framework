/**
 * spinner widget
 * Exepcted options: {
 *   spinning: true/false
 * }
 */

(function($) {

  var SPINNER = '<img src="//www-opensocial.googleusercontent.com/gadgets/proxy/refresh=3600&container=enterprise&gadget=http%3A%2F%2Fgoogle-feedserver.googlecode.com%2Fsvn%2Ftrunk%2Fresources%2Fgadgets%2Fdomain-gadget-directory-manager%2Fspec.xml/http%3A%2F%2Fgoogle-feedserver.googlecode.com%2Fsvn%2Ftrunk%2Fresources%2Fgadgets%2Fdomain-gadget-directory-manager%2Fspinner.gif">';

  var spinner = {

    _init: function() {
      this.element.html(this.options.spinning ? SPINNER : '');
    },

  };

  $.widget('ui.spinner', spinner);
  $.extend($.ui.spinner, {
    version: '@VERSION',
    defaults: {
      spinning: true
    }
  });

})(jQuery);
