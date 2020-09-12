
/* Demonstrate Query Builder using Mixed Mode */

const ottoman = require('ottoman')
const { Query } = require('ottoman');

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

// build and run the query
const runAsync = async() => {
  try {
   const where =  { $and: [{ name: {$eq: 'name_val'}}, {country: { $isNotNull: true}}] };
   const query = new Query(where, 'default:`travel`')
      .select([{ $field: 'country' }])
      .let([{ key: 'name_val', value: '\'Couchbase Airlines\''}])
      .limit(10)
      .build();
      console.log("Query Generated : ",query);
      const result = await connection.query(query)
      console.log("Query Result : " ,result.rows)
  } catch (error) {
    throw error
  }
  process.exit(0)
}

runAsync()
  .catch((e) => console.log(e))
