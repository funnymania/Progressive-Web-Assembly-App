const fs = require('fs')
const redis = require('redis')
const express = require('express')
const config = require('./.config/config.json')
const mCcEvents = require('./apis/mCclureEvents')
// const { Client } = require('pg')
// const pgClient = new Client()

// pgClient.connect().then(() =>
//   pgClient.query('SELECT $1::text as message', ['Hello world!'])
// ).then(pgTest => console.log(pgTest.rows[0].message))
//   .then(() => pgClient.end())
//   .catch(err => console.log(err))

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
  mCcEvents.Authenticate(req.body.username, req.body.password).then(authRes => {
    if (authRes.rows.length == 0) {
      throw 'Incorrect ghost creds.'
    } else {
      // Start a session with user.
      startSession().then(tokenId => { token: tokenId })
        .then(magicOptionsBox => res.send(magicOptionsBox))
        .catch(err => console.log(err))
    }
  })
    .catch(err => res.json({ msg: err }))
})

app.post('/forgot-pass', (req, res) => {
  // Look up email.
  mCcEvents.DoesEmailExist(req.body.email).then(emailRes => {
    if (emailRes.rows.length > 0) {
      let URL = genRandURL()

      while (IsUrlInUse(URL)) {
        // Generate a *special url*, which we will have a route to cover all of
        // URL will be like /forgotIt/[TOKEN]

        // check if URL is actually unique with a look up on some table in DB
        URL = genRandURL()
      }

      // Persist special url to pass_reset_urls.
      insertSpecialURL(URL).then(() =>
        // Send email.
        sendEmail(email, URL)
      )
    }
  }).then(() =>
    res.json({ msg: 'We\'ll be in touch. Doublecheck you sent the right email' })
  )
    .catch(err => res.json({ msg: err }))
})

// This gets sent on submitting updated password from the clientside forgot-my-password route  
app.get('/forgotIt/[TOKEN]', (req, res) => {
  // Check if link is active. 
  IsUrlActive(req.baseUrl).then(urlRes => {
    if (urlRes.rows.length > 0) {
      updatePassword(req.body.password)
        .then(upRes => res.json({ msg: 'Ghost pass is now official' }))
    } else {
      res.json({ msg: 'Link is inactive.' })
    }
  }).catch(err => console.log(err))
})

app.post('/share-stack', (req, res) => {
  if (UserIsLoggedIn()) {
    mCcEvents.UpdateStack(req.body)
      .then(updatedEntry => updatedEntry.rows[0].share_url)
      .then(resUrl => {
        if (resUrl == null) {
          // Generate share_url.
          let URL = genShareUrl()

          while (IsShareUrlInUse(URL)) {
            URL = genShareUrl()
          }

          mCcEvents.UpdateStackShareUrl(URL)
            .then(stackRes => res.json({ url: stackRes.rows[0].share_url }))
        } else {
          res.json({ url: resUrl })
        }
      })
      .catch(err => console.log(err))
  } else {
    // Validate if user is allowed to do this.
    IsUserAllowedToShare().then(userOk => {
      if (userOk.judgement == false) {
        res.json({ msg: userOk.reasonWhy })
      } else {
        // Generate share_url.
        let URL = genShareUrl()

        while (IsShareUrlInUse(URL)) {
          URL = genShareUrl()
        }

        mCcEvents.UpdatePubStackShareUrl(URL)
          .then(stackRes => res.json({ url: stackRes.rows[0].share_url }))
      }
    }).catch(() => res.status(500).send({ msg: 'Something went wrong :dizzyface:' }))
  }
})

app.post('/become-ghost', (req, res) => {
  // Check if email exists.
  mCcEvents.DoesEmailExist(req.body.email)
    .then(emailRes => {
      if (emailRes > 0) {
        res.json({ msg: 'This email is already in possession of someone else, likely yourself' })
      } else {
        // Insert into DB.
        mCcEvents.addUser(req.body.email, req.body.password)
          .then(res => res.json({ msg: 'Welcome haunted. Welcome haunted whole.' }))
          .catch(err => res.json({ msg: err }))
      }
    })
    .catch(err => res.json({ msg: err }))
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