/**
 * table widget
 */

/*
<table id="list" class="ui-widget" cellspacing="0">
    <thead class="ui-state-default">
      <tr>
        <th t:loop="columns">${name}</th>
      </tr>
    </thead>
    <tbody class="ui-widget-content">
      <tr t:loop="rows" class="${_i_even ? 'even' : 'odd'}">
        <td t:loop="columns" class="${css}">${eval(key)}</td>
      </tr>
    </tbody>
  </table>
*/

(function($) {

	var prototype = {

		_init: function() {
			var options = this.options;

			var html = ['<table class="ui-widget" cellspacing="0"><thead class="ui-state-default"><tr>'];
			$.each(options.columns, function(i, e) {
				html.push('<th>', e.name, '</th>');
			});
			html.push('</tr></thead><tbody class="ui-widget-content">');
			$.each(options.rows, function(r, row) {
				html.push('<tr>');
				$.each(options.columns, function(c, column) {
					html.push(column.css ? '<td class="' + column.css + '">' : '<td>', row[column.key], '</td>');
				});
				html.push('</tr>');
			});
			html.push('</tr></tbody><tfoot class="ui-widget-footer ui-state-default ui-corner-bl ui-corner-br"><tr><td colspan="3"><div class="ui-icon ui-corner-all ui-icon-plus"></div><div class="ui-icon ui-corner-all ui-icon-pencil"></div><div class="ui-icon ui-corner-all ui-icon-trash"></div></td></tr></tfoot></table>');

			this.element.append(html.join(''));

			// complete styles
			$('tbody tr:odd', this.element).addClass('ui-table-odd');

			// add event listeners

			// row hover
		  $('.ui-widget-content tr', this.element).hover(function(e) {
		  	$(e.target.parentNode).addClass('ui-state-hover');
		  }, function(e) {
		  	$(e.target.parentNode).removeClass('ui-state-hover');
		  });

		  // icons
		  $('.ui-icon', this.element).hover(function(e) {
		  	$(e.target).addClass('ui-state-hover');
		  }, function(e) {
		  	$(e.target).removeClass('ui-state-hover');
		  })
		}

	};

	$.widget('ui.table', prototype);
	$.extend($.ui.table, {
		version: '@VERSION',
		defaults: {
			columns: [],
			rows: []
		}
	});

})(jQuery);
