const { Client } = require('pg')
const redis = require('redis')

const pgClient = new Client()

// const client = redis.createClient({
// auth_pass: config.cacheAuth,
// // tls: { checkServerIdentity: () => undefined }
// })

// client.on('connect', () => {
// console.log('Redis connected')
// })

// client.on('error', (err) => {
// console.log('Redis error: ' + err)
// }

exports.connect = () => {
  // TODO: Connect to Redis
  pgClient.connect().then(() =>
    pgClient.query('SELECT $1::text as message', ['Hello world!'])
  ).then(pgTest => console.log(pgTest.rows[0].message))
    .catch(err => console.log(err))
}

exports.search = () => {
  // First search cache.

  // If not there, search pg
}

exports.insertCorn = (apiToken, url, location, role) => { }

/**
 * create an API token, manually find comp in supported orgs or add if it doesnt exist 
 */
exports.makeOfficial = () => { }