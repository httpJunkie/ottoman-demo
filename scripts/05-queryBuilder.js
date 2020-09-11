const ottoman = require('ottoman')
const { Query } = require('ottoman');

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

// run the query
const runAsync = async() => {
  try {
    const select = [{ $field: 'name' }]
    const query = new Query({}, 'default:`travel`')
      .select(select).limit(5).build()
      console.log(query)
      const result = await connection.query(query)
      console.log(result.rows)
  } catch (error) {
    throw error
  }
  process.exit(0)
}

runAsync()
  .catch((e) => console.log(e))
