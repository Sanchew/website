var express = require('express')
var compression = require('compression')
var favicon = require('serve-favicon')
var queryString = require('querystring')
var findbook = require('./searchbook')
var mapping = require('./mapping')
var findimage = require('./findimage')
var fetchimage = require('./fetchimage')
var google = require('./google')

var app = express()
app.use(compression({filter:function(req,res){
    console.info('original:'+req.originalUrl)
    console.info('result:'+/\/fb\?q=/.test(req.originalUrl))
    if(/\/fb\?q=/.test(req.originalUrl)) { 
	// console.info('disable compression')
	return false 
    }
    // console.info('enable compression')
    return compression.filter(req,res)
}}))
app.set('views',__dirname + '/views')
app.engine('html',require('hogan-express'))
app.set('view engine','html')
app.use(favicon(__dirname + '/public/favicon.ico'))
// app.use('/',mapping)
app.get('/pac',function(req,res){
    res.setHeader('Content-Type', 'application/x-ns-proxy-autoconfig')
    res.sendFile(__dirname + '/public/iphone.pac')
})
app.use('/static',express.static('public'))
app.use('/fb',findbook)
app.use('/fi',findimage)
// app.use('/fi/g',fetchimage)
app.use('/g',google)
app.get('/',function(req,res){
    // res.send('等待是一场与时光的较量')  
    res.render('index.html')
})
app.get('/guojianli',function(req,res){
    res.redirect('/static/loveyou/mylove.html')
})
var server = app.listen(process.env.PORT || 3000,function(){
    var host = server.address().address,
	port = server.address().port
    console.log('app listening at http://%s:%s',host,port)
})

