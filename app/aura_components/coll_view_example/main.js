define({
  generateData: function () {
    var random = Math.random().toString().substring(2).split('');
    return random.map(function (number) {
      return { value: number };
    });
  },
  initialize: function () {
    var data = this.generateData();
    /* To Be Continued */
  }
})
