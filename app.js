const http = require('http')
const fs = require('fs')
const path = require('path')
const redis = require('redis')
const express = require('express')
const prom = require('./scratch/prom-meth').promMeth
const config = require('./.config/config.json')

const client = redis.createClient({
  auth_pass: config.cacheAuth,
  // tls: { checkServerIdentity: () => undefined }
})

client.on('connect', () => {
  console.log('Redis connected')
})

client.on('error', (err) => {
  console.log('Redis error: ' + err)
})

const app = express()

const port = process.env.PORT || 3000;

// TODO: S3 bucket!
app.use(express.static('./client/dist'))

app.get('/supported-corns', (req, res) => {
  client.get('supported-corns', (err, reply) => {
    console.log("redis.get ", reply);
    res.json(JSON.parse(reply))
  });
})

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html')
  // MAYBE: Store this in redis. Get it from Redis
  fs.readFile('./client/dist/index.html', (err, data) => {
    err != null
      ? console.log(err)
      : res.send(data)
  })
})

app.listen(port)

// http.createServer((req, res) => {
//   if (req.url == '/' || req.url == '/index.html') {
//     fs.readFile('./client/dist/index.html', (err, data) => {
//       res.writeHead(200, { 'Content-Type': 'text/html' });
//       res.write(data);
//       res.end();
//     });
//   } else {
//     var reqExt = path.extname(req.url);
//     if (reqExt == '.js') {
//       fs.readFile('./client/dist/' + req.url, (err, data) => {
//         res.writeHead(200, { 'Content-Type': 'text/javascript' });
//         res.write(data);
//         res.end();
//       });
//     } else if (reqExt == '.ico') {
//       fs.readFile('./client/dist/' + req.url, (err, data) => {
//         res.writeHead(200, { 'Content-Type': 'image/x-icon' });
//         res.write(data);
//         res.end();
//       });
//     } else if (reqExt == '.css') {
//       fs.readFile('./client/dist/' + req.url, (err, data) => {
//         res.writeHead(200, { 'Content-Type': 'text/css' });
//         res.write(data);
//         res.end();
//       });
//     } else if (reqExt == '.json') {
//       fs.readFile('./client/dist' + req.url, (err, data) => {
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.write(data);
//         res.end();
//       });
//     } else if (reqExt == '.png') {
//       fs.readFile('./client/dist/' + req.url, (err, data) => {
//         res.writeHead(200, { 'Content-Type': 'image/png' });
//         res.write(data);
//         res.end();
//       });
//     } else {
//       res.writeHead(404, { 'Content-Type': 'text/html' });
//       res.write('I could not find that for you.');
//       res.end();
//     }
//   }
// }).listen(port);
