/**
 * select widget
 * Exepcted options: {
 *   values: [..., ..., ...],
 *   identifyValue: function(value) { return ...id of value...; },
 *   selectedValueId: ...
 *   descriptions: ['...', '...', ...],
 *   describeValue: function(value) { return '...description of value...'; },
 *       // if descriptions doesn't exist
 *   selected: function(valueId) {...}
 * }
 */

(function($) {

  var select = {

    _init: function() {
      var select = this;
      var options = this.options;

      var html = ['<select class="ui-widget">'];
	    var describeValue = options.descriptions ?
	        function(e, i) { return options.descripitons[i]; } :
		      options.describeValue;
      $.each(options.values, function(i, e) {
        var id = options.identifyValue(e);
        html.push('<option value="', id, '"',
            options.selectedValueId == id ? ' selected' : '', '">',
		        describeValue(e, i), '</option>');
      });
      html.push('</select>');

      this.element.html(html.join(''));

      // buttons
      $('select', this.element).change(select._change);
    },

    _change: function(e) {
      var element = e.target;
      var widget = $(element).parent().data('select');
      widget.options.selectedValueId = element.options[element.selectedIndex].value;
      widget.options.selected(widget.options.selectedValueId);
    }

  };

  $.widget('ui.select', select);
  $.extend($.ui.select, {
    version: '@VERSION',
    defaults: {
      identifyValue: function(value) { return value; }
    }
  });

})(jQuery);

jQuery.fn.log = function (msg) {
  if ($.browser.msie) {
    $('body').append('<textarea style="width:100%">' + msg + '</textarea><br>');
  } else {
    console.log("%s: %o", msg, this);
    return this;
  }
};
