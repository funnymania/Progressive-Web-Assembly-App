const { Client } = require('pg')
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4')
const saltRounds = 10;
const baseUrl = 'https://shinepickaw.rip/'

let mCclureEvents = (function () {
  function Connect() {
    const pgClient = new Client()

    pgClient.connect().then(() =>
      pgClient.query('SELECT $1::text as message', ['Hello world!'])
    ).then(pgTest => console.log(pgTest.rows[0].message))
      .then(() => pgClient.end())
      .catch(err => console.log(err))
  }

  function GetUserEmail(email) {
    return pgClient.query("SELECT email from user_cred where email='" + email + "'")
  }

  function GetUser(email) {
    return pgClient.query("SELECT * from user_cred where email='" + email + "'")
  }

  function InsertUser(email, pass) {
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
        if (insRes.rows.length == 0) {
          InsertUser(email, pass)
        }
      });
  }

  function Authenticate(email, pass) {
    // Get hash, compare with user submitted pass. 
    return pgClient.query("SELECT phash,uid FROM user_cred WHERE email = "
      + "'" + email + "'"
    ).then(authRes => ({
      isAuth: bcrypt.compare(pass, authRes.rows[0].phash),
      userData: authRes.rows[0]
    }))
  }

  function InsertSession(userData) {
    return pgClient.query("INSERT INTO sessions VALUES ("
      + "'" + true + "',"
      + "'" + new Date().toISOString + "',"
      + "'" + userData.uid + "',"
      + "'" + uuidv4() + "')"
    )
  }

  function GetPassUrl(url) {
    return pgClient.query("SELECT * FROM pass_reset_urls where url="
      + "'" + url + "'")
  }
  function UpdateStack(stack, uid) {
    return pgClient.query("UPDATE mccevents SET " +
      "bit=" + stack.bit + "," +
      "stack=" + stack.stack + "," +
      "queue=" + stack.queues + "," +
      "boxnumber=" + stack.boxNumber +
      " WHERE uid=" + uid
    )
  }
  function InsertPubStackShareUrl(stack) {
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
  function InsertPassResetUrl() {
    let newUrl = baseUrl + 'amnesia/' + uuidv4()

    return pgClient.query("INSERT INTO pass_reset_urls VALUES (" +
      "'" + newUrl + "'," +
      "'" + new Date().toISOString() + "'"
    );
  }

  function UpdatePassword(pass, uid) {
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
  function GetSession(sessid) {
    return bcrypt.genSalt(saltRounds)
      .then(salt => bcrypt.hash(pass, salt))
      .then(hash => pgClient.query("SELECT uid FROM sessions WHERE sess_hash = "
        + "'" + hash + "'"
        + " AND active=TRUE"
      ))
  }
  function GetStack(uid) {
    return pgClient.query("SELECT * from mccevents WHERE uid="
      + "'" + uid + "'")
  }
  function CreateStackShareUrl(uid) {
    let stackShareUrl = baseUrl + 'mCclureEvents/' + uuidv4()
    return pgClient.query("UPDATE mccevents SET " +
      "share_url='" + stackShareUrl + "'" +
      " WHERE uid=" + uid
    )
  }

  return {
    connectToDb: Connect(),
    doesEmailExist: GetUserEmail(email),
    addUser: InsertUser(email, pass),
    authenticate: Authenticate(email, pass),
    startSession: InsertSession(token),
    isPassUrlActive: GetPassUrl(url),
    updateStack: UpdateStack(stack, uid),
    insertPubStackShareUrl: InsertPubStackShareUrl(stack, url),
    insertPassResetUrl: InsertPassResetUrl(),
    sendEmail: SendEmail(email, url),
    updatePassword: UpdatePassword(pass),
    getSession: GetSession(token),
    getStack: GetStack(uid),
    createStackShareUrl: CreateStackShareUrl(uid),
  }
})()

module.exports = { mCclureEvents }