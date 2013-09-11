/*global define:true */
define(['jquery', 'underscore'], function ($, _) {
  "use strict";

  function _generateMarker (id) {
    return '<script id="' + id + '"></script>';
  }

  function _markContainer (el, id) {
    var $marker = el.find("#" + id);
    var $container = $marker.parent();
    $marker.remove();
    $container.attr('data-collview', id);
    return $container;
  }

  var CollectionView = function (options) {
    if (!options.items) {
      throw new Error('No items provided to a Collection view');
    }
    this.items = options.items;
    this.options = options;
    this._id = "coll_view_" + _.uniqueId();
  };

  CollectionView.prototype.prepareItem = function (item) {
    var itemTemplate = this.options.itemTemplate;
    return itemTemplate(item);
  };

  CollectionView.prototype.render = function () {
    var containerMarker = _generateMarker(this._id);
    this.options.el.html(this.options.template(function () { return containerMarker; }));
    this._$container = _markContainer(this.options.el, this._id);
    _.each(this.items, function (item) {this._renderItem(item);}, this);
  };

  CollectionView.prototype.appendItem = function (item) {
    this.items.push(item);
    this._renderItem(item);
  };

  CollectionView.prototype.prependItem = function (item) {
    this.items.unshift(item);
    this._renderItem(item, 0);
  };

  CollectionView.prototype._renderItem = function (item, pos) {
    if (!this._$container) {
      return this.render();
    }
    var _renderedItem = $(this.prepareItem(item)).attr('data-collview-item', this._id);
    var renderedItems = this._$container.find("[data-collview-item=" + this._id + "]");

    var elementAtPos;
    if (pos === undefined) {
      elementAtPos = renderedItems[renderedItems.length - 1];
      if (elementAtPos) {
        $(elementAtPos).after(_renderedItem);
      } else {
        this._$container.append(_renderedItem);
      }
    } else {
      elementAtPos = renderedItems[pos] || renderedItems[renderedItems.length - 1];
      $(elementAtPos).before(_renderedItem);
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
