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

/*	host and port will be mapped further by apache
*/
const hostname = '127.4.2.0';
const port = 2323;

/*	packages
*/
//	handle requests in general
//		there's a https version too if it gets to that point
const http = require('http');
//	to GET stuff
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//	jquery functions on node, better than regex for the moment
var cheerio = require('cheerio');




/*	functions
*/

//	getURL, to get a url, using xmlhttprequest
function getURL(url, callback) {
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

function htmolestATweet(rawTwatShite) {
	//	this is your actual disgusting regex html madness
	//	no wait, jquery / cheerio for dom manipulation
	console.log("htmolesting in action on; " + rawTwatShite);
	$ = cheerio.load(rawTwatShite);
	//	here's the interesting bit
	textContent = $('h1').text();
}


/*	actual server,      ENTRY POINT ------------------------------------
*/
const server = http.createServer((req, res) => {
	//	print request url
	console.log(Date.now().toString());
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

		//	bit of a durty way to strip strings
		//		-5 would give last 5 chars, -1 gives last 1 char
		//	taking the first char slash of the request name anyway
		var url = req.url.substr(1);
console.log(url);
		if (url.charAt(0) != 'h') {	//	genius url error checking
			url = "https://" + url;	//	probably need https
		}

		//	works beautiful, commented out for testing of string munge
		getURL(url, function(out){
			console.log("doing the get url callback now");
			//	todo; find out how res end does it's do, maybe send a 
			//		full packaged html
			//res.end("finishing that callback; \n" + out + "\n; (that was it)\n");
			var final = "finishing that callback; \n" + out + "\n; (that was it)\n";

			//	new tweet handler
			var donald = htmolestATweet(out);
			final += "after a munge; \n" + donald + "\n and that's the end of that";

			//	send output to the screen
			res.end(final);
			console.log("donezo");
		});

	}
});
//	actual entry point
server.listen(port, hostname, () => {
  console.log(`CONOR STEFANINI NODE running at http://${hostname}:${port}/`);
});
