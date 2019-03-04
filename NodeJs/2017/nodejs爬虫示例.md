#### nodeJs爬虫
```js
var http = require('http');
var fs = require('fs');
var https = require('https');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
const request = require('superagent')
require('superagent-charset')(request) // install charset 
var express = require('express');

var url = 'http://price.pcauto.com.cn/shangjia/';
var app = express();

var MongoClient = require('mongodb').MongoClient;
// 数据库cars
var DB_CONN_STR = 'mongodb://localhost:27017/cars'; 
 
http.get(url, function(sres) {
  var html1 = '';
  var chunks = [];

  sres.on('data', function(chunk) {
    chunks.push(chunk);
    html1 += chunk; 
  });

  sres.on('end', function() {
    // 将二进制数据解码成 gb2312 编码数据
    var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
    var $ = cheerio.load(html, {decodeEntities: false});
    writeHtml(html);
    var $dts = $('.dl-brand').find('dt');
    var $dds = $('.dl-brand').find('dd');
    var list = [];


    $dds.each(function(index) {
    	var $li = $(this);
    	var title = '';
    	switch (index) {
    		case 0:
    			title = '合资品牌';
    			break;
			case 1:
    			title = '自主品牌';
    			break;
			case 2:
    			title = '进口品牌';
    			break;
    	}
    	var $a = $li.find('a');
    	var brands = [];
    	$a.each(function(index) {
    		var $one = $(this);
    		brands.push({
    			link: $one.attr('href'),
    			img: $one.find('img').attr('src'),
    			name: $one.find('.name').text()
    		})
    	})

    	list.push({
    		title: title,
    		list: brands
    	})
    })

    console.log('列表数据')
    console.log(list)

    MongoClient.connect(DB_CONN_STR, function(err, db) {
	    console.log("连接成功！");
	    insertData(db, list, function(result) {
	        console.log(result);
	        db.close();
	    });
	});

  });
});

function writeHtml(html) {
	fs.writeFile('index.html', html, function(err) {
		if (err) {
			return console.error(err);
		}
		console.log('写入数据成功!')
	})
}

function insertData (db, data, callback) {
	 //连接到表 site
    var collection = db.collection('brand');
    //插入数据
    collection.insert(data, function(err, result) { 
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }     
        callback(result);
    });
}


```