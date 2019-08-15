const fs = require('fs')
const redis = require('redis')
const express = require('express')
const mCcEvents = require('./apis/mCclureEvents')
const emails = require('./apis/emails')

mCcEvents.api.connectToDb()

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
  // Authenticate user, returns true or false
  mCcEvents.api.authenticate(req.body.email, req.body.password)
    .then(authRes => {
      if (!authRes.isAuth) {
        throw 'Incorrect ghost creds.'
      } else {
        // Start a session with user, unless they are already logged in.
        // Returns session id.
        mCcEvents.api.startSession(authRes.userData)
          .then(sessRes => {
            if (!sessRes.loggedIn) {
              res.set(
                {
                  'Content-Type': 'application/json',
                  'Set-Cookie': 'sid=' + sessRes.userToken + '; Secure; HttpOnly; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
                })
            }
            res.json({ msg: 'You are freely phasing. :)' })
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => res.json({ msg: err }))
})

app.post('/forgot-pass', (req, res) => {
  // Look up email.
  mCcEvents.api.GetUserEmail(req.body.email)
    .then(emailRes => {
      if (emailRes.rows.length > 0) {
        mCcEvents.api.InsertPassResetUrl()
          .then(forgetRes => emails.sendEmail(emailRes.rows[0].email, forgetRes.rows[0].url))
      }
    }).then(() =>
      res.json({ msg: 'We\'ll be in touch. Doublecheck you sent the right email' })
    )
    .catch(err => res.json({ msg: err }))
})

// This gets sent on submitting updated password from the clientside forgot-my-password route  
app.get('/amnesia/*', (req, res) => {
  // Check if link is active. 
  mCcEvents.api.isPassUrlActive(req.baseUrl).then(urlRes => {
    if (urlRes.rows.length > 0) {
      mCcEvents.api.updatePassword(req.body.password, urlRes.rows[0].uid)
        .then(upRes => res.json({ msg: 'Ghost pass is now official' }))
    } else {
      res.json({ msg: 'Link is inactive.' })
    }
  }).catch(err => console.log(err))
})

app.post('/save-stack', (req, res) => {
  let cookie = req.get('Cookie')
  let sessId = cookie.slice(cookie.indexOf('=') + 1)
  mCcEvents.api.getUserSession(sessId)
    .then(sessRes => {
      if (sessRes.rows.length > 0) {
        mCcEvents.api.updateStack(req.body, sessRes.rows[0].uid)
          .then(updateRes => {
            console.log(updateRes)
            if (updateRes.rows[0].share_url == null) {
              mCcEvents.api.createStackShareUrl(updateRes.rows[0].uid)
                .then(createRes => res.json({ msg: 'Stack saved.' }))
                .catch(err => console.log(err))
            } else {
              res.json({ msg: 'Stack saved.' })
            }
          })
          .catch(err => console.log(err))
      }
    })
})

app.post('/share-stack', (req, res) => {
  let cookie = req.get('Cookie')
  let sessId = cookie.slice(cookie.indexOf('=') + 1)
  mCcEvents.api.getUserSession(sessId)
    .then(sessRes => {
      if (sessRes.rows.length > 0) {
        mCcEvents.api.getStack(sessRes.rows[0].uid)
          .then(stackRes =>
            res.json({ url: stackRes.rows[0].share_url })
          )
      } else {
        // User is not logged in, save stack to public, inform user that link will be discarded
        // the day after next. URL will persist forever if you have an account
        // Validate if user is allowed to do this.
        mCcEvents.api.insertPubStackShareUrl(req.body)
          .then(stackRes => res.json({
            url: stackRes.rows[0].share_url,
            msg: 'Not a user.'
          })).catch(() => res.status(500).send({ msg: 'Something went wrong :dizzyface:' }))
      }
    })
})

app.post('/become-ghost', (req, res) => {
  // Check if email exists.
  mCcEvents.api.getUserEmail(req.body.email)
    .then(emailRes => {
      console.log(emailRes)
      if (emailRes.rows.length > 0) {
        res.json({ msg: 'This email is already in possession of someone else, likely yourself' })
      } else {
        // Insert into DB.
        mCcEvents.api.addUser(req.body.email, req.body.password)
          .then(() => res.json({ msg: 'Welcome haunted. Welcome haunted whole.' }))
          .catch(err => {
            console.log(err)
            res.json({ msg: err })
          })
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