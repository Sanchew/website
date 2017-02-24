var queryString = require('querystring')
var cheerio = require("cheerio")
var co = require('co')
var corequest = require('co-request')
var express = require('express')
var router = express.Router()
var murl = require('./requestsupport')

router.get('/',function(req,res){
	
	var q=req.query.q
	var n=req.query.n || 50
	co(function*(){
		var url = `https://www.google.com/search?q=${queryString.escape(q)}&num=${n}`
		var body = yield corequest(murl(url))
		var $=cheerio.load(body.body)//,{decodeEntities:false})
		var result = $('#ires .srg .rc')
		var rs = []
		result.each((i,e)=>{
			var $e = $(e)
			rs.push({
				url:$e.find('.r a').attr('href'),
				title:$e.find('.r a').text(),
				description:$e.find('.s .st').text()
			})
		})
		// res.end(JSON.stringify(rs))
		res.render('google.html',{
			title:q,
			datas:rs
		})
	})

})

module.exports = router

