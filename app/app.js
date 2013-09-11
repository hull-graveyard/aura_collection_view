require(['bower_components/aura/lib/aura'], function (Aura) {
  "use strict";
  Aura({debug: {enable: true}})
    .use('../src/collection_view')
    .start({ components: 'body' }).then(function() {
      console.warn('Aura started...');
    });
});
