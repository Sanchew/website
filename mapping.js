var express = require('express')
var router = express.Router()

router.use('/', function(req,res,next){
    var referer = req.headers.referer
    console.info(`fuck reffer ${referer}`)
    if(req.url == '/' && referer){
	var matchs = referer.match(/http:\/\/\w+.\w+(.*$)/)
        if (matchs.length > 1 && matchs[1].length > 1) {
	    res.redirect(matchs[1])
	    return
        }
    }
    next()
})

module.exports = router
