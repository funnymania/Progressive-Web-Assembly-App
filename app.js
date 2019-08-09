const fs = require('fs')
const redis = require('redis')
const express = require('express')
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

app.use(express.json())

// TODO: Implement search. How to query and insert jobs into redis. 
app.post('/gather', (req, res) => {
  console.log(req.body)

  fs.readFile('./test.json', 'utf8', (err, data) => {
    console.log(data)
    err != null
      ? console.log(err)
      : res.json(JSON.parse(data))
  })
})

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