
window.setInterval(function () {

  console.log('1');
  $.ajax({
    type: 'GET',
    url: 'http://127.0.0.1:1337',
    dataType: 'JSON',
    success: function (data) {
      console.log(data);
      $('.location img').css({
        'width' : '10cm',
        'height' : '10cm',
        'position': 'relative',
        'transform': 'rotate(' + data + 'deg)',
      })
    }
  });
}, 500);