const ottoman = require('ottoman')
const { model, Schema } = require('ottoman');

// create connection to database/bucket
const connection = ottoman.connect({
  connectionString: 'couchbase://localhost',
  bucketName: 'travel',
  username: 'Administrator',
  password: 'password'
});

const airlineSchema = new Schema({
  callsign: String,
  country: String,
  name: String
})


// create model representing our airline
const Airline = model('Airline', airlineSchema, {
  collectionName: 'Airlines',
  scopeName: 'us'
})

const routeSchema = new Schema({
  source_airport: String,
  destination_airport: String,
  airline: { type: String, ref: 'Airline' },
  stops: { type: Number, default: 0 }
})

const Route = model('Route', routeSchema, {
  collectionName: 'Routes',
  scopeName: 'us'
})

// create an airline
const americanAirlines = new Airline({
  callsign: 'AA',
  country: 'United States',
  name: 'American Airlines'
})

// run the query
const runAsync = async() => {
  try {

    //save airline
     await americanAirlines.save()

    console.log(`success: American Airlines added`)

    const route = new Route({
      source_airport : "LAX",
      destination_airport : "DFW",
      airline: americanAirlines.id // assign id from the saved airline in the previous step
    })

    await route.save()

    console.log('success: Route between LAX and DFW for American Airlines added')

  } catch (error) {
    throw error
  }

  try {

    const filter = { source_airport: 'LAX'}
    const options = { consistency: ottoman.SearchConsistency.LOCAL }
    const laxRoute = await Route.findOne(filter,options)

    await laxRoute._populate('airline')

    console.log('Route Retrieved : ', laxRoute)
  }
  catch (error) {
    throw error
  }
 process.exit(0)
}

runAsync()
.catch((e) => console.log(e))
