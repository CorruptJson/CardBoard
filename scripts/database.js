require('dotenv').config()
const fs = require('fs')
const accounts = `./database/accounts.json`

const { Client } = require('pg')


/* Function to run query */
const run_query = async (query, param) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  })
  await client.connect()
  const res = await client.query(query, param)
  await client.end()
  return res
}


/* Adds user to database */
const addUser = async (username, password) => {
  return await run_query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password])
}


/* Checks if username exists in the database.
** Return true if username is not in use, and return false if username is already used*/
const validateUsername = async (username) => {
  const match = await run_query('SELECT username FROM users WHERE username = $1', [username])
  if (match.rows.length === 0) {
    return true
  } else {
    return false
  }
}


/* Returns user object with matching username */
const retrieveUser = async (username) => {
  const match = await run_query('SELECT * FROM users WHERE username = $1', [username])
  if (match.rows.length != 0) {
    return match.rows[0]
  } else {
    return { username: undefined, password: undefined }
  }
}

/* Creates category */
const create_category = async (username, title) => {
  const query = `
  INSERT INTO category (username, category_title, category_index)
    VALUES ($1, $2, (
      SELECT CASE
        WHEN MAX(category_index) ISNULL then 0
        ELSE MAX(category_index) + 1
      END
      FROM category
      WHERE username = $3
    ))
  RETURNING *`
  return await run_query(query, [username, title, username])
}

/* Returns categories with matching user */
const retrieve_categories = async (username) => {
  return await run_query('SELECT * from category WHERE username = $1 ORDER BY category_index', [username])
}

/* Returns cards with matching user */
const retrieve_cards = async (username) => {
  return await run_query(`SELECT * from card WHERE category_id in (SELECT category_id FROM category WHERE username = $1)`, [username])
}

const delete_category = async (username, id) => {
  const res = await run_query(`DELETE from category WHERE username = $1 and category_id = $2 RETURNING category_index`, [username, id])
  if (res.rows[0]) {
    console.log(res.rows[0].category_index)
    return await run_query(`UPDATE category SET category_index = category_index - 1 WHERE category_index > $1`, [res.rows[0].category_index])
  } else {
    throw `No category with matching ID and username!`
  }
}
//delete_cards('jason', 116)
//run_query('delete from category where 1 = 1')
/*
create_category("jason", `h`)
  .then(run_query(`SELECT * from category WHERE username = 'jason'`)
    .then(res => console.log(res.rows)))
*/


//create_category(`jason`, `new_test`).then(res => console.log(res.rows[0].category_id))

module.exports = {
  addUser,
  validateUsername,
  retrieveUser,
  run_query,
  retrieve_categories,
  retrieve_cards,
  create_category
}

