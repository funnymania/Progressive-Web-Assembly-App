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
      } catch (err) {
        console.log(err)
      }

      // Create super user
      try {
        await pgClient.query(`INSERT INTO official_orgs VALUES ('${ghostsToken}', 0)`)
        await pgClient.query(`INSERT INTO official_rights VALUES ('${ghostsToken}', TRUE, TRUE)`)
      } catch (err) {
        console.log(err)
      }
    })

    describe('Create An Official Org', () => {
      it('should create official_org with insert access', async () => {
        try {
          await hirable.makeOfficial(1, 'Mozilla Corporation')
        } catch (err) {
          done(err)
          console.log(err)
        }
      })
    })

    describe('Add card and Query', () => {
      it('should add the card, and find the unicorn via searching', async () => {
        try {
          const insRes = await hirable.insertCorn(ghostsToken, 'https://mozilla.org', 'San Francisco', 'Software Engineer')
          await hirable.search({ location: insRes.rows.location }, 'cards')
        } catch (err) {
          console.log(err)
          done(err)
        }
      })
    })
  })
}

// As my API token...
// Adding a card (twitter) and searching that card should result in said card returned

// As another's...
// Adding a card from a different orgid should not be allowed.
// Adding a card from associated orgid should be allowed. 
// Searching should be allowed. 

// As public
// Inserting should not be allowed.
// Searching should be allowed. 

const testOfficialOrg = () => {

}

const testPublic = () => {

}

connect().then(hirable.connect()).then(testRootUser())