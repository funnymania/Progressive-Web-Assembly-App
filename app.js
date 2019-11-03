const fs = require('fs')
const express = require('express')
const mCcEvents = require('./apis/mCclureEvents')
const hirable = require('./apis/hirable')
const emails = require('./apis/emails')
const compression = require('compression')

const baseUrl = 'https://shinepickaw.rip/#/'

mCcEvents.api.connectToDb()
hirable.connect()

const app = express()

const port = process.env.PORT || 3000;

app.use(compression())
app.use(express.static('./client/dist'))
app.use(express.json())

/**
 * Query DB 
 */
app.post('/gather', async (req, res) => {
  console.log(req.body)
  try {
    const { rows } = await hirable.search(req.body)
    res.json(rows[0])
  } catch (err) {
    console.log(err)
    res.json({ error: 1, msg: 'Tool broke! Please contact dev.' })
  }
})


app.post('/v1/insert-corn', (req, res) => {
  return { msg: 'You are not authorized to do this.' }

})

/**
 * Get actives from 
 */
app.get('/captured-cards', (req, res) => {
  const test = {
    aliveCorns: [
      { url_posting: 'https://www.google.com', compName: 'google' },
      { url_posting: 'https://www.google.com', compName: 'twitch' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
    ],
    deadCorns: [
      { url_posting: 'https://www.google.com', compName: 'twitch' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
      { url_posting: 'https://www.google.com', compName: 'amazon' },
    ]
  }

  res.json(test)
})

app.get('/supported-corns', (req, res) => {
  const testRet = {
    orgs: [
      { name: "twitter" },
      { name: "google" },
      { name: "apple" },
      { name: "twitch" },
    ]
  }

  res.json(testRet)
  // client.get('supported-corns', (err, reply) => {
  // console.log("redis.get ", reply);
  // res.json(JSON.parse(reply))
  // });
})

app.post('/phase-in', (req, res) => {
  // Authenticate user, returns true or false
  mCcEvents.api.authenticate(req.body.email, req.body.pass)
    .then(authRes => {
      if (!authRes.isAuth) {
        throw 'Incorrect ghost creds.'
      } else {
        // Start a session with user, unless they are already logged in.
        // Returns session id.
        mCcEvents.api.startSession(authRes.userData)
          .then(sessRes => {
            res.set(
              {
                'Content-Type': 'application/json',
                'Set-Cookie': 'sid=' + sessRes.userToken + '; Expires=Wed, 21 Oct 2030 07:28:00 GMT',
              })
            console.log('setting cookie')
            console.log('jsoning')
            res.json({ msg: 'You are freely phasing. :)', name: authRes.userData.name })
          })
          .catch(err => {
            console.log(err)
            res.json({ error: 1, msg: 'Something peculiar has happened on the other side' })
          })
      }
    })
    .catch(err => {
      console.log(err)
      res.json({ error: 1, msg: err })
    })
})

app.post('/forgot-pass', (req, res) => {
  // Look up email.
  mCcEvents.api.getUser(req.body.email)
    .then(emailRes => {
      if (emailRes.rows.length > 0) {
        mCcEvents.api.insertPassResetUrl(emailRes.rows[0].uid)
          .then(forgetRes => {
            emails.api.sendEmail(emailRes.rows[0].email, forgetRes.rows[0].url)
          })
      }
    }).then(() =>
      res.json({ msg: 'We\'ll be in touch. Doublecheck you sent the right email' })
    )
    .catch(err => res.json({ msg: err }))
})

app.get('/seeSharedStack/:user/:id', (req, res) => {
  let uuid = req.params.id
  let userOrPub = req.params.user

  if (userOrPub == 'p') {
    mCcEvents.api.getPublicSharedStack(uuid)
      .then(getRes => {
        console.log(getRes.rows)
        if (getRes.rows.length > 0) {
          res.json({
            the_stack: {
              stack: getRes.rows[0].stack,
              queues: getRes.rows[0].queue,
              bit: getRes.rows[0].bit,
              processesAllowed: getRes.rows[0].boxnumber,
            }
          })
        } else {
          res.json({ error: 1, msg: 'Stack no longer exists.' })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ msg: err })
      })
  } else if (userOrPub == 'u') {
    mCcEvents.api.getUserSharedStack(uuid)
      .then(getRes => {
        console.log(getRes.rows)
        if (getRes.rows.length > 0) {
          res.json({
            the_stack: {
              stack: getRes.rows[0].stack,
              queues: getRes.rows[0].queue,
              bit: getRes.rows[0].bit,
              processesAllowed: getRes.rows[0].boxnumber,
            }
          })
        } else {
          res.json({ error: 1, msg: 'Stack no longer exists.' })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ msg: err })
      })
  } else {
    res.json({ msg: 'Invalid url' })
  }
})

// This gets sent on submitting updated password from the clientside forgot-my-password route  
app.post('/amnesia/*', (req, res) => {
  let url = 'https://' + 'shinepickaw.rip' + req.originalUrl
  console.log(url)
  // Check if link is active. 
  mCcEvents.api.isPassUrlActive(url).then(urlRes => {
    console.log(urlRes)
    if (urlRes.rows.length > 0) {
      mCcEvents.api.updatePassword(req.body.pass, urlRes.rows[0].uid)
        .then(upRes => res.json({ msg: 'Ghost pass is now official' }))
    } else {
      res.json({ msg: 'Link is inactive.' })
    }
  }).catch(err => console.log(err))
})

app.post('/save-stack', (req, res) => {
  let cookie = req.get('Cookie')
  if (cookie != undefined) {
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
        } else {
          res.json({ error: 1, msg: 'Your session has ended, please log-in.' })
        }
      })
  } else {
    res.json({ error: 1, msg: 'Session cookie not found' })
  }
})

app.post('/share-stack', (req, res) => {
  let cookie = req.get('Cookie')
  if (cookie != undefined) {
    let sessId = cookie.slice(cookie.indexOf('=') + 1)
    mCcEvents.api.getUserSession(sessId)
      .then(sessRes => {
        if (sessRes.rows.length > 0) {
          mCcEvents.api.getStack(sessRes.rows[0].uid)
            .then(stackRes => {
              console.log(stackRes)
              res.json({ url: baseUrl + 'mCclureEvents/u/' + stackRes.rows[0].share_url })
            })
        } else {
          res.json({ error: 1, msg: 'Your session has ended, please log-in.' })
        }
      })
  } else {
    mCcEvents.api.insertPubStackShareUrl(req.body)
      .then(stackRes => res.json({
        url: baseUrl + 'mCclureEvents/p/' + stackRes.rows[0].share_url,
        msg: 'Not a user.'
      })).catch(() => res.status(500).send({ error: 1, msg: 'Something went wrong :dizzyface:' }))
  }
})

app.get('/load-stack', (req, res) => {
  let cookie = req.get('Cookie')
  if (cookie != undefined) {
    let sessId = cookie.slice(cookie.indexOf('=') + 1)
    mCcEvents.api.getUserSession(sessId)
      .then(sessRes => {
        if (sessRes.rows.length > 0) {
          mCcEvents.api.getStack(sessRes.rows[0].uid)
            .then(stackRes => {
              if (stackRes.rows.length > 0) {
                console.log(stackRes)
                res.json({
                  the_stack: {
                    stack: stackRes.rows[0].stack,
                    queues: stackRes.rows[0].queue,
                    bit: stackRes.rows[0].bit,
                    processesAllowed: stackRes.rows[0].boxnumber,
                  }
                })
              } else {
                res.json({ error: 1, msg: 'User has no stack data yet.' })
              }
            })
        } else {
          res.json({ error: 1, msg: 'Your session has ended, please log-in.' })
        }
      })
  }
})

app.post('/become-ghost', (req, res) => {
  // Check if email exists.
  mCcEvents.api.getUserEmail(req.body.email)
    .then(emailRes => {
      console.log(emailRes)
      if (emailRes.rows.length > 0) {
        res.json({ error: 1, msg: 'This email is already in possession of someone else, likely yourself' })
      } else {
        // Insert into DB.
        mCcEvents.api.addUser(req.body.email, req.body.pass)
          .then(() => res.json({ msg: 'Welcome haunted. Welcome haunted whole.' }))
          .catch(err => {
            console.log(err)
            res.json(
              { error: 1, msg: 'Something peculiar has happened on the other side' })
          })
      }
    })
    .catch(err => {
      res.json({ error: 1, msg: 'Something peculiar has happened on the other side' })
    })
})

app.get('/mCclureEvents/*/*', (req, res) => {
  console.log('Getting vue from mCcEvents')
  res.set('Content-Type', 'text/html')
  fs.readFile('./client/dist/index.html', (err, data) => {
    err != null
      ? console.log(err)
      : res.send(data)
  })
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