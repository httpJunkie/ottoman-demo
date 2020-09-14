const ottoman = require('ottoman')
const { model, Schema } = require('ottoman');

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

const schema = new Schema({
  airlineId:String,
  callsign: String,
  country: String,
  name: String,
  modifiedBy: String
})

schema.pre('save', async (document) => {
  document.modifiedBy = await (async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve('Arun Vijayraghvan'), 1000)
    })
  })()
});

//create refdoc index
schema.index.findByName = {
    by: 'name',
    type: 'refdoc'
};

// create model representing our airline
const Airline = model('Airline', schema, {
  collectionName: 'Airlines',
  scopeName: 'us',
  idKey:'airlineId'
})

// Creating a use that matches the model
const united = new Airline({
  callsign: 'Emirates',
  country: 'United States',
  name: 'Emirates Airlines',
  airlineId:'Emirates202009'
})

// run the query
const runAsync = async() => {
  try {
    await united.save()
    console.log(`success: airline added`)
  } catch (error) {
    throw error
  }
  process.exit(0)
}

ottoman.ensureIndexes()
  .then(() => {
    runAsync()
      .catch((e) => console.log(e))
  })
