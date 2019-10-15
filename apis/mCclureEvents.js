const { Client } = require('pg')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const uuidv4 = require('uuid/v4')
const saltRounds = 10;
const baseUrl = 'https://shinepickaw.rip/'

let api = (function () {
  const pgClient = new Client()

  let Connect = function () {
    pgClient.connect().then(() =>
      pgClient.query('SELECT $1::text as message', ['Hello world!'])
    ).then(pgTest => console.log(pgTest.rows[0].message))
      .catch(err => console.log(err))
  }

  let GetUserEmail = function (email) {
    console.log("adding user")
    return pgClient.query({
      text: "SELECT email from user_cred where email = $1",
      values: [email]
    })
  }

  let GetUser = function (email) {
    return pgClient.query({
      text: "SELECT * from user_cred where email = $1",
      values: [email]
    })
  }

  let InsertUser = function (email, pass) {
    // Generate a random, unique UID.
    let uid = uuidv4()

    // Make up a name for the user?
    let name = 'Ghostfone'

    // Hash up the pass, add a little salt.
    return bcrypt.genSalt(saltRounds)
      .then(salt => bcrypt.hash(pass, salt))
      .then(hash => pgClient.query({
        text: "INSERT INTO user_cred VALUES ($1, $2, $3, $4)",
        values: [uid, hash, email, name]
      }))
      .then(insRes => {
        // Uuid already exits, re-roll.
        if (insRes.rowCount == 0) {
          InsertUser(email, pass)
        } else {
          console.log('User inserted.')
        }
      });
  }

  let Authenticate = function (email, pass) {
    let userData
    const query = {
      text: 'SELECT phash,uid,name FROM user_cred WHERE email = $1',
      values: [email]
    }

    // Get hash, compare with user submitted pass. 
    return pgClient.query(query)
      .then(authRes => {
        if (authRes.rows.length > 0) {
          userData = authRes
          return bcrypt.compare(pass, authRes.rows[0].phash)
        }
        else {
          throw 'Incorrect ghost creds.'
        }
      })
      .then(isCorrect => ({ isAuth: isCorrect, userData: userData.rows[0] }))
  }

  let InsertSession = function (userData) {
    const userToken = uuidv4()
    const hashToken = crypto.createHash('sha1').update(userToken).digest('hex')
    const querySel = {
      text: "SELECT sess_hash FROM sessions WHERE uid= $1",
      values: [userData.uid],
    }
    const queryIns = {
      text: "INSERT INTO sessions VALUES ($1, $2, $3, $4)",
      values: ['true', new Date().toISOString(), userData.uid, hashToken],
    }
    return pgClient.query(querySel)
      .then(selRes => {
        if (selRes.rows.length == 1) {
          console.log('Session already exists')
          selRes.loggedIn = true
          // return selRes
        }
        return pgClient.query(queryIns)
      })
      .then(selRes => {
        selRes.userToken = userToken
        return selRes
      })
  }

  let GetPassUrl = function (url) {
    return pgClient.query({
      text: "SELECT * FROM pass_reset_urls where url = $1",
      values: [url]
    })
  }

  let UpdateStack = function (stack, uid) {
    return pgClient.query({
      text: "UPDATE mccevents "
        + "SET bit = $1, stack = $2, queue = $3, boxnumber = $4"
        + "WHERE uid = $5 RETURNING *",
      values: [
        stack.bit,
        JSON.stringify(stack.stack),
        JSON.stringify(stack.queues),
        stack.boxNumber,
        uid
      ]
    })
      .then(upRes => {
        if (upRes.rows.length > 0) {
          return upRes
        } else {
          return pgClient.query({
            text: "INSERT INTO mccevents VALUES ($1, $2, $3, $4, $5) RETURNING *",
            values: [
              uid, stack.bit, JSON.stringify(stack.stack),
              JSON.stringify(stack.queues),
              stack.boxNumber
            ]
          })
        }
      })
  }

  let InsertPubStackShareUrl = function (stack) {
    let newUrl = uuidv4()
    return pgClient.query({
      text: "INSERT INTO mccevents_pub VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      values: [
        newUrl,
        new Date().toISOString(),
        stack.bit,
        JSON.stringify(stack.stack),
        JSON.stringify(stack.queues),
        stack.boxNumber
      ]
    })
  }

  let InsertPassResetUrl = function (uid) {
    let newUrl = baseUrl + 'amnesia/' + uuidv4()
    return pgClient.query("INSERT INTO pass_reset_urls VALUES (" +
      "'" + newUrl + "'," +
      "'" + uid + "'," +
      "'" + new Date().toISOString() + "')"
      + " RETURNING *"
    );
  }

  let UpdatePassword = function (pass, uid) {
    return bcrypt.genSalt(saltRounds)
      .then(salt => bcrypt.hash(pass, salt))
      .then(hash => pgClient.query("UPDATE user_cred SET " +
        "uid=uid" + "," +
        "phash='" + hash + "'," +
        "email=email," +
        "name=name" +
        " WHERE uid='" + uid + "'"
      ))
  }

  let GetSession = function (sessid) {
    if (sessid == 0) {
      sessid = uuidv4()
    }

    const hashToken = crypto.createHash('sha1').update(sessid).digest('hex')
    return pgClient.query({
      text: "SELECT uid FROM sessions WHERE sess_hash = $1 AND active = TRUE",
      values: [hashToken]
    })
  }

  let GetStack = function (uid) {
    return pgClient.query({
      text: "SELECT * from mccevents WHERE uid = $1",
      values: [uid]
    })
  }

  let CreateStackShareUrl = function (uid) {
    let stackShareUrl = uuidv4()
    return pgClient.query({
      text: "UPDATE mccevents SET share_url = $1 WHERE uid = $2",
      values: [stackShareUrl, uid]
    })
  }

  let GetPublicSharedStack = function (uuid) {
    return pgClient.query({
      text: "SELECT * from mccevents_pub WHERE share_url = $1",
      values: [uuid]
    })
  }

  let GetUserSharedStack = function (uuid) {
    return pgClient.query({
      text: "SELECT * from mccevents WHERE share_url = $1",
      values: [uuid]
    })
  }

  return {
    connectToDb: Connect,
    getUserEmail: GetUserEmail,
    getUser: GetUser,
    addUser: InsertUser,
    authenticate: Authenticate,
    startSession: InsertSession,
    isPassUrlActive: GetPassUrl,
    updateStack: UpdateStack,
    insertPubStackShareUrl: InsertPubStackShareUrl,
    insertPassResetUrl: InsertPassResetUrl,
    updatePassword: UpdatePassword,
    getStack: GetStack,
    getUserSession: GetSession,
    getUserSharedStack: GetUserSharedStack,
    getPublicSharedStack: GetPublicSharedStack,
    createStackShareUrl: CreateStackShareUrl,
  }
})()

module.exports = { api }