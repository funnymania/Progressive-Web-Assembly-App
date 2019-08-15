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
    return pgClient.query("SELECT email from user_cred where email='" + email + "'")
  }

  let GetUser = function (email) {
    return pgClient.query("SELECT * from user_cred where email='" + email + "'")
  }

  let InsertUser = function (email, pass) {
    // Generate a random, unique UID.
    let uid = uuidv4()

    // Make up a name for the user?
    let name = 'Ghostfone'

    // Hash up the pass, add a little salt.
    return bcrypt.genSalt(saltRounds)
      .then(salt => bcrypt.hash(pass, salt))
      .then(hash => pgClient.query("INSERT INTO user_cred VALUES ("
        + "'" + uid + "',"
        + "'" + hash + "',"
        + "'" + email + "',"
        + "'" + name + "')"
      )).then(insRes => {
        if (insRes.rowCount == 0) {
          InsertUser(email, pass)
        } else {
          console.log('User inserted.')
        }
      });
  }

  let Authenticate = function (email, pass) {
    let userData
    // Get hash, compare with user submitted pass. 
    return pgClient.query("SELECT phash,uid FROM user_cred WHERE email = "
      + "'" + email + "'"
    )
      .then(authRes => {
        userData = authRes
        return bcrypt.compare(pass, authRes.rows[0].phash)
      })
      .then(isCorrect => ({ isAuth: isCorrect, userData: userData.rows[0] }))
  }

  let InsertSession = function (userData) {
    const userToken = uuidv4()
    const hashToken = crypto.createHash('sha1').update(userToken).digest('hex')
    return pgClient.query("SELECT sess_hash FROM sessions WHERE uid='" + userData.uid + "'")
      .then(selRes => {
        if (selRes.rows.length == 1) {
          console.log('Session already exists')
          selRes.loggedIn = true
          return selRes
        } else {
          return pgClient.query("INSERT INTO sessions VALUES ("
            + "'" + true + "',"
            + "'" + new Date().toISOString() + "',"
            + "'" + userData.uid + "',"
            + "'" + hashToken + "')"
          )
        }
      })
      .then(selRes => {
        selRes.userToken = userToken
        return selRes
      })
  }

  let GetPassUrl = function (url) {
    return pgClient.query("SELECT * FROM pass_reset_urls where url="
      + "'" + url + "'")
  }
  let UpdateStack = function (stack, uid) {
    return pgClient.query("UPDATE mccevents SET " +
      "bit=" + stack.bit + "," +
      "stack=" + stack.stack + "," +
      "queue=" + stack.queues + "," +
      "boxnumber=" + stack.boxNumber +
      " WHERE uid=" + uid
    )
  }
  let InsertPubStackShareUrl = function (stack) {
    let newUrl = baseUrl + 'mCclureEvents/' + uuidv4()
    return pgClient.query("INSERT INTO mccevents_pub VALUES (" +
      "'" + newUrl + "'," +
      "'" + new Date().toISOString() + "'," +
      "'" + stack.stack + "'," +
      "'" + stack.queues + "'," +
      "'" + stack.boxNumber + "'"
      + " )"
    )
  }
  let InsertPassResetUrl = function () {
    let newUrl = baseUrl + 'amnesia/' + uuidv4()

    return pgClient.query("INSERT INTO pass_reset_urls VALUES (" +
      "'" + newUrl + "'," +
      "'" + new Date().toISOString() + "'"
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
        " WHERE uid=" + uid
      ))
  }
  let GetSession = function (sessid) {
    const hashToken = crypto.createHash('sha256').update(sessid).digest('hex')
    return pgClient.query("SELECT uid FROM sessions WHERE sess_hash = "
      + "'" + hashToken + "'"
      + " AND active=TRUE"
    )
  }
  let GetStack = function (uid) {
    return pgClient.query("SELECT * from mccevents WHERE uid="
      + "'" + uid + "'")
  }
  let CreateStackShareUrl = function (uid) {
    let stackShareUrl = baseUrl + 'mCclureEvents/' + uuidv4()
    return pgClient.query("UPDATE mccevents SET " +
      "share_url='" + stackShareUrl + "'" +
      " WHERE uid=" + uid
    )
  }

  return {
    connectToDb: Connect,
    getUserEmail: GetUserEmail,
    addUser: InsertUser,
    authenticate: Authenticate,
    startSession: InsertSession,
    isPassUrlActive: GetPassUrl,
    updateStack: UpdateStack,
    insertPubStackShareUrl: InsertPubStackShareUrl,
    insertPassResetUrl: InsertPassResetUrl,
    updatePassword: UpdatePassword,
    getUserSession: GetSession,
    getStack: GetStack,
    createStackShareUrl: CreateStackShareUrl,
  }
})()

module.exports = { api }