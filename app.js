const http = require('http')
const fs = require('fs')
const path = require('path')

const port = process.env.PORT || 3000;
http.createServer( (req,res) => { 
	if (req.url == '/' || req.url == '/index.html') {
			fs.readFile('./client/dist/index.html', (err,data) => {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(data);
				res.end();
			});
	} else { 
		var reqExt = path.extname(req.url);
		if (reqExt == '.js') {
			fs.readFile('./client/dist/' + req.url, (err,data) => {
				res.writeHead(200, {'Content-Type': 'text/javascript'});
				res.write(data);
				res.end();
			});
		} else if (reqExt == '.ico') {
			fs.readFile('./client/dist/' + req.url, (err,data) => {
				res.writeHead(200, {'Content-Type': 'image/x-icon'});
				res.write(data);
				res.end();
			});
		} else if (reqExt == '.css') {
			fs.readFile('./client/dist/' + req.url, (err,data) => {
				res.writeHead(200, {'Content-Type': 'text/css'});
				res.write(data);
				res.end();
			});
		} else if (reqExt == '.json') {
			fs.readFile('./client/dist' + req.url, (err,data) => {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.write(data);
				res.end();
			});
		} else if (reqExt == '.png') {
			fs.readFile('./client/dist/' + req.url, (err,data) => {
				res.writeHead(200, {'Content-Type': 'image/png'});
				res.write(data);
				res.end();
			});
		} else {
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write('I could not find that for you.');
			res.end();
		}
	}
}).listen(port);
