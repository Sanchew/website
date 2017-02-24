var queryString = require('querystring')
var cheerio = require("cheerio")
var co = require('co')
var corequest = require('co-request')
var express = require('express')
var router = express.Router()
var murl = require('./requestsupport')

var filter = ["tumblr.com","whicdn.com"]
router.get('/',function(req,resq){
	
	var k=queryString.escape(req.query.k)
	var page = req.query.p || 0
	resq.set('Content-Type','text/html;charset=utf8')
	resq.write("<style>*{padding:0;margin:0;}img{width:100%}</style>");
	co(function*(){
		var url = `http://www.google.com/search?async=_id:rg_s,_pms:s&q=${k}&asearch=ichunk&tbm=isch&ijn=${page}&gws_rd=cr`
		var body = yield corequest(murl(url))
		var dom = JSON.parse(body.body)[1][1]
		var $=cheerio.load(dom,{decodeEntities:false})
		var jsons = $('.rg_meta')
		for (var i=0;i<jsons.length;i++) {
			var json = JSON.parse(jsons.eq(i).html())
			resq.write(`<img src="${json.ou}">`)
		}
		resq.end()
	})

})

router.get('/o',function(req,resq){
	
	var k=queryString.escape(req.query.k)
	var page = req.query.p || 0
	resq.set('Content-Type','text/html;charset=utf8')
	resq.write("<style>*{padding:0;margin:0;}img{width:100%}</style>");
	co(function*(){
		var url = `http://www.google.com/search?async=_id:rg_s,_pms:s&q=${k}&asearch=ichunk&tbm=isch&ijn=${page}&gws_rd=cr`
		var body = yield corequest(murl(url))
		var dom = JSON.parse(body.body)[1][1]
		var $=cheerio.load(dom)//,{decodeEntities:false})
		var imgs = $('img')
		for (var i=0;i<imgs.length;i++) {
			var id = imgs.eq(i).attr("name")
			var detail = yield corequest(murl(`https://www.google.com/ajax/pi/imgdisc?imgdii=${id}`))
			var dbody=detail.body.substring(2,detail.body.length-2)
			var json = JSON.parse(dbody)
			var rels = json.rel
			for (var di=0;di<rels.length;di++){
				var rel = rels[di]
				resq.write(`<a rel="noopener noreferrer" target="_blank" href="${rel.ru}"><img rel="noopener noreferrer" src="${rel.ou}"></a>`)
			}
		}
		resq.end()
	})

})
router.get('/s',function(req,resq){
	
	var k=queryString.escape(req.query.k)
	var page = req.query.p || 0
	resq.set('Content-Type','text/html;charset=utf8')
	resq.write("<style>*{padding:0;margin:0;}img{width:100%}</style>");
	co(function*(){
		var url = `http://www.google.com/search?async=_id:rg_s,_pms:s&q=${k}&asearch=ichunk&tbm=isch&ijn=${page}&gws_rd=cr`
		var body = yield corequest(murl(url))
		var dom = JSON.parse(body.body)[1][1]
		var $=cheerio.load(dom)//,{decodeEntities:false})
		var imgs = $('img')
		for (var i=0;i<imgs.length;i++) {
			resq.write(`<img rel="noopener noreferrer" src=${imgs.eq(i).attr('src')}>`)
		}
		resq.end()
	})

})
module.exports = router

