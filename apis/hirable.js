const { Client } = require('pg')
const redis = require('redis')
const uuidv4 = require('uuid/v4')

const pgClient = new Client()

const connect = () => {
  pgClient.connect()
    .then(() => pgClient.query('SELECT $1::text as message', ['Hello world!']))
    .then(pgTest => console.log(pgTest.rows[0].message))
    .catch(err => console.log(err))
}

const search = async (queryFields, entityName) => {
  const { text, values } = pgEntitySelectAll(queryFields, entityName)
  return pgClient.query({ text, values })
}

const searchWithOrgName = async (queryFields, entityName) => {
  const { text, values } = pgEntitySelectAll(
    queryFields,
    entityName,
    [{ name: 'sup_orgs', on: `sup_orgs.org_name = ${queryFields.orgName}` }]
  )
  return pgClient.query({ text, values })
}

const adminInsertCorn = async (apiToken, orgID, url, location, role) => {
  // Authenticate...
  const { rows } = await pgClient.query({
    text: `SELECT COUNT(*)
      FROM official_orgs 
      WHERE official_orgs.api_token = $1`,
    values: [apiToken]
  })

  // Postgres returns a string for the count
  if (rows[0].count !== '1') {
    throw 'unauthorized'
  }

  // Build query from entity...
  const { text, values } = pgCardInsert(url, location, role, orgID)

  // Insert and return
  return pgClient.query({
    text: text,
    values: values
  })
}

const insertCorn = async (apiToken, url, location, role) => {
  // Authenticate...
  const { rows } = await pgClient.query({
    text: `SELECT sup_orgs.org_id 
      FROM official_orgs 
      INNER JOIN sup_orgs on official_orgs.org_id = sup_orgs.org_id 
      WHERE official_orgs.api_token = $1`,
    values: [apiToken]
  })

  if (rows.length == 0) {
    throw 'unauthorized'
  }

  // Build query from entity...
  const { text, values } = pgCardInsert(url, location, role, rows[0].org_id)

  // Insert and return
  return pgClient.query({
    text: text,
    values: values
  })
}

/**
 * create an API token, manually find comp in supported orgs or add if it doesnt exist 
 * 
 */
const makeOfficial = async (orgid, orgname) => {
  // Insert
  await pgClient.query({
    text: 'INSERT INTO sup_orgs VALUES($1, $2) ',
    values: [orgid, orgname]
  })

  // Generate a random, unique id
  let api_token = uuidv4()


  await pgClient.query({
    text: 'INSERT INTO official_rights VALUES($1, $2, $3)',
    values: [api_token, 'TRUE', 'FALSE']
  })

  return pgClient.query({
    text: 'INSERT INTO official_orgs VALUES($1, $2) RETURNING *',
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
function pgEntitySelectAll(queryFields, entityName, joinTables = []) {
  let entries = Object.entries(queryFields)
  let query = `SELECT * from ${entityName}`
  let values = []

  if (joinTables.length !== 0) {
    joinTables.forEach(join => {
      query += ` INNER JOIN ${join.name} ON ${join.on} \n`
    })
  }

  if (entries.length === 0) {
    return { text: query, values }
  }

  query += ' where '
  entries.forEach((el, i) => {
    query += `${el[0]} = $${i + 1} \nAND `
    values.push(el[1])
  })

  // Remove hanging AND and whitespace
  const text = query.slice(0, query.length - 5)
  console.log(text)

  return { text, values }
}

/**
 * Takes all the properties of some entity instance, constructs a query
 * ex. card: { location: 'seattle'} will generate a query to search card table
 * for locations matching seattle. 
 */
function pgCardInsert(src_url, location, role, org_id) {
  let completeEntity = {
    scrapetime: new Date().toISOString(),
    org_id,
    src_url,
    uids: [],
    role,
    location,
  }

  let entries = Object.entries(completeEntity)
  let query = `INSERT INTO cards VALUES(`
  let values = []
  entries.forEach((el, i) => {
    query += `$${i + 1},`
    values.push(el[1])
  })

  // Remove hanging comma, add close
  const text = query.slice(0, query.length - 1) + ') RETURNING *'

  return { text, values }
}

module.exports = {
  connect,
  search,
  searchWithOrgName,
  insertCorn,
  makeOfficial,
  adminInsertCorn,
}
