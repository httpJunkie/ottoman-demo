/* Demonstrate Query Builder using Mixed Mode */

const ottoman = require('ottoman')
const { Query } = require('ottoman')
const chalk = require("chalk")

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
})

// build and run the query
const generateQuery = async() => {
  try {
    const where =  { $and: [{ name: {$eq: 'name_val'}}, {country: { $isNotNull: true}}] }
    const query = new Query({where: where}, 'default:`travel`')
      .select([{ $field: 'name' }, { $field: 'country'}])
      .let([{ key: 'name_val', value: '\'Couchbase Airlines\''}])
      .limit(10)
      .build()
      console.log("Query Generated : ", chalk.blue(query))
      return query
  } catch (error) {
    throw error
  }
}

const executeQuery = async(query) => {
  try {
    const result = await connection.query(query)
    console.log("Query Result : " , result.rows)
  } catch (error) {
    throw error
  }
}

generateQuery()
  .then((query) => {
    executeQuery(query)
      .then(() => process.exit(0))
  })
  .catch((error) => console.log(error))
