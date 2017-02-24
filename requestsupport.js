
function murl(url){
	var options = {
		url: url,
		headers: {
		        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1',
		}
	}
	return options
}

function burl(url){
	return {
		url: url,
		encoding: null,
		headers: {
		        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1',
		}
	}
}

module.exports = murl
