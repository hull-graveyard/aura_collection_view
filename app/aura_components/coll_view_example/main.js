/*global define:true */
(function () {
  "use strict";

  function collectionTemplate (renderItems) {
    return "<ul>" +renderItems() + "</ul>";
  }

  function itemTemplate (item) {
    return "<li>" + item.value + "</li>";
  }



  define({
    generateData: function () {
      var random = Math.random().toString().substring(2).split('');
      console.log(random);
      return random.map(function (number) {
        return { value: parseInt(number, 10) };
      });
    },
    initialize: function () {
      var data = this.generateData();
      var coll = this.sandbox.CollectionView(data, {
        el: this.$el,
        template: collectionTemplate,
        itemTemplate: itemTemplate
      });
      coll.render();

      setTimeout(function () {
        coll.appendItem({value: 1000});
      }, 1000);
      setTimeout(function () {
        coll.prependItem({value: 2000});
      }, 2000);
      setTimeout(function () {
        coll.insertItemAt({value: -10}, 3);
      }, 2500);
      setTimeout(function () {
        coll.removeItem(data[1]);
        coll.removeItem(data[1]);
      }, 3000);
      setTimeout(function () {
        coll.removeItemAt(1);
      }, 3500);
      setTimeout(function () {
        coll.moveItem(data[2], 3);
      }, 4500);
      setTimeout(function () {
        coll.sort(function (a, b) {
          return a.value - b.value;
        });
      }, 5000);
    }
  });



})();

