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
const https = require('https');

//	creating response, independent of request
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  //res.tite('CONOR STEFANINI .NODE');
  res.end('CONOR STEFANINI .NODE\n');
});

server.listen(port, hostname, () => {
  console.log(`CONOR STEFANINI NODE running at http://${hostname}:${port}/`);
});
