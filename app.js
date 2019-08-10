const fs = require('fs')
const redis = require('redis')
const express = require('express')
const config = require('./.config/config.json')

const { Client } = require('pg')
const pgClient = new Client()

pgClient.connect().then(() =>
  pgClient.query('SELECT $1::text as message', ['Hello world!'])
).then(pgTest => console.log(pgTest.rows[0].message))
  .then(() => pgClient.end())
  .catch(err => console.log(err))

// const client = redis.createClient({
// auth_pass: config.cacheAuth,
// // tls: { checkServerIdentity: () => undefined }
// })

// client.on('connect', () => {
// console.log('Redis connected')
// })

// client.on('error', (err) => {
// console.log('Redis error: ' + err)
// })

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
  // client.get('supported-corns', (err, reply) => {
  // console.log("redis.get ", reply);
  // res.json(JSON.parse(reply))
  // });
})

app.post('/phase-in', (req, res) => {
  // Authenticate user
  let user = getUserCred(req.body.username, req.body.password)
  if (user.msg == undefined) {
    // Start a session with user.
    let tokenID = startSession()

    // Send cookie to user.
    res.send(magicOptionsBox)
  } else {
    res.json({ msg: 'Incorrect ghost creds.' })
  }
})

app.post('/forgot-pass', (req, res) => {
  // Look up email.
  let user = getUserFromEmail(req.body.email)

  let isUnique = false

  while (!isUnique) {
    // Generate a *special url*, which we will have a route to cover all of
    // URL will be like /forgotIt/[TOKEN]
    let URL = genRandURL()

    // check if URL is actually unique with a look up on some table in DB
    isUnique = isURLUnique(URL)
  }

  // Persist special url to pass_reset_urls.
  insertSpecialURL(URL)

  // Send email.
  sendEmail(URL)
})

// This gets sent on submitting updated password from the clientside forgot-my-password route  
app.get('/forgotIt/[TOKEN]', (req, res) => {
  // Check if link is active. 
  let url = getURL(req.baseUrl).msg
  if (url.msg == undefined) {
    res.sendStatus(200)
    updatePassword(req.body.password)
  } else {
    res.json({ msg: 'Link is inactive.' })
  }
})

app.get('/share-stack', (req, res) => {
  // Get user's share_url from mCclureevents. If share_url is empty, 
  // create one. 
  let shareUrl = getShareStackURL()

  if (shareUrl.msg == undefined) {
    res.json({ share_url: shareUrl })
  } else {
    res.status(500).send({ msg: 'Something went wrong :dizzyface:' })
  }

})

app.post('/become-ghost', (req, res) => {
  // Check if email exists.
  let query = emailExists(req.body)
  if (query.msg != undefined) {
    res.json({ msg: query.msg })
  } else {
    // Insert into DB.
    addUser(req.body)
  }
})

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html')
  fs.readFile('./client/dist/index.html', (err, data) => {
    err != null
      ? console.log(err)
      : res.send(data)
  })
})

app.listen(port)