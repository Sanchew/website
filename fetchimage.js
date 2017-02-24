var queryString = require('querystring')
var cheerio = require("cheerio")
var co = require('co')
var corequest = require('co-request')
var express = require('express')
var router = express.Router()
var murl = require('./requestsupport')

router.get('/',function(req,resq){
	
	var url=req.query.iu
	co(function*(){
		var r = yield corequest(burl(url))
		resq.set('Content-Type',r.headers['content-type'])
		resq.end(r.body,'binary')
	})

})

module.exports = router

