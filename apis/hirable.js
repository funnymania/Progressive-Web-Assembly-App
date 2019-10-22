const { Client } = require('pg')
const redis = require('redis')
const uuidv4 = require('uuid/v4')
// const kv = require('kv')

const pgClient = new Client()
const kvClient = kv.startClient()

const connect = () => {
  // kvClient.connect()
  //   .then(() => console.log(kvClient.greeting()))
  //   .catch(err => console.log(err))

  pgClient.connect()
    .then(() => pgClient.query('SELECT $1::text as message', ['Hello world!']))
    .then(pgTest => console.log(pgTest.rows[0].message))
    .catch(err => console.log(err))
}

const search = async (queryFields, entityName) => {
  // First search k-v
  // let { results, report } = await kvClient.search(entity.location, entity.role, entity.compName)
  // if (results !== '') {
  //   console.log(report)
  //   return results
  // }

  // If not found, generate parameterized query from entity
  const { text, values } = pgEntitySelectAll(queryFields, entityName)
  let { rows } = await pgClient.query({ text, values })

  return rows
}


const insertCorn = async (apiToken, url, location, role) => {
  // Authenticate...
  const { rows } = await pgClient.query({
    text: 'SELECT sup_orgs.org_id from official_rights INNER JOIN sup_orgs on official_rights.orgid = sup_orgs.org_id WHERE official_rights.api_token = $1',
    values: [apiToken]
  })

  if (rows.length == 0) {
    return { msg: 'You are authorized to do this.' }
  }

  // Build query from entity...
  const { text, values } = pgCardInsert(url, location, role, authRows.org_id)

  // Insert and return
  await pgClient.query({
    text: text,
    values: values
  })

  return { msg: 'Unicorn has been added!' }
}

/**
 * create an API token, manually find comp in supported orgs or add if it doesnt exist 
 */
const makeOfficial = async (orgid, orgname) => {
  // Insert.
  await pgClient.query({
    text: 'INSERT INTO org_id VALUES($1, $2) ',
    values: [orgid, orgname]
  })

  // Generate a random, unique id
  let api_token = uuidv4()

  await pgClient.query({
    text: 'INSERT INTO official_orgs VALUES($1, $2)',
    values: [api_token, orgid]
  })
}

const insertSupportedOrg = async (org_id, org_name) => {

}

/**
 * Takes all the properties of some entity instance, constructs a query
 * ex. card: { location: 'seattle'} will generate a query to search card table
 * for locations matching seattle. 
 */
function pgEntitySelectAll(queryFields, entityName) {
  let entries = queryFields.entries()
  let text = `SELECT * from ${entityName}`
  let values = []
  if (entries.length == 0) {
    return { text, values }
  }

  text += ' where '
  entries.forEach((el, i) => {
    text += `${el[0]} = $${i + 1}, `
    values.add(el[1])
  })

  // Remove hanging comma and space
  text.splice(-2, 2)

  return { text, values }
}

/**
 * Takes all the properties of some entity instance, constructs a query
 * ex. card: { location: 'seattle'} will generate a query to search card table
 * for locations matching seattle. 
 */
function pgCardInsert(src_url, location, role, orgid) {
  let completeEntity = {
    scrapetime: new Date().toISOString(),
    orgid,
    src_url,
    uids: [],
    role,
    location,
  }

  let entries = completeEntity.entries()
  let text = `INSERT INTO cards VALUES(`
  let values = []
  entries.forEach((el, i) => {
    text += `$${i + 1},`
    values.add(el[1])
  })

  // Remove hanging comma, add close
  text.splice(-1, 1, ')')

  return { text, values }
}

module.exports = {
  connect,
  search,
  insertCorn,
  makeOfficial,
}