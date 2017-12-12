url='https://api.bitfinex.com/v1';
var request= require('request');
module.exports= {
	get_price: (currency, response) => {
		var res;
		console.log(currency);
		request.get(url+'/trades/'+currency+'usd',
			function(err, res, body){
				res= JSON.parse(body);
				console.log(res[0]['price']);
				response.set('Content-Type', 'application/json');
  				response.send({
    					'temp':res[0]['price']
  				});

			}
		)
	}
}
