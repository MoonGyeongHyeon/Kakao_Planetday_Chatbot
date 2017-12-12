var autobahn= require('autobahn');
var wsuri= "wss://api.poloniex.com";
var connection= new autobahn.Connection({
	url: wsuri,
	realm: 'realm1'
});
connection.onopen= function(session){
	console.log("open");
	function marketEvent (args,kwargs) {
                console.log(args);
        }
        function tickerEvent (args,kwargs) {
                console.log(args);
        }
        function trollboxEvent (args,kwargs) {
                console.log(args);
        }
        session.subscribe('BTC_XMR', marketEvent);
        session.subscribe('ticker', tickerEvent);
        session.subscribe('trollbox', trollboxEvent);
}
module.exports= {
	get_price: (currency) => {
		
		connection.open();
		console.log("get price");
		return "test2";
	}
}
