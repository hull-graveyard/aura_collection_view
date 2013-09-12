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
    $container.attr('data-collview', id);
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
    this._id = "coll_view_" + _.uniqueId();
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
    var containerMarker = _generateMarker(this._id);
    this.options.el.html(this.options.template(function () { return containerMarker; }));
    this._$container = _markContainer(this.options.el, this._id);
    _.each(this.items, function (item) {this._renderItem(item);}, this);
  };

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
    this.items.push(item);
    this._renderItem(item);
  };

  /*
   * Prepends an item to the collection
   * renders the item at the beginning of the view
   */
  CollectionView.prototype.prependItem = function (item) {
    this.items.unshift(item);
    this._renderItem(item, 0);
  };

  /*
   * Inserts an item to the collection at a specific position
   * renders the item in the view at that position
   */
  CollectionView.prototype.insertItemAt = function (item, pos) {
    this.items.splice(pos, 0, item);
    this._renderItem(item, pos);
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
   * Removes an item at a specific position
   * Removes its view
   */
  CollectionView.prototype.removeItemAt = function (pos) {
    this.items.splice(pos, 1);
    this._$container.find("[data-collview-item=" + this._id + "]").get(pos).remove();
  };

  /*
   * Generates the view for a specific item
   * Displays it at the correct position
   */
  CollectionView.prototype._renderItem = function (item, pos) {
    if (!this._$container) {
      return this.render();
    }
    var _renderedItem = $(this.prepareItem(item));
    var renderedItems = this._itemsElements;

    if (pos === undefined) {
      pos = Math.max(renderedItems.length, 0);
    } else {
      pos = Math.max(0, Math.min(pos, renderedItems.length));
    }
    renderedItems.splice(pos, 0, _renderedItem);
    if (pos === 0) {
      this._$container.prepend(_renderedItem);
    } else {
      renderedItems[pos - 1].after(_renderedItem);
    }
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
