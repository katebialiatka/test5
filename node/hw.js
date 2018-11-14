var http = require('http');

http.createServ
er(func
tion (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('Hello World');
}).listen(8080