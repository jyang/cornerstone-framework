/**
 * table widget
 * Exepcted options: {
 *   columns: [{name: ..., key: ..., css: ..., editor: ...}, ...],
 *   rows: [{...}, ...]
 * }
 */

(function($) {

  var util = {
    addHover: function(e) {
      $(e.target).addClass('ui-table-icon-state-hover');
    },
    removeHover: function(e) {
      $(e.target).removeClass('ui-table-icon-state-hover');
    },
    setHover: function(e) {
      e.hover(util.addHover, util.removeHover);
    },
    createIcon: function(name, model) {
      return '<span class="ui-icon ui-corner-all ui-icon-' + name + '"' +
          (model ? 'model="' + model + '"' : '')+
          '></span>';
    },

    /**
     * Finds the widget containing an element
     * @param e event
     * @return Widget the event is triggered on
     */
    findWidget: function(e) {
      var element = e.closest('table').parent();
      return element.data('table');
    }
  };

  var table = {

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
          html.push(column.css ? '<td class="' + column.css + '">' : '<td>',
              cellContent, '</td>');
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
        $(e.target).closest('tr').addClass('ui-table-state-hover');
      }, function(e) {
        $(e.target).closest('tr').removeClass('ui-table-state-hover');
      });

      // icons
      util.setHover($('.ui-icon', this.element));

      // buttons
      $('.ui-icon-pencil', this.element).click(table._editCell);
    },

    _cell: function(r, row, c, column) {
      return row[column.key] +
          (column.editor ? util.createIcon('pencil', r + ',' + c) : '');
    },

    _editCell: function(e) {
      var icon = $(e.target);
      var widget = util.findWidget(icon);
      with(widget.options) {
        var model = icon.attr('model');
        var rc = model.split(',');
        var r = rc[0], c = rc[1];
        if (columns[c].editor == 'text') {
          var cell = icon.parent();
          cell.html('editor ' + util.createIcon('disk', model) +
              util.createIcon('cancel', model));

          util.setHover($('.ui-icon-disk', cell).click(widget._saveCell));
          util.setHover($('.ui-icon-cancel', cell).click(widget._cancelCell));
        }
      }
    },

    _cancelCell: function(e) {
      var icon = $(e.target);
      var widget = util.findWidget(icon);
      widget._showCell(icon, widget, function() {}); 
    },

    _saveCell: function(e) {
      var icon = $(e.target);
      var widget = util.findWidget(icon);
      widget._showCell(icon, widget, function() {
        // save
      }); 
    },

    _showCell: function(icon, widget, continuation) {
      var cell = icon.parent();
      var model = icon.attr('model').split(',');
      var r = model[0], c = model[1];

      var cellContent = widget._cell(
          r, widget.options.rows[r], c, widget.options.columns[c]);
      cell.html(cellContent);

      util.setHover($('.ui-icon-pencil', cell).click(widget._editCell));

      cell.hover(function(e) {
        $(e.target).closest('tr').addClass('ui-table-state-hover');
      }, function(e) {
        $(e.target).closest('tr').removeClass('ui-table-state-hover');
      });
    }

  };

  $.widget('ui.table', table);
  $.extend($.ui.table, {
    version: '@VERSION',
    defaults: {
      columns: [],
      rows: []
    }
  });

})(jQuery);
