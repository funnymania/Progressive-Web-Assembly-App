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
  const { text, values } = pgEntitySelectAll(queryFields, entityName,
    { name: 'sup_orgs', using: 'org_id' }
  )
  return pgClient.query({ text, values })
}

const userAddCorn = async (uid, src_url) => {
  const insert = {
    active: [src_url],
    inactive: [],
  }

  try {
    const insRes = await pgClient.query({
      text: `INSERT INTO hirable (cards, uid)
      VALUES($1, $2) RETURNING *`,
      values: [JSON.stringify(insert), uid]
    })

    if (insRes.rows[0].cards == null) {
      const upRes = await pgClient.query({
        text: `UPDATE hirable
          SET cards = jsonb_set(cards, '{active,0}', '$1', TRUE)
          WHERE $2`,
        values: [src_url, uid]
      })

      return { msg: 'Success!' }
    } else {
      return { msg: 'Success!' }
    }
  } catch (err) {
    return { err: 1, msg: 'API error!' }
  }
}

const userGetActiveCards = async (uid) => {
  const selRes = await pgClient.query(`
    SELECT cards 
    FROM hirable
    WHERE uid = '${uid}'
  `)

  if (selRes.rows[0].cards.active.length !== 0) {
    let activeCards = selRes.rows[0].cards.active

    let text = 'SELECT * from cards INNER JOIN sup_orgs USING(org_id) WHERE src_url IN ('
    let cnt = 1
    activeCards.forEach(key => {
      text += `$${cnt},`
    })

    text = text.slice(0, -1) + ')'

    const selRes2 = await pgClient.query({
      text,
      values: [...activeCards]
    })

    return selRes2.rows
  } else {
    return selRes.rows[0].cards.active
  }
}

const userGetInactiveCards = async (uid) => {
  const selRes = await pgClient.query(`
    SELECT cards 
    FROM hirable
    WHERE uid = '${uid}'
  `)

  if (selRes.rows[0].cards.inactive.length !== 0) {
    let inactiveCards = selRes.rows[0].cards.inactive

    let text = 'SELECT * from cards WHERE src_url IN ('
    let cnt = 1
    inactiveCards.forEach(key => {
      text += `$${cnt},`
    })

    text = text.slice(0, -1) + ')'

    const selRes2 = await pgClient.query({
      text,
      values: [...inactiveCards]
    })

    return selRes2.rows
  } else {
    return selRes.rows[0].cards.inactive
  }
}

const adminInsertCorn = async (apiToken, orgID, url, location, role, desc = '') => {
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
  const { text, values } = pgCardInsert(url, location, role, orgID, desc)

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

const getSupOrgs = async () => {
  return pgClient.query('SELECT * from sup_orgs')
}

const insertSupportedOrg = async (org_id, org_name) => {

}

/**
 * Takes all the properties of some entity instance, constructs a query
 * ex. card: { location: ['seattle']} will generate a query to search card table
 * for locations matching seattle. 
 */
function pgEntitySelectAll(queryFields, entityName, join = {}) {
  let entries = Object.entries(queryFields)
  let query = `SELECT * from ${entityName}`
  let values = []
  if (join.name !== undefined) {
    query += ` INNER JOIN ${join.name} USING(${join.using}) \n`
  }

  query += ' where '
  let cnt = 1
  entries.forEach((entry) => {
    if (entry[1].length !== 0) {
      query += `${entry[0]} IN(`
      entry[1].forEach(value => {
        query += `$${cnt}, `
        values.push(value)
        cnt += 1
      })

      query = query.slice(0, query.length - 2)
      query += ') AND\n'
    }
  })

  // Remove hanging AND and whitespace
  const text = query.slice(0, query.length - 5)
  console.log(text)

  return { text, values }
}

function pgCardInsert(src_url, location, role, org_id, desc) {
  let completeEntity = {
    scrapetime: new Date().toISOString(),
    org_id,
    src_url,
    uids: [],
    role,
    location,
    desc,
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
  insertCorn,
  makeOfficial,
  adminInsertCorn,
  getSupOrgs,
  userAddCorn,
  userGetActiveCards,
  userGetInactiveCards,
}
