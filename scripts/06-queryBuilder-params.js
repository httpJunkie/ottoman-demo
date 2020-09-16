/* Demonstrate Query Builder using Parameters */

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

// a querybuilder can be used with parameters, access functions, and mix modes
const generateQuery = async() => {
  try {
    const params = {
      select : [{ $field: 'name' }, { $field: 'country'}],
      let : [{ key: 'name_val', value: '\'Couchbase Airlines\''}],
      where: { $and: [{ name: {$eq: 'name_val'}}, {country: { $isNotNull: true}}] },
      limit: 10
    };
    const query = new Query(params, 'default:`travel`').build();
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
