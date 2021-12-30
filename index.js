console.log('Starting App..');
const http = require('http');
const fs = require('fs');
var requests = require("requests");

const htmlDesign = fs.readFileSync('design.html','utf-8');

const replaceVal = (oldData, valData) => {
	let newData = '';
	newData = oldData.replace("{%tempval%}", valData.main.temp);
	newData = newData.replace("{%tempmin%}", valData.main.temp_min);
	newData = newData.replace("{%tempmax%}", valData.main.temp_max);
	newData = newData.replace("{%location%}", valData.name);
	newData = newData.replace("{%country%}", valData.sys.country);
	newData = newData.replace("{%tempstatus%}", valData.weather[0].main);
	
	return newData;
}

const server = http.createServer( (req, res) => {
	if(req.url == "/"){
		requests('https://api.openweathermap.org/data/2.5/weather?q=ahmedabad&appid=b3878ef812813e33bb8a75f5dbf12f74')
		.on("data", (chunk) => {
				const objdata = JSON.parse(chunk);
				const realData = replaceVal(htmlDesign, objdata);

				res.writeHead(200,{'Content-Type': 'text/html'});
				res.write(realData);
		}).on("end", (err) => {
			if (err){
				res.write('<h1 align="center">Something went wrong!</h1>');
				return console.log("connection closed due to errors", err);
			} 
			res.end();
		});

	}else{	
		res.writeHead(404,{'Content-Type': 'text/html'});
		res.end('<h1 align="center">Page not found!</h1>');
	}
		
});

server.listen(8080, () => {
	let AT = 'http://localhost:' + server.address().port;
	console.log('Server is listening at %j', AT);
});
console.log('App is running!');