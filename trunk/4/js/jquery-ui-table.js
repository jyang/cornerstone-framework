/**
 * table widget
 * Exepcted options: {
 *   columns: [{name: ..., key: ..., css: ..., editor: ...}, ...],
 *   rows: [{...}, ...]
 * }
 */

(function($) {

	var prototype = {

		_init: function() {
			var table = this;
			var options = this.options;

			var html = ['<table class="ui-widget" cellspacing="0"><thead class="ui-state-default"><tr>'];
			$.each(options.columns, function(i, e) {
				html.push('<th>', e.name, '</th>');
			});
			html.push('</tr></thead><tbody class="ui-widget-content">');
			$.each(options.rows, function(r, row) {
				html.push('<tr>');
				$.each(options.columns, function(c, column) {
					var cellContent = table._cell(r, row, c, column);
					html.push(column.css ? '<td class="' + column.css + '">' : '<td>', cellContent, '</td>');
				});
				html.push('</tr>');
			});
			html.push('</tr></tbody>');
			// html.push('<tfoot class="ui-widget-footer ui-state-default ui-corner-bl ui-corner-br"><tr><td colspan="3"><div class="ui-icon ui-corner-all ui-icon-plus"></div><div class="ui-icon ui-corner-all ui-icon-pencil"></div><div class="ui-icon ui-corner-all ui-icon-trash"></div></td></tr></tfoot>');
			html.push('</table>');

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

			// pencil (edit)
			$('.ui-icon-pencil').click(table._editCell);
		},

		_cell: function(r, row, c, column) {
			return row[column.key] + (column.editor ?
			    '<span class="ui-icon ui-corner-all ui-icon-pencil" model="' + r + ',' + c + '"></span>' : '');
		},

		_editCell: function(e) {
			var icon = $(e.target);
			var element = icon.closest('table').parent();
			var widget = element.data('table');
			with(widget.options) { // HERE
			  var model = icon.attr('model');
				var rc = model.split(',');
				var r = rc[0], c = rc[1];
				if (columns[c].editor == 'text') {
          console.log('model=' + rows[r][columns[c].key]);
					var cell = icon.parent();
					cell.html('editor <span class="ui-icon ui-corner-all ui-icon-disk" model="' + model + '"></span>');
					$('.ui-icon-disk', cell).hover(function(e) {
						$(e.target).addClass('ui-state-hover');
					}, function(e) {
						$(e.target).removeClass('ui-state-hover');
					}).click(widget._saveCell);
				}
			}
		},

    _saveCell: function(e) {
			var icon = $(e.target);
			var element = icon.closest('table').parent();
			var widget = element.data('table');
			var cell = icon.parent();
      var rc = icon.attr('model').split(',');
      var r = rc[0], c = rc[1];
			var cellContent = widget._cell(r, widget.options.rows[r], c, widget.options.columns[c]);
			cell.html(cellContent);
			$('.ui-icon-pencil', cell).click(widget._editCell);
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
