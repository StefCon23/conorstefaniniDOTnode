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
//var cheerio = require('cheerio');
//	jsdom ...
const jsdom = require("jsdom");
const { JSDOM } = jsdom;




/*	functions
*/

//	getURL, to get a url, using xmlhttprequest
function getURL(url, callback) {
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.setRequestHeader ("Accept", "text/xml; charset=iso-8859-1");
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
	//return probably some html
	//	actually maybe make an object / array of objects
	//	var tweets = [{user:"", tweet:"", rtsetc:""}];

	//	structure of a user's twitter page, and tweet 'stream' is;
	//	body ... > div id=doc > div id=page-outer > div id=page container
	//		> ....... > ol id="stream-items-id"

	//	jquery stuff
//	var data = $($.parseXML(rawTwatShite)).children('html');
//	return ($(data).find("stream-items-id").text());

	//	need to check out cheerio
	//const $ = cheerio.load(rawTwatShite);
//	var message = "getting through taht twwet stream; \n" + $('stream-items-id').text() + "\n; sipped";
	//var mess = $('fontcol.message').text();
	//console.log("getting through taht twwet stream; \n" + mess + "\n; sipped");



	//	return message
	var mess = "empty";

	//	works on cst.com to get main banner
	const dom = new JSDOM(rawTwatShite);
//	mess = dom.window.document.getElementById("fontcol").textContent;

	//	check if request is a tweet, a user, or a search or whatever
	//	currently assuming it's a user's page and a request for the 
	//		n most recent tweets of that user
	//	twitter user's page lists its tweets in a <div id="stream"
/*
	mess = dom.window.document.querySelector("js-tweet-text-container");
	if (mess != null) {
		return mess.textContent;
	} else {
		return null;
	}
*/


	var classes = dom.window.document.getElementsByClassName("js-tweet-text-container");
	/*
	if (classes != undefined) {
		try {
			console.log("classes; " + JSON.stringify(classes));
			console.log("class 0; " + JSON.stringify(classes[0]));
			console.log("class 0 keys; " + getKeys(classes[0]));
			console.log("first cihle; " + classes[0].firstElementChild);
			console.log("first childer keys; " + getKeys(classes[0].firstElementChild));
			console.log("parent; " + classes[0].parentElement);
			console.log("parent keys; " + getKeys(classes[0].parentElement));
			console.log("parent class; " + JSON.stringify(classes[0].parentElement.className));
			console.log("parent id; " + JSON.stringify(classes[0].parentElement.id));
			var childers = classes[0].parentElement.children;
			console.log("parent childers; " + JSON.stringify(childers));
			for (var i = 0; i < childers.length; ++i) {
				console.log("childer" + i + " id; " + JSON.stringify(childers[i].id));
				console.log("childer" + i + " class; " + JSON.stringify(childers[i].className));
			}
		} catch(err) {
			console.log("got an err; " + err);
		}
	}
	*/


	/*	twitter structure
	**
	**	so the class "js-tweet-text-container" contains a p tag with the
	**		tweet in it
	**	the parent element of "js-tweet-text-container" contains the
	**		other (relevant) classes;
	**		user/source;
	**			"stream-item-header" > "account-group js-account-group js-action-profile js-user-profile-link js-nav"
	**			-> "avatar js-action-profile-avatar"
	**			-> "FullNameGroup" > "fullname show-popup-with-id u-textTruncate "
	**			-> "username u-dir u-textTruncate"
	**			-> "stream-item-header" > "time"
	**		replies, rt's, favourite's;
	**			"stream-item-footer" > "ProfileTweet-actionCountList u-hiddenVisually"
	**			-> "ProfileTweet-action--reply u-hiddenVisually"
	**			-> "ProfileTweet-action--retweet u-hiddenVisually"
	**			-> "ProfileTweet-action--favorite u-hiddenVisually"
	*/

	var header;
	var username;
	var fullname;
	var tweet;
	var replies;
	var retweets;
	var favourites;

	mess = "";

	for (var i = 0; i < classes.length; ++i) {
		header = classes[i].parentElement.getElementsByClassName("stream-item-header")[0].getElementsByClassName("account-group js-account-group js-action-profile js-user-profile-link js-nav")[0];

		username = header.getElementsByClassName("username u-dir u-textTruncate")[0].innerHTML;
		//	they put <b> tags on the handle on the twitter site
		//username = username.replace("<b>\|<//b>","");
		username = username.replace("<b>","");
		username = username.replace("</b>","");

		fullname = header.getElementsByClassName("FullNameGroup")[0].getElementsByClassName("fullname show-popup-with-id u-textTruncate ")[0].innerHTML;

		tweet = classes[i].firstElementChild.innerHTML;

		//	todo; get any links in the tweet and reformat to be nice

		//	todo; get time; "stream-item-header" > "time"

		//	accessing the footer to get retweets etc.
		header = classes[i].parentElement.getElementsByClassName("stream-item-footer")[0].getElementsByClassName("ProfileTweet-actionCountList u-hiddenVisually")[0];

		replies = header.getElementsByClassName("ProfileTweet-action--reply u-hiddenVisually")[0].getElementsByClassName("ProfileTweet-actionCount")[0].getElementsByClassName("ProfileTweet-actionCountForAria")[0].innerHTML;
		retweets = header.getElementsByClassName("ProfileTweet-action--retweet u-hiddenVisually")[0].getElementsByClassName("ProfileTweet-actionCount")[0].getElementsByClassName("ProfileTweet-actionCountForAria")[0].innerHTML;
		favourites = header.getElementsByClassName("ProfileTweet-action--favorite u-hiddenVisually")[0].getElementsByClassName("ProfileTweet-actionCount")[0].getElementsByClassName("ProfileTweet-actionCountForAria")[0].innerHTML;
		//	replies, rt's etc. are currently stored in text, i.e.;
		//		replies = "20,000 replies"
		//	leaving it for the moment, but that string.replace() funct
		//		apparently takes regex, soooo replies.replace("/[^0-9]/g, '')

		mess += "\n---\n" + fullname + " (" + username + "); " + tweet + "; " + replies + ", " + retweets + ", " + favourites + "\n";
	}

	for (var i = 0; i < classes.length; ++i) {
		//mess += "\n---\n";
		//mess += classes[i].firstElementChild.innerHTML;
	}


	return mess;
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
