var queryString = require('querystring')
var cheerio = require("cheerio")
var co = require('co')
var corequest = require('co-request')
var express = require('express')
var router = express.Router()

router.get('/',function(req,resq){
	
	var bookname=req.query.q
	resq.set('Content-Type','text/html;charset=utf8')
	resq.write("<style>*{color:#999}a{color:#009;}</style>");
	var data = {
		book_name:bookname,
		pageSize:999,
		keyword1:bookname
	}
	var baseServer = "http://123.127.171.216:8080"
	co(function*(){
		console.info("request:"+baseServer+"/clcnopac/Search.action?"+queryString.stringify(data))
		var body = yield corequest(baseServer+"/clcnopac/Search.action?"+queryString.stringify(data))
		var $=cheerio.load(body.body,{decodeEntities:false})
		var rows=$('.search_result tr')
		
		resq.write(`<div>total ${rows.length}</div>`)
		for(var i=0;i<rows.length;i++) {
			var $e=rows.eq(i)
			var row={}
			row.title=$e.find(".title_list b").html()
			row.author=$e.find("ul").eq(1).text().replace(/\s/g,"").replace(/(&nbsp;)+/g,"|")
			row.detailUrl=$e.find("a[onclick]").attr("onclick").match(/.*?'(.*?)'.*/)[1]
			var randomnum = 10*Math.random(),
			    id=row.detailUrl.match(/marc_id=(\d+)/)[1],
			    cat=row.detailUrl.match(/cat=(\w+)/)[1],
			    dbid=row.detailUrl.match(/dbid=(\d+)/)[1],
			    unique=row.detailUrl.match(/unique=(\w+)/)[1]
			
			var keyvalue = '';
  			if(cat=='ww'){
  			   cat='cat1';
  			}
  			
  			if(cat=='cat1'){
  			        keyvalue='012b';
  			}
  			if(cat=='sr'){
  			        keyvalue='012c';
  			}
  			if(cat=='st'){
  			        keyvalue='012d';
  			} if(cat=='gj'){
  			        keyvalue='0127d';
  			}
  			if(cat=='df'){
  			        keyvalue='0126d';
  			        if(unique.indexOf('aq')>=0)
  			        {
  			        keyvalue='012d2';
  			        }
  			}
  			if(cat=='mg'){
  			        keyvalue='0127d';
  			}
  			if(cat=='aq'){
  			        if(dbid=='cat1'){
  			         keyvalue='012d1';
  			        }
  			        if(dbid=='df'){
  			      	   keyvalue='012d2';
  			        }
  			        if(dbid=='sr'){
  			      	   keyvalue='012d3';
  			        }
  			        
  			}
			var apiurl = baseServer + "/clcnopac/api.action?marc_id="+id+"&cat="+cat+"&type=table&key="+keyvalue+"&rnum="+randomnum
			console.info(`num:${i}-->${apiurl}`)
			var subbody = yield corequest(apiurl)
			var $$ = cheerio.load(subbody.body,{decodeEntities:false})
			if (!/本室借阅/.test($$.html())) continue
			$$("tr").find("td").each((i,e) => {
				var $e=$$(e)
				if ($e.html() == "在库") {
					$e.css({color:"green"})
				}
			})
			row.detail = $$.html("table")

			var resBody="<div class='row'>"
			resBody+="<div>"+row.title+"<a target='_blank' style='margin-left:20px;' href='"+baseServer+row.detailUrl+"'>detail</a></div>"
			resBody+="<div>"+row.author+"</div>"
			resBody+=row.detail
			resBody+="</div><hr>"
			resq.write(resBody)
			console.info("response body")
		}
		resq.end()
	})

})

module.exports = router

