/*

서버 환경 설명

1. centos이고, 다음과 같이 nodejs 설치함
# sudo yum install epel-release
# sudo yum install nodejs
# node —version
v6.11.3
# npm —version
3.10.10

2.프로젝트 디렉토리 생성해둠
# cd ~
# mkdir ot
# cd ot
# npm init —yes
# npm install express body-parser request mysql —save —save-exact
# vi package.json
{
  "name": "ot",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index"
  },
  "dependencies": {
    "express": "4.14.0",
    "mysql": "2.11.1"
  }
}

3. 아래 코드 구동 방법
# sudo npm start

4. 참고
http://poiemaweb.com/express-basics
*/

// 운세봇 코드 index.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const http = require('request');
const bitfinex= require('./bitfinex');
const coinone = require('./coinone');


const app = express();


// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send('Hello World');
});

/*
const db = mysql.createConnection({
  host: 'db_ip',
  port: 3306,
  user: 'db_user_id',
  password: 'db_password',
  database: 'database_name'
});

// basic select, insert
app.get('/users/:id', (request, response) => {
  const id = request.params.id;
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], function(error, rows) {
    if (error) throw error;
    response.send(rows);
  });
});

app.post('/users/', (request, response) => {
  const { name, age, birthday } = request.body;
  const query = 'INSERT INTO users (name, age, birthday, created_at) VALUES (?, ?, ?, NOW())';
  db.query(query, [name, age, birthday], function(error, rows) {
    if (error) throw error;
    response.send('OK');
  });
});
*/

zodiacs = {
  '쥐띠': 14,
  '소띠': 13,
  '호랑이띠': 20,
  '토끼띠': 11,
  '용띠': 15,
  '뱀띠': 16,
  '말띠': 12,
  '양띠': 17,
  '원숭이띠': 19,
  '닭띠': 22,
  '개띠': 18,
  '돼지띠': 21
};
horoscopes = {
  '물병': 19,
  '물고기': 16,
  '양': 18,
  '황소': 15,
  '쌍둥이': 22,
  '게': 11,
  '사자': 21,
  '처녀': 17,
  '천칭': 20,
  '전갈': 13,
  '사수': 14,
  '염소': 12
};
periods = {
  '일간': 3,
  '내일': 4,
  '주간': 2,
  '월간': 1,
  '신년': 5
};

function make_fortune_api_url(body) {
  var params = body.action.params;
  var url = 'http://apihub.daum.net/datahub-fortune/v1/';
  url += params.zodiac ? 'zodiacs' : 'horoscopes';
  url += '/';
  url += params.zodiac ? zodiacs[params.zodiac] : horoscopes[params.horoscope];
  url += '.json';
  return url;
}

function make_result(requestbody, resultbody) {
  var params = requestbody.action.params;
  var is_zodiac = params.zodiac != null;
  var fortunecodename = is_zodiac ? params.zodiac : params.horoscope;
  var period = params.period;
  result = '{"fortunecodename":"';
  result += fortunecodename;
  result += '","period":"';
  result += period;
  result += '","value":"';
  for (var i = 0; i < resultbody.data.count; i++) {
    item = resultbody.data.items[i];
    if (item.periodCode == periods[period]) {
      data = is_zodiac ? item.totalFortune : item.fortune;
      result += data.replace(/<br\/>/g, ' ');
      break;
    }
  }
  result += '"}';
  console.dir(result);
  return result;
}

app.post('/fortuneteller', (request, response) => {
  http({
    url: make_fortune_api_url(request.body),
    headers: {
      'Authorization': 'KakaoAK 2e39fbb11d41b7be10570e164e1f487b'
    }}, (error, res, body) => {
      response.set('Content-Type', 'application/json');
      response.send(make_result(request.body, JSON.parse(body)));
  });
});

app.post('/coffeetest', (request, response) => {
	bitfinex.get_price('btc', response);
});

app.post('/coinone', (request, response) => {
  response.set('Content-Type', 'application/json');
  coinone.foo(request.body, response);
});
app.post('/bitfinex',(request, response) => {
	bitfinex.get_price(request.body.action.params.currency, response);
});

app.listen(80, () => { console.log('App listening on port 80!') });
