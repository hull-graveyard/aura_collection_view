/*global define:true */
define(function () {
  "use strict";

  var CollectionView = function (options) {
    if (!options.items) {
      throw new Error('No items provided to a Collection view');
    }
  };

  return {
    initialize: function (app) {
      app.sandbox.CollectionView = function (options) {
        return new CollectionView(options);
      };
    }
  };
});
