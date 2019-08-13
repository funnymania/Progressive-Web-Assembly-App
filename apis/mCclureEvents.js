const { Client } = require('pg')

let mCclureEvents = (function () {
  function Connect() {
    const pgClient = new Client()

    pgClient.connect().then(() =>
      pgClient.query('SELECT $1::text as message', ['Hello world!'])
    ).then(pgTest => console.log(pgTest.rows[0].message))
      .then(() => pgClient.end())
      .catch(err => console.log(err))
  }

  function DoesEmailExist(email) {
    return pgClient.query("SELECT COUNT(*) from user_cred where email='" + email + "'")
  }

  function GetUser(email) {
    return pgClient.query("SELECT * from user_cred where email='" + email + "'")
  }

  function InsertUser(email, pass) {
    // Hash up the pass, add a little salt.
    let hashedPass = HashAndSalt(pass)

    // Generate a random, unique UID.
    let uid = RandomUnique32bitBanana()

    while (IsUidTaken(uid)) {
      uid = RandomUnique32bitBanana()
    }

    // Make up a name for the user?
    let name = 'Ghostfone'

    return pgClient.query("INSERT INTO user_cred VALUES ("
      + "'" + uid + "',"
      + "'" + hashedPass + "',"
      + "'" + email + "',"
      + "'" + name + "')"
    );
  }

  function Authenticate(email, pass) {
    // Hash up the pass, add a little salt.
    let hashedPass = HashAndSalt(pass)

    return pgClient.query("SELECT * FROM user_cred WHERE email = "
      + "'" + email + "' AND pass = "
      + "'" + hashedPass + "'"
    );
  }

  // Breakfast club.
  function HashAndSalt(pass) {

  }

  function RandomUnique32bitBanana() {

  }
  function IsUidTaken() {

  }

  return {
    connectToDb: Connect(),
    doesEmailExist: DoesEmailExist(email),
    addUser: InsertUser(email, pass),
    authenticate: Authenticate(email, pass)
  }
})()

module.exports = { mCclureEvents }