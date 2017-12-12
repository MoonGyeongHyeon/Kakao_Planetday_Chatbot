var http = require('request');

module.exports= {
  foo: (body, response) => {
    http({
      url: make_currency_api_url(body),
      headers: {
        'Authorization': 'KakaoAK 2e39fbb11d41b7be10570e164e1f487b'
      }
    }, function (err, res, body) {
      response.send(make_result(JSON.parse(body)));
    }); 
  } 
}

function make_currency_api_url(body) {
  var params = body.action.params;
  var url = 'https://api.coinone.co.kr/trades/';
  url += '?';
  url += 'currency=';
  url += params.currency ? params.currency : '';

  return url;
}

function make_result(body) {
  var len = body.completeOrders.length;
  var price = body.completeOrders[len-1].price;
  var result = '{"price":"';
  result += price;
  result += '"}';
  return result;
}
