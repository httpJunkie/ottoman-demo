/* Demonstrate Query Builder using Mixed Mode (Params/Access Functions) */
const { Ottoman, Query } = require('ottoman')
const ottoman = new Ottoman({collectionName: '_default'});

ottoman.connect({
    connectionString: 'couchbase://localhost',
    bucketName: 'travel',
    username: 'Administrator',
    password: 'password'
});

const generateQuery = async() => {
  try {
    const where =  { $and: [
      { country: {$eq: 'United States'}},
      { _type: {$eq: 'Airline'}}
    ] }
    // pass in our query as a condition expression
    const query = new Query({ where }, 'default:`travel`')
      .select([
        { $field: 'name' }, 
        { $field: 'country' }
      ])
      .limit(10)
      .build()
      console.log('Query Generated: ', query)
      return query
  } catch (error) {
    throw error
  }
}

const executeQuery = async(query) => {
  try {
    const result = await ottoman.query(query)
    console.log('Query Result: ' , result)
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
