/**
 * table widget
 * Exepcted options: {
 *   columns: [{name: ..., key: ..., css: ..., editor: ...}, ...],
 *   rows: [{...}, ...]
 * }
 */

(function($) {

  // -----
  // utils

  var util = {
    addHover: function(e) {
      return $(e.target).addClass('ui-table-icon-state-hover');
    },
    removeHover: function(e) {
      return $(e.target).removeClass('ui-table-icon-state-hover');
    },
    setHover: function(e) {
      return e.hover(util.addHover, util.removeHover);
    },

    /**
     * @param name Name of icon as in "ui-icon-<name>"
     * @param title Tool tip
     * @param model Information about how to access model
     * @return HTML source of the icon
     */
    createIcon: function(name, title, model) {
      var html =  ['<span class="ui-icon ui-corner-all ui-icon-', name , '"'];

      if (title) {
        html.push('title="', title, '"');
      }

      if (model) {
        html.push('model="', model, '"');
      }

      html.push('></span>');

      return html.join('');
    },

    getContext: function(e) {
      var icon = $(e.target);
      var model = icon.attr('model').split(',');
      return {
        icon: icon, cell: icon.parent(),
        widget: util.findWidget(icon, 'table'),
        model: model, r: model[0], c: model[1]
      };
    },

    /**
     * Finds the widget containing an element
     * @param e Element to find ancestor for
     * @param name Name of widget
     * @return Widget the event is triggered on
     */
    findWidget: function(e, name) {
      var element = e.closest(name).parent();
      return element.data(name);
    }
  };

  var textEditor = {

    _init: function() {
      var value = this.options.value;
      var html = ['<input value="', value, '" size="', value.length, '">'];
      this.element.append(html.join(''));
    }

  };

  $.widget('ui.textEditor', textEditor);
  $.extend($.ui.textEditor, {
    version: '@VERSION',
    defaults: {
      value: ''
    }
  });

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
      html.push('</tr></tbody></table>');

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
      var value = row[column.key];
      value = column.decorator ? column.decorator(value) : value;
      return value + (column.editor ?
          util.createIcon('pencil', 'edit', r + ',' + c) : '');
    },

    _editCell: function(e) {
      var context = util.getContext(e);
      with(context) {
        with(widget.options) {
          if (columns[c].editor == 'text') {
            var text = cell.text();
            cell.html('<span class="editor"></span>' +
                util.createIcon('disk', 'save', model) +
                util.createIcon('cancel', 'cancel', model));

            var editor = $('.editor', cell).textEditor({value: text});

            util.setHover($('.ui-icon-disk', cell)).click(function(e) {
              widget._saveCell(e, editor);
            });
            util.setHover($('.ui-icon-cancel', cell).click(widget._cancelCell));
          }
        }
      }
    },

    _cancelCell: function(e) {
      var context = util.getContext(e);
      context.widget._showCell(context);
    },

    _saveCell: function(e, editor) {
      var context = util.getContext(e);
      with(context) {
        with(widget.options) {
          var value = $('input', editor).attr('value');
          rows[r][columns[c].key] = value;
          widget._showCell(context);
          widget._notifyUpdate(rows[r], r);
        }
      }
    },

    _showCell: function(context) {
      with(context) {
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
    },

    _notifyUpdate: function(row, rowNum) {
      $(row).log('Updated: [' + rowNum + ']');
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

jQuery.fn.log = function (msg) {
  if ($.browser.msie) {
    $('body').append('<textarea style="width:100%">' + msg + '</textarea><br>');
  } else {
    console.log("%s: %o", msg, this);
    return this;
  }
};
