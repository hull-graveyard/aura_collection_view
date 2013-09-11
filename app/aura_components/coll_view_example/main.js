(function () {

  function collectionTemplate (renderItems) {
    return "<ul>" +renderItems() + "</ul>";
  };

  function itemTemplate (item) {
    return "<li>" + item.value + "</li>";
  };



  define({
    generateData: function () {
      var random = Math.random().toString().substring(2).split('');
      console.log(random);
      return random.map(function (number) {
        return { value: number };
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
        coll.appendItem({value: "Added"});
      }, 1000);
      setTimeout(function () {
        coll.prependItem({value: "Added too"});
      }, 2000);
      setTimeout(function () {
        coll.insertItemAt({value: "Added at pos"}, 3);
      }, 2500);
      setTimeout(function () {
        coll.removeItem(data[1]);
        coll.removeItem(data[1]);
      }, 3000);
      setTimeout(function () {
        coll.removeItemAt(1);
      }, 3500);
    }
  });



})();

