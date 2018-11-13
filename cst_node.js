/*	cst_node.js
**	a node js site for a conorstefanini domain
**	CST 5 Nov 2018
*/

/*	TODO
**	-	decide view, react / angular
**	-	set up a 404 page, redirect all errs to it
**	-	https
**	-	redirect http to https
*/

//	host and port will be mapped by apache
const hostname = '127.4.2.0';
const port = 2323;

//	packages
const http = require('http');
//const https = require('https');
const fetch = require("node-fetch");
//	fetch wasn't great
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;






/*	get URL, get a url
**		like a twitter page, rss feed, whatever
*/
var getURL = async function (url, callback) {
console.log("starting up the getURL function on; " + url);
//.then(res => res.json())	//	make data json ?
	const data = await(fetch(url))
		.then((out) => {
console.log("output is; " + JSON.stringify(out));
console.log("");
console.log("~~~~~~~~~~~~~~~~~~~~");
console.log("output again is; " + JSON.stringify(out));
				//console.log(out.timestamp.slice(11)));
				//for (var i = 0; i < out.numberofresults; ++i) {
					//rtpiHtml += out.results[i].route;
					//rtpiHtml += out.results[i].destination.toUpperCase();
					//rtpiHtml += hrsMinsMinus(out.results[i].arrivaldatetime, out.timestamp);
/*
(async () => {
  const rawResponse = await fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({a: 1, b: 'Textual content'})
  });
  const content = await rawResponse.json();

  console.log(content);
})();
*/


console.log(out);
console.log(responseText.out);

			//	ain't no
			callback(out);

			return out;
		})
		.catch(err => {throw err});
	
	if (data == null) {
		return;
	}
}



function getHTTP(url, callback) {
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			console.log("status; " + request.status);
			switch (request.status) {
				case "200":
					console.log("noice; " + request.responseText);
					break;
				case 301: 
					console.log("status 301 from; " + url);
					//console.log("char at 4 is; " + url.charAt(4));
					if (url.charAt(4) == ':') {
						console.log("try a https");
						getHTTP("https://" + url.substr(7), callback);
					}
					break;
				default:
					console.log("oop, non accounted for status; " 
						+ request.status);
					break;
			}
			if ((request.status == "301") && (url.charAt(5) == ':')) {
				//	this is just stupid
				url = "https://" + url.substr(7);
console.log('btw, you might get in an infinite (recursive) loop');
				//	another ...
				getHTTP(url, callback);
			}
			//	deal with otehr headers, 404, 302, etc.
		}
	}
	request.send();

	console.log(request.responseText);
	callback(request.responseText);
}

//htmolestATweet(rawTwatShite) {
	//	this is your actual disgusting regex html madness
//}


/*	actual SERVER	----------------------------------------------------
*/
const server = http.createServer((req, res) => {
	//	print request url
	console.log(Date.now());
	console.log("request is; " + req.url);
	//	going to be dicking with url's soon

	//	healthy result anyway
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');

	//	main cst.node page, just return name
	if (req.url == '/') {
		res.end('CONOR STEFANINI .NODE\n');
	} else {
		//	a different request supplied via url
console.log("sbstr -3; " + req.url.substr(-3));
console.log("sbstr +3; " + req.url.substr(+3));
console.log("sbstr 0; " + req.url.substr(0));
console.log("sbstr len; " + req.url.substr(req.url.length));
		//	use a ? delimeter and a usr=xxxxx status=xxxxx format

		//	bit of a durty way to strip strings
		//		-5 would give last 5 chars, -1 gives last 1 char
		//	taking the first char slash of the request name anyway
		var spurl = req.url.substr(1);
		console.log(spurl);
		if (spurl.charAt(0) != 'h') {	//	genius url error checking
			spurl = 'http://' + spurl;	//	probably need https
		}

		//	works beautiful, commented out for testing of string munge
/*		getHTTP(spurl, function(out){
			console.log("doing the get url callback now");
			res.end("finishing that callback; " + JSON.stringify(out) + '; (that was it)\n');
			console.log("donezo");
			});
*/
	}
		//res.end( + '\n');
//console.log("printing result anyway; " + res);
});

server.listen(port, hostname, () => {
  console.log(`CONOR STEFANINI NODE running at http://${hostname}:${port}/`);
});
