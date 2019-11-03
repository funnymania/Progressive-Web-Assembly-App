const { Client } = require('pg')
const assert = require('assert')
const pgClient = new Client()
const hirable = require('../apis/hirable')
const uuidv4 = require('uuid/v4')

const connect = () => {
  return pgClient.connect()
    .then(() => pgClient.query('SELECT $1::text as message', ['Hello world!']))
    .then(pgTest => console.log(pgTest.rows[0].message))
    .catch(err => console.log(err))
}
function testRootUser() {
  const ghostsToken = uuidv4()

  describe('Ghosts Admin', function () {
    before(async () => {
      // Clear relevant tables.
      try {
        await pgClient.query('DELETE FROM cards')
        await pgClient.query('DELETE FROM official_rights')
        await pgClient.query('DELETE FROM official_orgs')
        await pgClient.query('DELETE FROM sup_orgs')
      } catch (err) {
        console.log(err)
      }

      // Create super user
      try {
        await pgClient.query(`INSERT INTO official_orgs VALUES ('${ghostsToken}', 0)`)
        await pgClient.query(`INSERT INTO sup_orgs VALUES (0, 'Ghosts')`)
        await pgClient.query(`INSERT INTO official_rights VALUES ('${ghostsToken}', TRUE, TRUE)`)
      } catch (err) {
        console.log(err)
      }
    })

    let offOrg
    describe('Create An Official Org', () => {
      it('should create official_org with insert access', async () => {
        try {
          offOrg = await hirable.makeOfficial(1, 'Mozilla Corporation')
        } catch (err) {
          assert.fail(err)
        }
      })
    })

    describe('Add card and Query', () => {
      it('should add the card, and find the unicorn via searching', async () => {
        try {
          const insRes = await hirable.adminInsertCorn(ghostsToken, offOrg.rows[0].org_id, 'https://mozilla.org', 'San Francisco', 'Software Engineer')
          const searchRes = await hirable.search({ location: insRes.rows[0].location }, 'cards')
          assert.deepStrictEqual(insRes.rows[0], searchRes.rows[0])
        } catch (err) {
          assert.fail(err)
        }
      })
    })
  })
}

const testOfficialOrg = () => {
  const ghostsToken = uuidv4()
  let offOrg

  describe('Official Orgs', function () {
    before(async () => {
      // Clear relevant tables.
      try {
        await pgClient.query('DELETE FROM cards')
        await pgClient.query('DELETE FROM official_rights')
        await pgClient.query('DELETE FROM official_orgs')
        await pgClient.query('DELETE FROM sup_orgs')
      } catch (err) {
        console.log(err)
      }

      // Create super user
      try {
        await pgClient.query(`INSERT INTO official_orgs VALUES ('${ghostsToken}', 0)`)
        await pgClient.query(`INSERT INTO sup_orgs VALUES (0, 'Ghosts')`)
        await pgClient.query(`INSERT INTO official_rights VALUES ('${ghostsToken}', TRUE, TRUE)`)
      } catch (err) {
        console.log(err)
      }

      // Add official org to test
      try {
        offOrg = await hirable.makeOfficial(1, 'Mozilla Corporation')
      } catch (err) {
        console.log(err)
      }
    })

    describe('Add a card associated with correct org', () => {
      it('should add the card, and search for that card', async () => {
        try {
          const insRes = await hirable.insertCorn(offOrg.rows[0].api_token, 'https://mozilla.org', 'San Francisco', 'Software Engineer')
          const searchRes = await hirable.search({ location: insRes.rows[0].location }, 'cards')
          assert.deepStrictEqual(insRes.rows[0], searchRes.rows[0])
        } catch (err) {
          assert.fail(err)
        }
      })
    })
  })
}

const testPublic = () => {
  const ghostsToken = uuidv4()
  let genUUID = uuidv4()

  describe('Public usage', function () {
    before(async () => {
      // Clear relevant tables.
      try {
        await pgClient.query('DELETE FROM cards')
        await pgClient.query('DELETE FROM official_rights')
        await pgClient.query('DELETE FROM official_orgs')
        await pgClient.query('DELETE FROM sup_orgs')
      } catch (err) {
        console.log(err)
      }

      // Create super user
      try {
        await pgClient.query(`INSERT INTO official_orgs VALUES ('${ghostsToken}', 0)`)
        await pgClient.query(`INSERT INTO sup_orgs VALUES (0, 'Ghosts')`)
        await pgClient.query(`INSERT INTO official_rights VALUES ('${ghostsToken}', TRUE, TRUE)`)
      } catch (err) {
        console.log(err)
      }

      // Add some cards
      try {
        await hirable.adminInsertCorn(ghostsToken, 2, 'https://mozilla.org', 'San Francisco', 'Software Engineer')
        await hirable.adminInsertCorn(ghostsToken, 1, 'https://mozilla.org', 'Seattle', 'Software Engineer')
        await hirable.adminInsertCorn(ghostsToken, 1, 'https://mozilla.org', 'Seattle', 'Systems Engineer')
      } catch (err) {
        assert.fail(err)
      }
    })

    describe('Add a card with incorrect api_token', () => {
      it('should return an error message', async () => {
        try {
          const insRes = await hirable.insertCorn(genUUID, 'https://mozilla.org', 'San Francisco', 'Software Engineer')
          assert.fail(insRes)
        } catch (err) {
          assert.ok(err)
        }
      })
    })

    describe('search for a card via orgName', () => {
      it('should return a result matching the orgName', async () => {
        try {
          const searchObj = { location: 'Seattle' }
          const { rows } = await hirable.search(searchObj, 'cards')
          assert.strictEqual(
            Object.entries(searchObj).every(entry => rows[0][entry[0]] === entry[1]),
            true
          )
        } catch (err) {
          assert.fail(err)
        }
      })
    })

    describe('search for a card which exists via many fields', () => {
      it('should return a result matching the fields searched for', async () => {
        try {
          const searchObj = { location: 'Seattle', role: 'Software Engineer', org_id: 1 }
          const { rows } = await hirable.search(searchObj, 'cards')
          assert.strictEqual(
            Object.entries(searchObj).every(entry => rows[0][entry[0]] === entry[1]),
            true
          )
        } catch (err) {
          assert.fail(err)
        }
      })
    })

    describe('search for a card which DOES NOT exist via many fields', () => {
      it('should return an empty array', async () => {
        try {
          const searchObj = { location: 'Walmart', role: 'Software Engineer', org_id: 1 }
          const { rows } = await hirable.search(searchObj, 'cards')
          assert.strictEqual(
            rows.length,
            0
          )
        } catch (err) {
          assert.fail(err)
        }
      })
    })

  })
}

connect()
  .then(hirable.connect())
  .then(testRootUser())
  .then(testOfficialOrg())
  .then(testPublic())
