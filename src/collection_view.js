/*global define:true */
define(['jquery', 'underscore'], function ($, _) {
  "use strict";

  /*
   * Generates a marker tag so we can easily know in which tag
   * the items of the collections are rendered
   */
  function _generateMarker (id) {
    return '<script id="' + id + '"></script>';
  }

  /*
   * Removes the marker and actually sets the container
   * now it's been identified
   */
  function _markContainer (el, id) {
    var $marker = el.find("#" + id);
    var $container = $marker.parent();
    $marker.remove();
    return $container;
  }

  /*
   * Takes a wrapping template and an item template
   * and renders a set of items accordingly
   */
  var CollectionView = function (options) {
    if (!options.items) {
      throw new Error('No items provided to a Collection view');
    }
    this.items = options.items;
    this.options = options;
  };

  /*
   * Renders an item accordingly to its template
   */
  CollectionView.prototype.prepareItem = function (item) {
    var itemTemplate = this.options.itemTemplate;
    return itemTemplate(item);
  };

  /*
   * Renders the whole collection
   */
  CollectionView.prototype.render = function () {
    this.reset();
    var _id = _.uniqueId('collview_');
    var containerMarker = _generateMarker(_id);
    this.options.el.html(this.options.template(function () { return containerMarker; }));
    this._$container = _markContainer(this.options.el, _id);
    _.each(this.items, function (item, index) {this._renderItemAt(index);}, this);
  };

  /*
   * Removes everything from the collection view and clears the view
   */
  CollectionView.prototype.reset = function () {
    if (this._$container) {
      this._$container.remove();
      this._$container = null;
    }
    var elements = this._itemsElements || [];
    _.each(elements, function (elt) {
      elt.remove();
    });
    this._itemsElements = [];
  };

  /*
   * Appends an item to the collection
   * renders the item at the end of the view
   */
  CollectionView.prototype.appendItem = function (item) {
    this.insertItemAt(item, this.items.length);
  };

  /*
   * Prepends an item to the collection
   * renders the item at the beginning of the view
   */
  CollectionView.prototype.prependItem = function (item) {
    this.insertItemAt(item, 0);
  };

  /*
   * Inserts an item to the collection at a specific position
   * renders the item in the view at that position
   */
  CollectionView.prototype.insertItemAt = function (item, pos) {
    pos = Math.max(0, Math.min(pos, this.items.length));
    this.items.splice(pos, 0, item);
    this._renderItemAt(pos);
  };

  /*
   * Removes an item from the collection
   * Deletes its view
   */
  CollectionView.prototype.removeItem = function (item) {
    var pos;
    _.each(this.items, function (_item, _pos) {
      if (item === _item) {
        pos = _pos;
      }
      return false;
    });
    this.removeItemAt(pos);
  };

  /*
   * Moves an item to a specified position in the collection
   */
  CollectionView.prototype.moveItem = function (item, toPos) {
    var fromPos = this.items.indexOf(item);
    var itemArray = this.items.splice(fromPos, 1);
    this.items.splice(toPos, 0, itemArray[0]);

    this._moveInDom(fromPos, toPos);
  };

  /*
   * Removes an item at a specific position
   * Removes its view
   */
  CollectionView.prototype.removeItemAt = function (pos) {
    this.items.splice(pos, 1);
    _.each(this._itemsElements.splice(pos, 1), function (item) {
      item.remove();
    });
  };

  /*
   * Generates the view for a specific item
   * Displays it at the correct position
   */
  CollectionView.prototype._renderItemAt = function (pos) {
    if (!this._$container) {
      return this.render();
    }
    var item = this.items[pos];
    var _renderedItem = $(this.prepareItem(item));
    this._insertInDom(_renderedItem, pos);
  };

  /*
   * Inserts a rendered element corresponding to an item in the DOM
   * at the required position.
   * Should not be used directly
   */
  CollectionView.prototype._insertInDom = function (el, pos) {
    var renderedItems = this._itemsElements;
    renderedItems.splice(pos, 0, el);

    if (pos === 0) {
      this._$container.prepend(el);
    } else {
      renderedItems[pos - 1].after(el);
    }
  };

  /*
   * Moves a DOM element of the collection from a place to another
   * Only affects the DOMi, should not be used directly
   */
  CollectionView.prototype._moveInDom = function (from, to) {
    var elementArray = this._itemsElements.splice(from, 1);
    this._insertInDom(elementArray[0], to);
  };

  /*
   * Sorts the items and moves the rendered items accordingly
   */
  CollectionView.prototype.sort = function (method) {
    var _newOrder = this.items.map(function(item) { return item; });
    _newOrder.sort(method);
    _.each(_newOrder, function (item, index) {
      this.moveItem(item, index);
    }, this);

  };

  return {
    initialize: function (app) {
      app.sandbox.CollectionView = function (items, options) {
        options = options || {};
        options.items = items;
        return new CollectionView(options);
      };
    },
    CollectionView: CollectionView
  };
});
